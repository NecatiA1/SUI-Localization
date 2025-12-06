// store/useGlobalStore.js
import { create } from 'zustand';

// --- MOCK DATABASE (İleride burası API olacak) ---
const REAL_CITIES = [
  { id: 1, name: "Istanbul", region: "Turkey", code: "IST", transactions: 9420, score: 750, lat: 41.0082, lng: 28.9784 },
  { id: 2, name: "New York", region: "USA", code: "NYC", transactions: 15200, score: 680, lat: 40.7128, lng: -74.0060 },
  { id: 3, name: "Tokyo", region: "Japan", code: "TKY", transactions: 12800, score: 890, lat: 35.6762, lng: 139.6503 },
  { id: 4, name: "London", region: "UK", code: "LDN", transactions: 10500, score: 420, lat: 51.5074, lng: -0.1278 },
  { id: 5, name: "Berlin", region: "Germany", code: "BER", transactions: 6300, score: 550, lat: 52.5200, lng: 13.4050 },
  { id: 6, name: "Singapore", region: "Singapore", code: "SIN", transactions: 8900, score: 780, lat: 1.3521, lng: 103.8198 },
  { id: 7, name: "Sydney", region: "Australia", code: "SYD", transactions: 4200, score: 910, lat: -33.8688, lng: 151.2093 },
  { id: 8, name: "Dubai", region: "UAE", code: "DXB", transactions: 11000, score: 600, lat: 25.2048, lng: 55.2708 },
];

// --- DATA GENERATORS (API Cevaplarını Simüle Eder) ---
const mockUsers = (cityId) => Array.from({ length: 8 }).map((_, i) => ({
    id: `${cityId}-U${i}`,
    name: `User-${Math.floor(Math.random() * 1000)}`,
    address: `0x${Math.random().toString(16).substr(2, 8)}...`,
    txCount: Math.floor(Math.random() * 500),
    volume: (Math.random() * 10).toFixed(2),
    status: Math.random() > 0.8 ? "Risky" : "Safe",
    score: Math.floor(Math.random() * 100)
}));

const mockCommunities = (cityId) => Array.from({ length: 6 }).map((_, i) => ({
    id: `${cityId}-C${i}`,
    name: `Cluster Alpha-${i + 1}`,
    website: "https://example.com",
    description: "A decentralized collective focused on verifying high-value transactions.",
    members: Math.floor(Math.random() * 5000),
    totalVolume: Math.floor(Math.random() * 1000000),
    txCount: Math.floor(Math.random() * 20000)
}));

const mockTransactions = (userId) => Array.from({ length: 5 }).map((_, i) => ({
    id: `tx-${i}`,
    hash: `0x${Math.random().toString(16).substr(2, 12)}...`,
    amount: (Math.random() * 5).toFixed(4),
    time: `${Math.floor(Math.random() * 24)}h ago`,
    status: "Success"
}));

const mockCompanyStats = () => {
    const shuffled = [...REAL_CITIES].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4).map(city => ({
        cityId: city.id,
        cityName: city.name,
        region: city.region,
        volume: (Math.random() * 50000).toFixed(0),
        txCount: Math.floor(Math.random() * 1200)
    }));
};

// --- STORE ---
const useGlobalStore = create((set, get) => ({
  // State
  cities: [],
  selectedCity: null,
  cityUsers: [],
  cityCommunities: [],
  
  selectedUser: null,
  userTransactions: [],
  
  selectedCommunity: null,
  communityStats: [],

  isLoading: false,

  // Actions (Async yapı kuruyoruz ki backend'e geçiş kolay olsun)
  
  // 1. Şehirleri Getir
  fetchCities: async () => {
    set({ isLoading: true });
    // BACKEND: const res = await fetch('/api/cities'); const data = await res.json();
    setTimeout(() => {
        set({ cities: REAL_CITIES, isLoading: false });
    }, 500); // 0.5sn gecikme simülasyonu
  },

  // 2. Şehir Seçilince Detayları Getir
  selectCity: async (city) => {
    if (!city) {
        set({ selectedCity: null, cityUsers: [], cityCommunities: [] });
        return;
    }
    set({ selectedCity: city, isLoading: true });
    
    // BACKEND: Fetch users & communities by city.id
    setTimeout(() => {
        set({
            cityUsers: mockUsers(city.id),
            cityCommunities: mockCommunities(city.id),
            isLoading: false
        });
    }, 300);
  },

  // 3. Kullanıcı Seçilince İşlemleri Getir
  selectUser: async (user) => {
    if (!user) {
        set({ selectedUser: null, userTransactions: [] });
        return;
    }
    set({ selectedUser: user, isLoading: true });

    // BACKEND: Fetch transactions by user.id
    setTimeout(() => {
        set({
            userTransactions: mockTransactions(user.id),
            isLoading: false
        });
    }, 300);
  },

  // 4. Şirket Seçilince İstatistikleri Getir
  selectCommunity: async (community) => {
    if (!community) {
        set({ selectedCommunity: null, communityStats: [] });
        return;
    }
    set({ selectedCommunity: community, isLoading: true });

    // BACKEND: Fetch stats by community.id
    setTimeout(() => {
        set({
            communityStats: mockCompanyStats(),
            isLoading: false
        });
    }, 300);
  },

  // Yardımcı: Modal Kapatma Resetleri
  closeCityModal: () => get().selectCity(null),
  closeUserModal: () => get().selectUser(null),
  closeCommunityModal: () => get().selectCommunity(null),
}));

export default useGlobalStore;