// src/services/appSummaryService.js
import pool from "../db/pool.js";

/**
 * Tüm apps kayıtlarını ve ilgili geo_tx istatistiklerini döndürür.
 *
 * Dönüş:
 * [
 *   {
 *     id,
 *     name,
 *     web_address,
 *     description,
 *     members,
 *     tx_count,
 *     total_score
 *   },
 *   ...
 * ]
 */

export async function getAppCitiesStats(appId) {
  const result = await pool.query(
    `
    SELECT
      c.id,
      c.name,
      COUNT(DISTINCT gt.user_address) AS members,
      COUNT(*)                        AS tx_count,
      COALESCE(SUM(gt.tx_score), 0)   AS score
    FROM geo_tx gt
    JOIN cities c
      ON c.id = gt.city_id
    WHERE gt.app_db_id = $1
      AND gt.status = 'CONFIRMED'
    GROUP BY c.id, c.name
    ORDER BY score DESC, tx_count DESC, c.name ASC
    `,
    [appId]
  );

  return result.rows.map((row) => ({
    id: row.id,
    name: row.name,
    members: Number(row.members) || 0,
    tx_count: Number(row.tx_count) || 0,
    score: Number(row.score) || 0,
  }));
}

export async function getAllAppsWithStats() {
  const result = await pool.query(
    `
    SELECT
      a.id,
      a.name,
      a.domain,
      a.description,
      COALESCE(stats.members, 0)      AS members,
      COALESCE(stats.tx_count, 0)     AS tx_count,
      COALESCE(stats.total_score, 0)  AS total_score
    FROM apps a
    LEFT JOIN (
      SELECT
        app_db_id,
        COUNT(*) FILTER (WHERE status = 'CONFIRMED')                        AS tx_count,
        COUNT(DISTINCT user_address) FILTER (WHERE status = 'CONFIRMED')    AS members,
        COALESCE(SUM(tx_score) FILTER (WHERE status = 'CONFIRMED'), 0)      AS total_score
      FROM geo_tx
      GROUP BY app_db_id
    ) AS stats
      ON stats.app_db_id = a.id
    ORDER BY total_score DESC, tx_count DESC, a.id ASC
    `
  );

  // JSON formatını frontend'in istediği şekilde map edelim
  return result.rows.map((row) => ({
    id: row.id,
    name: row.name,
    web_address: row.domain,
    description: row.description,
    members: Number(row.members) || 0,
    tx_count: Number(row.tx_count) || 0,
    total_score: Number(row.total_score) || 0,
  }));
}

export async function getAppsByCityWithStats(cityId) {
  // 1) Önce global app listesini al
  const allApps = await getAllAppsWithStats();

  const result = [];

  // 2) Her app için şehir kırılımını çek
  for (const app of allApps) {
    const citiesForApp = await getAppCitiesStats(app.id);

    // Bu app'in cityId'sine denk gelen satırı bul
    const found = Array.isArray(citiesForApp)
      ? citiesForApp.find((c) => Number(c.id) === Number(cityId))
      : null;

    if (found) {
      result.push({
        id: app.id,
        name: app.name,
        web_address: app.web_address,
        description: app.description,
        // Şehir özelinde gelen değerleri kullanıyoruz
        members: found.members ?? 0,
        tx_count: found.tx_count ?? 0,
        total_score: found.score ?? 0,
      });
    }
  }

  return result;
}