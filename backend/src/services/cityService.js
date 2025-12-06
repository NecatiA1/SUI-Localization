// src/services/cityService.js

import pool from "../db/pool.js";

/**
 * name:      'Istanbul'
 * countryCode: 'TR'
 * regionName:  optional, şimdilik boş geçebiliriz
 */
export async function resolveCityFromCoords({ lat, lon }) {
  // TODO: Hackathon sonrası: gerçek bir geocoding servisine bağla
  // (OpenStreetMap / Nominatim / Mapbox / Google vs.)

  // Şimdilik: lat/lon'u 'virtual city' ismine çeviren basit bir placeholder:
  const roundedLat = Math.round(lat * 100) / 100;
  const roundedLon = Math.round(lon * 100) / 100;

  const name = `City ${roundedLat}, ${roundedLon}`;
  const countryCode = "UN"; // Unknown

  const cityId = await findOrCreateCity({
    name,
    countryCode,
  });

  return { cityId, name, countryCode };
}

export async function findOrCreateCity({
  name,
  countryCode,
  regionName = null,
}) {
  // 1) Önce var mı diye kontrol et
  const existing = await pool.query(
    "SELECT id FROM cities WHERE name = $1 AND country_code = $2 LIMIT 1",
    [name, countryCode]
  );

  if (existing.rows.length > 0) {
    return existing.rows[0].id;
  }

  // 2) Yoksa yeni şehir ekle
  const insertResult = await pool.query(
    `INSERT INTO cities (name, country_code, region_name)
     VALUES ($1, $2, $3)
     RETURNING id`,
    [name, countryCode, regionName]
  );

  return insertResult.rows[0].id;
}

/**
 * Harita için şehir istatistiklerini döner:
 *
 * {
 *   id,
 *   name,
 *   region,        // country_code
 *   code,          // name'in ilk 3 harfi, UPPER
 *   transactions,  // geo_tx'de CONFIRMED sayısı
 *   score,         // city_stats.total_score
 *   lat,           // cities.center_lat
 *   lng            // cities.center_lon
 * }
 */
export async function getCityMapStats() {
  const query = `
    SELECT
      c.id,
      c.name,
      c.country_code AS region,
      UPPER(SUBSTRING(c.name, 1, 3)) AS code,
      COALESCE(tx.transactions_count, 0) AS transactions,
      COALESCE(cs.total_score, 0) AS score,
      c.center_lat AS lat,
      c.center_lon AS lng
    FROM cities c
    LEFT JOIN (
      SELECT city_id, COUNT(*) AS transactions_count
      FROM geo_tx
      WHERE status = 'CONFIRMED'
      GROUP BY city_id
    ) tx ON tx.city_id = c.id
    LEFT JOIN city_stats cs ON cs.city_id = c.id
    ORDER BY score DESC, transactions DESC, c.id ASC;
  `;

  const { rows } = await pool.query(query);

  // numeric/string vs. karışmaması için normalize edelim
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    region: row.region, // country_code
    code: row.code,
    transactions: Number(row.transactions) || 0,
    score: row.score !== null ? Number(row.score) : 0,
    lat: row.lat !== null ? Number(row.lat) : null,
    lng: row.lng !== null ? Number(row.lng) : null,
  }));
}
