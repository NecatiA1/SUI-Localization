// src/routes/geoRoutes.js

import express from "express";
import pool from "../db/pool.js";
import { findOrCreateCity } from "../services/cityService.js";
import { applyScoreForConfirmedTx } from "../services/scoreService.js";

const router = express.Router();

/**
 * POST /v1/geo/start
 * Body: {
 *   "userAddress": "SUI-ADRESI",
 *   "cityName": "Istanbul",
 *   "countryCode": "TR",
 *   "meta": { ... } // optional
 * }
 */
router.post("/start", async (req, res) => {
  try {
    const { userAddress, cityName, countryCode, meta } = req.body || {};

    // 1) Basit validasyonlar
    if (!userAddress || !cityName || !countryCode) {
      return res.status(400).json({
        error: "userAddress, cityName ve countryCode zorunludur.",
      });
    }

    // 2) Şehri bul ya da oluştur
    const cityId = await findOrCreateCity({
      name: cityName,
      countryCode,
    });

    // 3) geo_tx kaydı oluştur
    const insertResult = await pool.query(
      `INSERT INTO geo_tx (user_address, city_id, status, meta)
       VALUES ($1, $2, 'PENDING', $3)
       RETURNING id, created_at`,
      [userAddress, cityId, meta || null]
    );

    const row = insertResult.rows[0];

    return res.status(201).json({
      geoTxId: row.id,
      createdAt: row.created_at,
      city: {
        id: cityId,
        name: cityName,
        countryCode,
      },
    });
  } catch (err) {
    console.error("POST /v1/geo/start hata:", err);
    return res.status(500).json({
      error: "Bir hata oluştu, start işlemi tamamlanamadı.",
    });
  }
});

/**
 * POST /v1/geo/confirm
 * Body: {
 *   "geoTxId": 123,
 *   "txDigest": "0xABC123..."
 * }
 */
router.post("/confirm", async (req, res) => {
  try {
    const { geoTxId, txDigest, amountSui } = req.body || {};

    if (!geoTxId || !txDigest || amountSui === undefined) {
      return res.status(400).json({
        error: "geoTxId, txDigest ve amountSui zorunludur.",
      });
    }

    const numericAmount = Number(amountSui);
    if (!numericAmount || isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        error: "amountSui pozitif bir sayı olmalıdır.",
      });
    }

    // 1) İlgili geo_tx kaydını bul
    const existing = await pool.query(
      "SELECT id, status, user_address, city_id FROM geo_tx WHERE id = $1 LIMIT 1",
      [geoTxId]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "Geo transaction bulunamadı." });
    }

    const current = existing.rows[0];

    // İstersen status kontrolü yapabilirsin (örn. sadece PENDING ise izin ver)
    // Biz şimdilik çok sıkı davranmayalım.

    // 2) geo_tx kaydını CONFIRMED yap, amount_sui ve tx_score'ı yaz
    const updateResult = await pool.query(
      `
      UPDATE geo_tx
      SET
        tx_digest    = $1,
        amount_sui   = $2,
        tx_score     = $2,
        status       = 'CONFIRMED',
        confirmed_at = NOW()
      WHERE id = $3
      RETURNING id, user_address, city_id, tx_score, status, confirmed_at
      `,
      [txDigest, numericAmount, geoTxId]
    );

    const updated = updateResult.rows[0];

    // 3) Skoru address_city_stats ve city_stats tablolarına uygula
    await applyScoreForConfirmedTx({
      userAddress: updated.user_address,
      cityId: updated.city_id,
      txScore: updated.tx_score,
    });

    return res.json({
      geoTxId: updated.id,
      status: updated.status,
      txScore: updated.tx_score,
      confirmedAt: updated.confirmed_at,
    });
  } catch (err) {
    console.error("POST /v1/geo/confirm hata:", err);
    return res.status(500).json({
      error: "Bir hata oluştu, confirm işlemi tamamlanamadı.",
      debug: err.message, // dev için bırak, sonra kaldırırsın
    });
  }
});

export default router;
