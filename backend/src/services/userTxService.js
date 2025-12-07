// src/services/userTxService.js
import pool from "../db/pool.js";

/**
 * Belirli bir geo_tx id'den yola çıkarak:
 *  - önce o kaydın user_address'ini bulur
 *  - sonra aynı user_address'e sahip tüm CONFIRMED kayıtları listeler
 *
 * Dönüş:
 *  - null -> geoTx bulunamazsa
 *  - { userAddress, transactions: [ { id, hash, score, created_at } ] }
 */
export async function getUserTransactionsFromGeoTxId(geoTxId) {
  // 1) Baz kayıt: user_address'i bul
  const baseResult = await pool.query(
    `
    SELECT user_address
    FROM geo_tx
    WHERE id = $1
    LIMIT 1
    `,
    [geoTxId]
  );

  if (baseResult.rows.length === 0) {
    return null;
  }

  const userAddress = baseResult.rows[0].user_address;

  // 2) Aynı user_address'e ait tüm CONFIRMED kayıtlar
  const txResult = await pool.query(
    `
    SELECT
      id,
      tx_digest,
      tx_score,
      confirmed_at
    FROM geo_tx
    WHERE user_address = $1
      AND status = 'CONFIRMED'
    ORDER BY confirmed_at DESC
    `,
    [userAddress]
  );

  const transactions = txResult.rows.map((row) => ({
    id: row.id,
    hash: row.tx_digest,
    score: row.tx_score !== null ? Number(row.tx_score) : 0,
    created_at: row.confirmed_at,
  }));

  return {
    userAddress,
    transactions,
  };
}
