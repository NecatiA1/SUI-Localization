// src/services/citySummaryService.js
import pool from "../db/pool.js";

/**
 * timestamp listesine göre risk oranı hesaplar.
 * - Eğer 10'dan az transaction varsa: 50
 * - Aksi halde:
 *   - total = timestamp sayısı
 *   - n = floor(total / 5)
 *   - "asal" transaction = son n adet içindeki en eski transaction
 *   - risk = (asal_time - first_time) / (now - first_time) * 100
 *   - asal ne kadar "şimdiki zamana yakınsa" oran o kadar 1'e yakın → risk yüksek
 */
function calculateRiskRateFromTimes(timestamps) {
  if (!timestamps || timestamps.length === 0) return 50;

  const total = timestamps.length;

  if (total < 10) {
    return 50;
  }

  const first = new Date(timestamps[0]).getTime();
  const now = Date.now();

  if (!Number.isFinite(first) || now <= first) {
    return 50;
  }

  const n = Math.floor(total / 5);
  if (n <= 0) return 50;

  // Son n transaction içindeki en eski transaction:
  const asalIndex = total - n; // 0-based index
  const asalTime = new Date(timestamps[asalIndex]).getTime();
  if (!Number.isFinite(asalTime)) {
    return 50;
  }

  const ratio = (asalTime - first) / (now - first);
  let rate = ratio * 100;

  if (!Number.isFinite(rate)) rate = 50;

  // 0–100 aralığına sıkıştır
  rate = Math.max(0, Math.min(100, rate));

  return rate;
}

/**
 * Belirli bir city için top-level özet:
 *  - id, name, region_name
 *  - toplam CONFIRMED transaction sayısı
 *  - risk_rate (calculateRiskRateFromTimes ile)
 */
export async function getCitySummary(cityId) {
  // Tek query ile city info + timestamps array alalım
  const result = await pool.query(
    `
    SELECT
      c.id,
      c.name,
      c.region_name,
      c.country_code,
      COUNT(gt.id) FILTER (WHERE gt.status = 'CONFIRMED') AS transactions,
      ARRAY_REMOVE(
        ARRAY_AGG(
          CASE WHEN gt.status = 'CONFIRMED' THEN gt.confirmed_at ELSE NULL END
          ORDER BY gt.confirmed_at
        ),
        NULL
      ) AS confirmed_times
    FROM cities c
    LEFT JOIN geo_tx gt
      ON gt.city_id = c.id
    WHERE c.id = $1
    GROUP BY c.id, c.name, c.region_name, c.country_code
    LIMIT 1
    `,
    [cityId]
  );

  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0];

  const confirmedTimes = row.confirmed_times || [];
  const riskRate = calculateRiskRateFromTimes(confirmedTimes);

  const name = row.name || "";
  const code =
    name
      .trim()
      .slice(0, 3)
      .toUpperCase() || null;

  return {
    id: row.id,
    name: row.name,
    code,
    region: row.region_name || row.country_code || null,
    transactions: Number(row.transactions) || 0,
    risk_rate: riskRate,
  };
}

/**
 * Belirli bir city için address bazlı özet:
 *  - id: geo_tx kayıtlarından herhangi birinin id'si (MIN(id))
 *  - address: user_address
 *  - tx_count: bu city + address için CONFIRMED tx sayısı
 *  - score: bu tx'lerin toplam tx_score değeri
 *  - status: per-address risk hesaplanıp threshold'a göre "safe"/"risky"
 */
export async function getCityAddressStats(cityId) {
  const result = await pool.query(
    `
    SELECT
      MIN(id) AS any_id,
      user_address,
      COUNT(*) AS tx_count,
      COALESCE(SUM(tx_score), 0) AS score,
      ARRAY_AGG(confirmed_at ORDER BY confirmed_at) AS confirmed_times
    FROM geo_tx
    WHERE city_id = $1
      AND status = 'CONFIRMED'
    GROUP BY user_address
    `,
    [cityId]
  );

  const addresses = result.rows.map((row) => {
    const txCount = Number(row.tx_count) || 0;
    const score = Number(row.score) || 0;
    const times = row.confirmed_times || [];

    const riskRate = calculateRiskRateFromTimes(times);
    const status = riskRate > 50 ? "safe" : "risky";

    return {
      id: row.any_id,
      address: row.user_address,
      tx_count: txCount,
      score,
      status,
    };
  });

  return addresses;
}
