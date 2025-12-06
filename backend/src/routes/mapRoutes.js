// src/routes/mapRoutes.js

import express from "express";
import { getCityMapStats } from "../services/cityService.js";

const router = express.Router();

/**
 * GET /v1/map/cities
 *
 * Response:
 * {
 *   success: true,
 *   data: [
 *     {
 *       id,
 *       name,
 *       region,        // country_code
 *       code,          // name'in ilk 3 harfi (UPPER)
 *       transactions,  // geo_tx'de CONFIRMED sayısı
 *       score,         // city_stats.total_score
 *       lat,           // cities.center_lat
 *       lng            // cities.center_lon
 *     },
 *     ...
 *   ]
 * }
 */
router.get("/cities", async (req, res) => {
  try {
    const cities = await getCityMapStats();

    return res.json({
      success: true,
      data: cities,
    });
  } catch (err) {
    console.error("GET /v1/map/cities hata:", err);

    return res.status(500).json({
      success: false,
      error: "CITY_MAP_STATS_FAILED",
      message: "Şehir istatistikleri alınırken bir hata oluştu.",
    });
  }
});

export default router;
