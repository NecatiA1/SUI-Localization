// src/index.js

/**
 * LocalizationClient:
 *  - start()  -> /v1/geo/start çağırır
 *  - confirm() -> /v1/geo/confirm çağırır
 *
 * Bu SDK, browser tarafında fetch kullanarak backend'inle konuşur.
 */
function getBrowserLocation(options = {}) {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      return reject(
        new Error("Geolocation is not available in this environment.")
      );
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
      },
      (err) => {
        reject(new Error("User denied location access or it failed."));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
        ...options,
      }
    );
  });
}

// Browser coords -> city name + country code
async function reverseGeocode({ latitude, longitude }) {
  const url =
    "https://nominatim.openstreetmap.org/reverse" +
    `?format=json&lat=${encodeURIComponent(latitude)}` +
    `&lon=${encodeURIComponent(longitude)}` +
    "&zoom=10&addressdetails=1";

  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to reverse geocode location");
  }

  const data = await res.json();
  const addr = data.address || {};

  const cityName =
    addr.city ||
    addr.town ||
    addr.village ||
    addr.suburb ||
    addr.state ||
    addr.county;

  const countryCode = (addr.country_code || "").toUpperCase();

  if (!cityName || !countryCode) {
    throw new Error("Could not resolve city / country from coordinates");
  }

  return {
    cityName,
    countryCode,
    raw: data, // istersen ileride debug için kullanırsın
  };
}


class LocalizationClient {
  constructor({ apiId, apiKey, baseUrl }) {
    if (!apiId || !apiKey) {
      throw new Error("LocalizationClient requires apiId and apiKey");
    }

    this.apiId = apiId;
    this.apiKey = apiKey;
    this.baseUrl = baseUrl?.replace(/\/+$/, "") || "http://localhost:4000";
  }

  // İçeride kullanacağımız helper: API çağrısı
  async _request(path, options = {}) {
    const url = `${this.baseUrl}${path}`;

    const res = await fetch(url, {
      method: options.method || "POST",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    let data;
    try {
      data = await res.json();
    } catch (e) {
      // JSON parse edemezsek basit bir hata fırlatalım
      throw new Error(`Localization API error: invalid JSON response`);
    }

    if (!res.ok) {
      // Backend'in error formatını aynen forward edelim
      const msg = data?.error || data?.message || `HTTP ${res.status}`;
      const err = new Error(`Localization API error: ${msg}`);
      err.status = res.status;
      err.data = data;
      throw err;
    }

    return data;
  }

  /**
   * start(...)
   *
   * Params:
   *  - userAddress: Sui adresi
   *  - cityName:    Şehir adı (örn: 'Istanbul')
   *  - countryCode: Ülke kodu (örn: 'TR')
   *  - meta:        Optional ek bilgiler (action, userId vs.)
   *
   * Return:
   *  - { geoTxId, createdAt, city: { id, name, countryCode } }
   */
    /**
   * startWithLocation(...)
   *
   * - Asks the user for browser location permission
   * - Sends lat/lon to the backend
   * - Backend resolves the closest city and stores geo_tx
   *
   * Params:
   *  - userAddress: Sui address
   *  - meta: optional extra info
   */
  async startWithLocation({ userAddress, meta } = {}) {
    if (!userAddress) {
      throw new Error(
        "localization.startWithLocation: userAddress is required"
      );
    }

    // 1) Browser'dan koordinat al
    const coords = await getBrowserLocation();

    // 2) Koordinatı şehir + ülke koduna çevir
    let cityName, countryCode;

    try {
      const geo = await reverseGeocode({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
      cityName = geo.cityName;
      countryCode = geo.countryCode;
    } catch (e) {
      console.warn("reverseGeocode failed, falling back to lat/lon:", e);

      // İstersen burada eski davranışa düşebilirsin (City 39.89, 32.85 gibi):
      const bodyFallback = {
        apiId: this.apiId,
        apiKey: this.apiKey,
        userAddress,
        lat: coords.latitude,
        lon: coords.longitude,
        meta: meta || null,
      };

      return this._request("/v1/geo/start", {
        method: "POST",
        body: bodyFallback,
      });
    }

    // 3) Artık elimizde gerçek şehir bilgisi var → backend'e cityName + countryCode gönder
    const body = {
      apiId: this.apiId,
      apiKey: this.apiKey,
      userAddress,
      cityName,
      countryCode,
      meta: meta || null,
    };

    return this._request("/v1/geo/start", {
      method: "POST",
      body,
    });
  }

  async start({ userAddress, cityName, countryCode, meta }) {
    if (!userAddress) {
      throw new Error("localization.start: userAddress zorunlu");
    }
    if (!cityName) {
      throw new Error("localization.start: cityName zorunlu");
    }
    if (!countryCode) {
      throw new Error("localization.start: countryCode zorunlu");
    }

    const body = {
      apiId: this.apiId,
      apiKey: this.apiKey,
      userAddress,
      cityName,
      countryCode,
      meta: meta || null,
    };

    const res = await this._request("/v1/geo/start", {
      method: "POST",
      body,
    });

    // Beklenen backend response: { geoTxId, createdAt, city: {...} }
    return res;
  }

  /**
   * confirm(...)
   *
   * Params:
   *  - geoTxId:   start() dönüşünde gelen id
   *  - txDigest:  Sui tx hash'i
   *  - amountSui: işleme ait SUI miktarı (number)
   *
   * Return:
   *  - { geoTxId, status, txScore, confirmedAt }
   */
  async confirm({ geoTxId, txDigest }) {
    if (!geoTxId) {
      throw new Error("localization.confirm: geoTxId is required");
    }
    if (!txDigest) {
      throw new Error("localization.confirm: txDigest is required");
    }

    const body = {
      apiId: this.apiId,
      apiKey: this.apiKey,
      geoTxId,
      txDigest,
    };

    const res = await this._request("/v1/geo/confirm", {
      method: "POST",
      body,
    });

    return res;
  }
}

/**
 * Dışarıya verdiğimiz factory fonksiyonu:
 *
 * const client = createLocalizationClient({ apiId, apiKey, baseUrl });
 */
export function createLocalizationClient(config) {
  return new LocalizationClient(config);
}

// İstersen class'ı da direkt export edebilirsin:
export { LocalizationClient };
