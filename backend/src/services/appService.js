// src/services/appService.js

import crypto from "crypto";
import pool from "../db/pool.js";

function generateAppId() {
  // Örn: app_ + UUID
  return "app_" + crypto.randomUUID();
}

function generateApiKey() {
  // Örn: loc_ + 64 hex karakter (32 byte)
  return "loc_" + crypto.randomBytes(32).toString("hex");
}

/**
 * Dapp kaydı / getirme fonksiyonu
 * 
 * Input: { name, domain, description }
 * 
 * Eğer bu domain ile daha önce app oluşturulmuşsa:
 *   -> Aynı app'i döner (app_id & api_key dahil)
 * Yoksa:
 *   -> Yeni app_id & api_key üretir, DB'ye yazar, döner
 */
export async function registerOrGetApp({ name, domain, description }) {
  // 1) Önce domain normalize edebilirsin (şimdilik raw kalsın)
  const normalizedDomain = domain.trim();

  // 2) Var mı diye kontrol et
  const existing = await pool.query(
    `
    SELECT id, app_id, api_key, name, domain, description, created_at
    FROM apps
    WHERE domain = $1
    LIMIT 1
    `,
    [normalizedDomain]
  );

  if (existing.rows.length > 0) {
    const app = existing.rows[0];
    // Mevcut app'i aynen döndürüyoruz
    return {
      id: app.id,
      appId: app.app_id,
      apiKey: app.api_key,
      name: app.name,
      domain: app.domain,
      description: app.description,
      createdAt: app.created_at,
      isNew: false,
    };
  }

  // 3) Yoksa yeni app_id ve api_key üret
  const appId = generateAppId();
  const apiKey = generateApiKey();

  const insertResult = await pool.query(
    `
    INSERT INTO apps (app_id, api_key, name, domain, description)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, app_id, api_key, name, domain, description, created_at
    `,
    [appId, apiKey, name, normalizedDomain, description || null]
  );

  const app = insertResult.rows[0];

  return {
    id: app.id,
    appId: app.app_id,
    apiKey: app.api_key,
    name: app.name,
    domain: app.domain,
    description: app.description,
    createdAt: app.created_at,
    isNew: true,
  };
}
