// src/services/cityService.js

import pool from "../db/pool.js";

/**
 * name:      'Istanbul'
 * countryCode: 'TR'
 * regionName:  optional, şimdilik boş geçebiliriz
 */
export async function resolveCityFromCoords({ lat, lon }) {
  // TODO: Hackathon sonrası: gerçek bir geocoding servisine bağla
  // (OpenStreetMap / Nominatim / Mapbox / Google vs.)

  // Şimdilik: lat/lon'u 'virtual city' ismine çeviren basit bir placeholder:
  const roundedLat = Math.round(lat * 100) / 100;
  const roundedLon = Math.round(lon * 100) / 100;

  const name = `City ${roundedLat}, ${roundedLon}`;
  const countryCode = "UN"; // Unknown

  const cityId = await findOrCreateCity({
    name,
    countryCode,
  });

  return { cityId, name, countryCode };
}


export async function findOrCreateCity({ name, countryCode, regionName = null }) {
  // 1) Önce var mı diye kontrol et
  const existing = await pool.query(
    "SELECT id FROM cities WHERE name = $1 AND country_code = $2 LIMIT 1",
    [name, countryCode]
  );

  if (existing.rows.length > 0) {
    return existing.rows[0].id;
  }

  // 2) Yoksa yeni şehir ekle
  const insertResult = await pool.query(
    `INSERT INTO cities (name, country_code, region_name)
     VALUES ($1, $2, $3)
     RETURNING id`,
    [name, countryCode, regionName]
  );

  return insertResult.rows[0].id;
}
