// src/services/scoreService.js

import pool from "../db/pool.js";

/**
 * CONFIRMED bir işlem sonrası skor güncellemesi:
 * - address_city_stats
 * - city_stats
 *
 * txScore: işlem için hesaplanan skor (şu an amountSui)
 */
export async function applyScoreForConfirmedTx({ userAddress, cityId, txScore }) {
  // Şimdilik transaction kullanmadan tek tek sorgu atıyoruz.
  // İleride BEGIN/COMMIT ile tek transaction'a alabiliriz.

  // 1) address_city_stats upsert
  await pool.query(
    `
    INSERT INTO address_city_stats (user_address, city_id, tx_count, total_score, first_tx_at, last_tx_at)
    VALUES ($1, $2, 1, $3, NOW(), NOW())
    ON CONFLICT (user_address, city_id)
    DO UPDATE SET
      tx_count    = address_city_stats.tx_count + 1,
      total_score = address_city_stats.total_score + EXCLUDED.total_score,
      last_tx_at  = NOW(),
      first_tx_at = COALESCE(address_city_stats.first_tx_at, EXCLUDED.first_tx_at)
    `,
    [userAddress, cityId, txScore]
  );

  // 2) city_stats upsert
  await pool.query(
    `
    INSERT INTO city_stats (city_id, tx_count, total_score, last_tx_at)
    VALUES ($1, 1, $2, NOW())
    ON CONFLICT (city_id)
    DO UPDATE SET
      tx_count    = city_stats.tx_count + 1,
      total_score = city_stats.total_score + EXCLUDED.total_score,
      last_tx_at  = NOW()
    `,
    [cityId, txScore]
  );
}
