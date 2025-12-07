// src/routes/geoRoutes.js

import express from "express";
import pool from "../db/pool.js";
import { findOrCreateCity,resolveCityFromCoords  } from "../services/cityService.js";
import { applyScoreForConfirmedTx } from "../services/scoreService.js";
import { getSuiAmountFromTxDigest } from "../services/suiService.js";
import { validateAppCredentials } from "../services/appService.js";
import { getUserTransactionsFromGeoTxId } from "../services/userTxService.js";

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
    console.log("💥 /v1/geo/start body:", req.body);

    const {
      apiId,
      apiKey,
      userAddress,
      cityName,
      countryCode,
      lat,
      lon,
      meta,
    } = req.body || {};

    // 1) API kimlik kontrolü
    const app = await validateAppCredentials(apiId, apiKey);
    if (!app) {
      return res.status(401).json({ error: "Invalid apiId or apiKey" });
    }

    if (!userAddress) {
      return res.status(400).json({
        error: "userAddress is required.",
      });
    }

    let cityId;
    let finalCityName;
    let finalCountryCode;

    // 2) Şehir belirleme
    if (typeof lat === "number" && typeof lon === "number") {
      // a) Koordinattan şehir çözüyoruz
      const resolved = await resolveCityFromCoords({ lat, lon });
      cityId = resolved.cityId;
      finalCityName = resolved.name;
      finalCountryCode = resolved.countryCode;
    } else if (cityName && countryCode) {
      // b) Eski yöntem: doğrudan şehir adı
      cityId = await findOrCreateCity({
        name: cityName,
        countryCode,
      });
      finalCityName = cityName;
      finalCountryCode = countryCode;
    } else {
      return res.status(400).json({
        error: "Either (cityName + countryCode) or (lat + lon) must be provided.",
      });
    }

    // 3) geo_tx kaydı
    const insertResult = await pool.query(
      `INSERT INTO geo_tx (user_address, city_id, status, meta, app_db_id)
       VALUES ($1, $2, 'PENDING', $3, $4)
       RETURNING id, created_at`,
      [userAddress, cityId, meta || null, app.id]
    );

    const row = insertResult.rows[0];

    return res.status(201).json({
      geoTxId: row.id,
      createdAt: row.created_at,
      city: {
        id: cityId,
        name: finalCityName,
        countryCode: finalCountryCode,
      },
    });
  } catch (err) {
    console.error("POST /v1/geo/start error:", err);
    return res.status(500).json({
      error: "Failed to create geo transaction.",
      debug: err.message,
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

router.get("/user-tx/:geoTxId", async (req, res) => {
  try {
    const geoTxId = Number(req.params.geoTxId);

    if (!geoTxId || Number.isNaN(geoTxId)) {
      return res.status(400).json({ error: "Invalid geoTxId." });
    }

    const result = await getUserTransactionsFromGeoTxId(geoTxId);

    if (!result) {
      return res
        .status(404)
        .json({ error: "Geo transaction not found for given id." });
    }

    // Sadece transaction listesini döndürmek istiyorsan:
    return res.json(result.transactions);

    // Eğer address'i de göstermek istersen, şunu yapabilirsin:
    // return res.json({
    //   address: result.userAddress,
    //   transactions: result.transactions,
    // });
  } catch (err) {
    console.error("GET /v1/geo/user-tx/:geoTxId error:", err);
    return res.status(500).json({
      error: "Failed to fetch user transactions.",
      debug: err.message,
    });
  }
});

router.post("/confirm", async (req, res) => {
  try {
    const { apiId, apiKey, geoTxId, txDigest } = req.body || {};

    // 1) API auth
    const app = await validateAppCredentials(apiId, apiKey);
    if (!app) {
      return res.status(401).json({ error: "Invalid apiId or apiKey" });
    }

    if (!geoTxId || !txDigest) {
      return res
        .status(400)
        .json({ error: "geoTxId and txDigest are required." });
    }

    // 2) Bu geo_tx gerçekten bu app'e mi ait?
    const existing = await pool.query(
      `
      SELECT id, status, user_address, city_id, app_db_id
      FROM geo_tx
      WHERE id = $1 AND app_db_id = $2
      LIMIT 1
      `,
      [geoTxId, app.id]
    );

    if (existing.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Geo transaction not found for this app." });
    }

    const current = existing.rows[0];

    // 3) Sui ağından amount'ı çek
    const amountSui = await getSuiAmountFromTxDigest(txDigest);

    if (!amountSui || Number.isNaN(amountSui) || amountSui <= 0) {
      // İstersen burada CONFIRMED yerine FAILED/INVALID gibi status da verebilirsin
      console.warn(
        "No positive SUI amount found, txDigest:",
        txDigest,
        "amount:",
        amountSui
      );
    }

    const txScore = amountSui; // şimdilik score = amount
    console.log(`Transaction ${txDigest} has amountSui: ${amountSui}, txScore: ${txScore}`);
    // 4) geo_tx kaydını güncelle
    const updateResult = await pool.query(
      `
      UPDATE geo_tx
      SET
        tx_digest    = $1,
        amount_sui   = $2,
        tx_score     = $3,
        status       = 'CONFIRMED',
        confirmed_at = NOW()
      WHERE id = $4
      RETURNING id, user_address, city_id, tx_score, status, confirmed_at
      `,
      [txDigest, amountSui, txScore, geoTxId]
    );
    console.log(`Geo transaction ${geoTxId} updated to CONFIRMED.`);
    const updated = updateResult.rows[0];

    // 5) Skoru istatistik tablolarına uygula
    await applyScoreForConfirmedTx({
      userAddress: updated.user_address,
      cityId: updated.city_id,
      txScore: updated.tx_score,
    });

    return res.json({
      geoTxId: updated.id,
      status: updated.status,
      txScore: updated.tx_score,
      amountSui: amountSui,
      confirmedAt: updated.confirmed_at,
    });
  } catch (err) {
    console.error("POST /v1/geo/confirm error:", err);
    return res.status(500).json({
      error: "Confirm failed.",
      debug: err.message,
    });
  }
});

export default router;
