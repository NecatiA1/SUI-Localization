// src/db/pool.js

import pkg from "pg";
const { Pool } = pkg;

// Ortam değişkenlerinden config'i oku
const pool = new Pool({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT || 5432),
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
});

// Basit bir test için: bağlantı hatası olursa logla
pool.on("error", (err) => {
  console.error("❌ Postgres bağlantı havuzunda hata:", err.message);
});

export default pool;
