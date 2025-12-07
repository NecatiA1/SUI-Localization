// src/services/geoFakeService.js
import pool from "../db/pool.js";

const USER_ADDRESSES = [
  "0xe852c9da6e5c32287d280ea71c936a184674f009e29893bd7946ab82ae955631",
  "0xe852c9da6e5c32287d280ea71c936a184674f009e29893bd7946ab82ae955632",
  "0xe852c9da6e5c32287d280ea71c936a184674f009e29893bd7946ab82ae955633",
  "0xe852c9da6e5c32287d280ea71c936a184674f009e29893bd7946ab82ae955634",
  "0xe852c9da6e5c32287d280ea71c936a184674f009e29893bd7946ab82ae955635",
  "0xe852c9da6e5c32287d280ea71c936a184674f009e29893bd7946ab82ae955636",
  "0xe852c9da6e5c32287d280ea71c936a184674f009e29893bd7946ab82ae955637",
  "0xe852c9da6e5c32287d280ea71c936a184674f009e29893bd7946ab82ae955638",
  "0xe852c9da6e5c32287d280ea71c936a184674f009e29893bd7946ab82ae955639",
  "0xe852c9da6e5c32287d280ea71c936a184674f009e29893bd7946ab82ae955641",
  "0xe852c9da6e5c32287d280ea71c936a184674f009e29893bd7946ab82ae955642",
  "0xe852c9da6e5c32287d280ea71c936a184674f009e29893bd7946ab82ae955643",
  "0xe852c9da6e5c32287d280ea71c936a184674f009e29893bd7946ab82ae955644",
  "0xe852c9da6e5c32287d280ea71c936a184674f009e29893bd7946ab82ae955645",
  "0xe852c9da6e5c32287d280ea71c936a184674f009e29893bd7946ab82ae955646",
  "0xe852c9da6e5c32287d280ea71c936a184674f009e29893bd7946ab82ae955647",
  "0xe852c9da6e5c32287d280ea71c936a184674f009e29893bd7946ab82ae955648",
  "0xe852c9da6e5c32287d280ea71c936a184674f009e29893bd7946ab82ae955649",
];

// BZGnQ1QpdcVRt6NrnaxU37T6vc3MjHoz6CbzkeeiNnsz gibi base58 tarzı string üretelim
const BASE58_ALPHABET =
  "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

function randomInt(min, max) {
  // [min, max] aralığında integer
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomTxDigest(length = 44) {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += BASE58_ALPHABET[Math.floor(Math.random() * BASE58_ALPHABET.length)];
  }
  return out;
}

// Son 1 gün içinden random zaman
function randomRecentDate() {
  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;
  const randomOffset = Math.random() * oneDayMs; // 0 .. 24h
  return new Date(now - randomOffset);
}

/**
 * count adet fake geo_tx kaydı üretir.
 *
 * - user_address      -> verilen listeden random
 * - city_id           -> cities.id listesinden random
 * - app_db_id         -> apps.id listesinden random
 * - tx_digest         -> random base58 string
 * - tx_score          -> 1..1000
 * - amount_sui        -> 1..1000
 * - status            -> "CONFIRMED"
 * - created_at        -> son 24 saatten random
 * - confirmed_at      -> created_at ile aynı (istersen ufak offset de verebilirsin)
 * - source, meta      -> NULL
 */
export async function insertFakeGeoTx(count) {
  const n = Number(count);
  if (!n || Number.isNaN(n) || n <= 0) {
    return { inserted: 0, rows: [] };
  }

  // Şehir ve app id'lerini çek
  const cityRes = await pool.query(`SELECT id FROM cities`);
  const appRes = await pool.query(`SELECT id FROM apps`);

  const cityIds = cityRes.rows.map((r) => r.id);
  const appIds = appRes.rows.map((r) => r.id);

  if (cityIds.length === 0) {
    throw new Error("No cities found in cities table.");
  }
  if (appIds.length === 0) {
    throw new Error("No apps found in apps table.");
  }

  const rows = [];
  const values = [];
  let placeholderIndex = 1;

  for (let i = 0; i < n; i++) {
    const userAddress = randomChoice(USER_ADDRESSES);
    const cityId = randomChoice(cityIds);
    const appId = randomChoice(appIds);
    const txDigest = randomTxDigest();
    const txScore = randomInt(1, 1000);
    const amountSui = randomInt(1, 1000);
    const createdAt = randomRecentDate();
    const confirmedAt = createdAt; // istersen küçük bir offset ekleyebilirsin

    // status, source, meta sabit
    const status = "CONFIRMED";
    const source = null;
    const meta = null;

    // geo_tx kolon sıralaman hangi ise ona göre ayarla
    // id otomatik (serial) ise eklemiyoruz
    values.push(
      userAddress, // 1
      cityId, // 2
      txDigest, // 3
      txScore, // 4
      status, // 5
      createdAt, // 6
      confirmedAt, // 7
      source, // 8
      meta, // 9
      amountSui, // 10
      appId // 11
    );

    rows.push(
      `($${placeholderIndex++}, $${placeholderIndex++}, $${placeholderIndex++}, $${placeholderIndex++}, ` +
        `$${placeholderIndex++}, $${placeholderIndex++}, $${placeholderIndex++}, $${placeholderIndex++}, ` +
        `$${placeholderIndex++}, $${placeholderIndex++}, $${placeholderIndex++})`
    );
  }

  const sql = `
    INSERT INTO geo_tx
      (user_address, city_id, tx_digest, tx_score, status,
       created_at, confirmed_at, source, meta, amount_sui, app_db_id)
    VALUES
      ${rows.join(", ")}
    RETURNING id, user_address, city_id, tx_digest, tx_score, status,
              created_at, confirmed_at, amount_sui, app_db_id
  `;

  const result = await pool.query(sql, values);

  return { inserted: result.rowCount, rows: result.rows };
}
