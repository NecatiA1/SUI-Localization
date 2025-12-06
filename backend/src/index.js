// src/index.js

// 1) .env dosyasını yükle
import dotenv from "dotenv";
dotenv.config();

// 2) Express'i içeri al
import express from "express";

const app = express();

// 3) JSON body parse edebilmek için (POST request'lerde) middleware
app.use(express.json());

// 4) Port'u .env'den oku, yoksa 4000 kullan
const PORT = process.env.PORT || 4000;

// 5) Basit health check endpoint'i
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// 6) Server'ı ayağa kaldır
app.listen(PORT, () => {
  console.log(`✅ Localization backend çalışıyor: http://localhost:${PORT}`);
});
