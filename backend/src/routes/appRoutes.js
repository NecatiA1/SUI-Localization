// src/routes/appRoutes.js

import express from "express";
import { registerOrGetApp } from "../services/appService.js";
import {
  getAllAppsWithStats,
  getAppCitiesStats,
  getAppsByCityWithStats,
} from "../services/appSummaryService.js";

const router = express.Router();

/**
 * POST /v1/apps/register
 * 
 * Body:
 * {
 *   "name": "SuiSwap",
 *   "domain": "https://app.suiswap.xyz",
 *   "description": "Sui üzerinde AMM / DEX"
 * }
 */
router.post("/register", async (req, res) => {
  try {
    const { name, domain, description } = req.body || {};

    // Basit validasyonlar
    if (!name || !domain) {
      return res.status(400).json({
        error: "name ve domain zorunludur.",
      });
    }

    const app = await registerOrGetApp({ name, domain, description });

    // Güvenlik notu:
    // apiKey hassas bilgidir, sadece owner'a gösterilir.
    // Şimdilik direkt döndürüyoruz (dashboard/ayar ekranı için ideal).
    return res.status(app.isNew ? 201 : 200).json({
      appId: app.appId,
      apiKey: app.apiKey,
      name: app.name,
      domain: app.domain,
      description: app.description,
      createdAt: app.createdAt,
      isNew: app.isNew,
    });
  } catch (err) {
    console.error("POST /v1/apps/register hata:", err);
    return res.status(500).json({
      error: "Dapp kaydı sırasında bir hata oluştu.",
      debug: err.message, // dev ortamında kalabilir
    });
  }
});

router.get("/summary", async (req, res) => {
  try {
    // ?cityId=1 gibi bir query param geçildiyse al
    const cityIdParam = req.query.cityId;

    // Eğer cityId verilmişse: sadece o şehre ait app'leri döndür
    if (cityIdParam !== undefined) {
      const cityId = Number(cityIdParam);

      if (!cityId || Number.isNaN(cityId)) {
        return res.status(400).json({ error: "Invalid cityId." });
      }

      const appsForCity = await getAppsByCityWithStats(cityId);

      // Tüm app'lerde olduğu gibi direkt array döndürüyoruz
      return res.json(appsForCity);
    }

    // cityId verilmemişse: eski davranış → tüm app'lerin global özeti
    const apps = await getAllAppsWithStats();
    return res.json(apps);
  } catch (err) {
    console.error("GET /v1/apps/summary error:", err);
    return res.status(500).json({
      error: "Failed to fetch apps summary.",
      debug: err.message,
    });
  }
});

router.get("/:appId/cities", async (req, res) => {
  try {
    const appId = Number(req.params.appId);

    if (!appId || Number.isNaN(appId)) {
      return res.status(400).json({ error: "Invalid appId." });
    }

    const cities = await getAppCitiesStats(appId);

    // Hiç kayıt yoksa bile boş array döndürmek frontend için daha rahat
    return res.json(cities);
  } catch (err) {
    console.error("GET /v1/apps/:appId/cities error:", err);
    return res.status(500).json({
      error: "Failed to fetch cities for app.",
      debug: err.message,
    });
  }
});

export default router;
