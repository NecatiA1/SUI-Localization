// src/routes/appRoutes.js

import express from "express";
import { registerOrGetApp } from "../services/appService.js";

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

export default router;
