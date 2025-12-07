import { create } from 'zustand';

// 1. API BASE URL (Liste çekimi için kullanılıyor)
// Şehir listesi için: http://localhost:4000/v1/map/cities
const BASE_URL = 'http://localhost:4000/v1';

// --- KOORDİNAT YAMASI ---
// API'den "null" gelen koordinatları burada tamamlıyoruz.
const CITY_COORDINATES = {
  "Istanbul": { lat: 41.0082, lng: 28.9784 },
  "New York": { lat: 40.7128, lng: -74.0060 },
  "Tokyo": { lat: 35.6762, lng: 139.6503 },
  "London": { lat: 51.5074, lng: -0.1278 },
  "Berlin": { lat: 52.5200, lng: 13.4050 },
  "Singapore": { lat: 1.3521, lng: 103.8198 },
  "Sydney": { lat: -33.8688, lng: 151.2093 },
  "Dubai": { lat: 25.2048, lng: 55.2708 },
};

const useGlobalStore = create((set, get) => ({
  // --- STATE ---
  cities: [],
  selectedCity: null,
  cityUsers: [],       
  cityCommunities: [], 
  
  selectedUser: null,
  userTransactions: [],
  
  selectedCommunity: null,
  communityStats: [],

  isLoading: false,
  error: null,

  // --- ACTIONS ---

  // 1. TÜM ŞEHİRLERİ GETİR
  fetchCities: async () => {
    set({ isLoading: true, error: null });
    try {
      // Liste URL'si: http://localhost:4000/v1/map/cities
      const response = await fetch(`${BASE_URL}/map/cities`);
      
      if (!response.ok) throw new Error('Şehir verileri alınamadı.');
      
      const jsonResponse = await response.json();
      const rawData = jsonResponse.data || [];

      const processedCities = rawData.map(city => ({
        ...city,
        // Backend'den null gelen koordinatları tamamla
        lat: city.lat || CITY_COORDINATES[city.name]?.lat || 0,
        lng: city.lng || CITY_COORDINATES[city.name]?.lng || 0,
        score: city.score || 500, 
      }));

      set({ cities: processedCities, isLoading: false });
    } catch (err) {
      console.error("API Error (fetchCities):", err);
      set({ error: err.message, isLoading: false });
    }
  },
  
  // 2. ŞEHİR SEÇ (DETAY ÇEK)
  selectCity: async (city) => {
    // city null veya id'siz gelirse hiçbir şey yapma
    if (!city || (!city.id && !city.city_id)) {
      console.warn("selectCity: geçersiz city:", city);
      return;
    }

    const cityId = city.id ?? city.city_id;

    console.log("selectCity -> cityId:", cityId, "city:", city);

    set({ selectedCity: city, isLoading: true, error: null });

    try {
      const API_BASE =
        (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000").replace(/\/$/, "");

      const url = `${API_BASE}/v1/map/cities/${cityId}/summary`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Detay alınamadı (Status: ${response.status}). URL: ${url}`);
      }

      const data = await response.json();

      set({
        cityUsers: data.users || [],
        cityCommunities: data.communities || [],
        isLoading: false,
      });
    } catch (error) {
      console.error("Şehir detayları alınamadı:", error);
      set({
        cityUsers: [],
        cityCommunities: [],
        isLoading: false,
        error: error.message,
      });
    }
  },

  selectUser: (user) => set({ selectedUser: user }),
  selectCommunity: (community) => set({ selectedCommunity: community }),

  // Modal kapatma: sadece state temizle, selectCity(null) çağırma
  closeCityModal: () => {
    set({
      selectedCity: null,
      cityUsers: [],
      cityCommunities: [],
      selectedUser: null,
      selectedCommunity: null,
      isLoading: false,
      error: null,
    });
  },

  closeUserModal: () => set({ selectedUser: null }),
  closeCommunityModal: () => set({ selectedCommunity: null }),
}));

export default useGlobalStore;
