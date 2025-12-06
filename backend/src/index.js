// src/index.js
import pool from "./db/pool.js";
import geoRoutes from "./routes/geoRoutes.js";
import appRoutes from "./routes/appRoutes.js";
import mapRoutes from "./routes/mapRoutes.js";

// 1) .env dosyasını yükle
import dotenv from "dotenv";
dotenv.config();

// 2) Express'i içeri al
import express from "express";
import cors from "cors";

const app = express();

// Geliştirme ortamında frontend'den gelen istekleri kabul etmek için CORS
app.use(cors());

// 3) JSON body parse edebilmek için (POST request'lerde) middleware
app.use(express.json());

// Burada health ve db-test route'larından ÖNCE ya da SONRA da koyabilirsin
app.use("/v1/apps", appRoutes);
app.use("/v1/geo", geoRoutes);
app.use("/v1/map", mapRoutes);

// 4) Port'u .env'den oku, yoksa 4000 kullan
const PORT = process.env.PORT || 4000;

// 5) Basit health check endpoint'i
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// DB bağlantısını test eden endpoint
app.get("/db-test", async (req, res) => {
  try {
    // SELECT 1 gibi basit bir sorgu
    const result = await pool.query("SELECT NOW() as now");
    res.json({
      status: "ok",
      now: result.rows[0].now,
    });
  } catch (err) {
    console.error("DB test hatası:", err);
    res.status(500).json({
      status: "error",
      message: "Veritabanına bağlanılamadı",
    });
  }
});

// 6) Server'ı ayağa kaldır
app.listen(PORT, () => {
  console.log(`✅ Localization backend çalışıyor: http://localhost:${PORT}`);
});
