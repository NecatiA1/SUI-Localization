import { create } from "zustand";

// API BASE (her yerde aynı mantık)
const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000")
  .replace(/\/$/, "");

const MAP_BASE = `${API_BASE}/v1/map`;
const GEO_BASE = `${API_BASE}/v1/geo`;

// İsimten koordinat parse etmeye çalışan yardımcı fonksiyon
function parseLatLngFromName(name) {
  if (!name) return null;

  // Örn: "City 39.89, 32.85"
  const match = name.match(/(-?\d+(\.\d+)?)\s*,\s*(-?\d+(\.\d+)?)/);
  if (!match) return null;

  return {
    lat: parseFloat(match[1]),
    lng: parseFloat(match[3]),
  };
}

// Null gelen koordinatları patch’lediğimiz tablo
const CITY_COORDINATES = {
  Istanbul: { lat: 41.0082, lng: 28.9784 },
  "New York": { lat: 40.7128, lng: -74.006 },
  Tokyo: { lat: 35.6762, lng: 139.6503 },
  London: { lat: 51.5074, lng: -0.1278 },
  Berlin: { lat: 52.52, lng: 13.405 },
  Singapore: { lat: 1.3521, lng: 103.8198 },
  Sydney: { lat: -33.8688, lng: 151.2093 },
  Dubai: { lat: 25.2048, lng: 55.2708 },
};

const useGlobalStore = create((set, get) => ({
  // --- STATE ---
  cities: [],
  selectedCity: null,

  cityUsers: [],        // /map/cities/:id/summary → addresses[]
  citySummary: null,    // risk_rate, transactions, name vs.

  selectedUser: null,
  userTransactions: [], // /geo/user-tx/:userId

  isLoading: false,
  error: null,

  // --- ACTIONS ---

  // 1. TÜM ŞEHİRLERİ GETİR
  fetchCities: async () => {
    set({ isLoading: true, error: null });

    try {
      const res = await fetch(`${MAP_BASE}/cities`);
      if (!res.ok) {
        throw new Error(`Şehir verileri alınamadı (status ${res.status}).`);
      }

      const json = await res.json();

      // /v1/map/cities ⇒ { success, data: [...] }
      const rawList = Array.isArray(json) ? json : json.data || [];
      const processedCities = rawList.map((city) => {
        let lat = city.lat;
        let lng = city.lng;

        // 1) API'de varsa onu kullan
        // 2) İsimden parse etmeyi dene ("City 39.89, 32.85")
        // 3) City table’dan fallback
        if (lat == null || lng == null) {
          const parsed = parseLatLngFromName(city.name);
          if (parsed) {
            lat = parsed.lat;
            lng = parsed.lng;
          } else if (CITY_COORDINATES[city.name]) {
            lat = CITY_COORDINATES[city.name].lat;
            lng = CITY_COORDINATES[city.name].lng;
          } else {
            lat = 0;
            lng = 0;
          }
        }

        return {
          ...city,
          lat,
          lng,
          score: city.score ?? 500, // backend verisi varsa onu kullan, yoksa 500
        };
      });

      set({ cities: processedCities, isLoading: false });
    } catch (err) {
      console.error("API Error (fetchCities):", err);
      set({ error: err.message, isLoading: false });
    }
  },

  // 2. ŞEHİR SEÇ + ŞEHİR ÖZETİNİ ÇEK
  selectCity: async (city) => {
    if (!city || (!city.id && !city.city_id)) {
      console.warn("selectCity: geçersiz city:", city);
      return;
    }

    const cityId = city.id ?? city.city_id;

    set({
      selectedCity: city,
      isLoading: true,
      error: null,
      cityUsers: [],
      citySummary: null,
    });

    try {
      const url = `${MAP_BASE}/cities/${cityId}/summary`;
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(
          `Şehir özeti alınamadı (status ${res.status}). URL: ${url}`
        );
      }

      const data = await res.json();

      set({
        citySummary: {
          id: data.id,
          name: data.name,
          code: data.code,
          region: data.region,
          transactions: data.transactions,
          riskRate: data.risk_rate,
        },
        cityUsers: data.addresses || [],
        isLoading: false,
      });
    } catch (err) {
      console.error("Şehir detayları alınamadı:", err);
      set({
        cityUsers: [],
        citySummary: null,
        isLoading: false,
        error: err.message,
      });
    }
  },

  // 3. USER SEÇ + TX LİSTESİNİ ÇEK
  selectUser: async (user) => {
    if (!user || !user.id) {
      console.warn("selectUser: geçersiz user:", user);
      set({ selectedUser: null, userTransactions: [] });
      return;
    }

    set({ selectedUser: user, isLoading: true, error: null });

    try {
      const url = `${GEO_BASE}/user-tx/${user.id}`;
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(
          `Kullanıcı tx listesi alınamadı (status ${res.status}). URL: ${url}`
        );
      }

      const data = await res.json(); // array

      set({
        userTransactions: Array.isArray(data) ? data : [],
        isLoading: false,
      });
    } catch (err) {
      console.error("User transactions fetch error:", err);
      set({ userTransactions: [], isLoading: false, error: err.message });
    }
  },

  // Basit state setter’lar
  clearSelectedUser: () =>
    set({
      selectedUser: null,
      userTransactions: [],
    }),

  // Modal kapatınca şehirle ilgili her şeyi sıfırla
  closeCityModal: () =>
    set({
      selectedCity: null,
      cityUsers: [],
      citySummary: null,
      selectedUser: null,
      userTransactions: [],
      isLoading: false,
      error: null,
    }),
}));

export default useGlobalStore;
