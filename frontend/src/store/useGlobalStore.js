import { create } from 'zustand';

// 1. API BASE URL
const BASE_URL = 'http://localhost:4000/v1';


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
      const response = await fetch(`${BASE_URL}/map/cities`);
      if (!response.ok) throw new Error('Şehir verileri alınamadı.');
      
      const jsonResponse = await response.json();

      const processedCities = jsonResponse.data.map(city => ({
        ...city,
        lat: city.lat || 0,
        lng: city.lng || 0,
        score: city.score || 0,
      }));

      set({ cities: processedCities, isLoading: false });
    } catch (err) {
      console.error("API Error:", err);
      set({ error: err.message, isLoading: false });
    }
  },

  // 2. ŞEHİR DETAYINI VE İÇERİĞİNİ GETİR (DİNAMİK ID İLE)
  selectCity: async (city) => {
    // Eğer seçim kaldırıldıysa (null geldiyse) temizle ve çık
    if (!city) {
      set({ selectedCity: null, cityUsers: [], cityCommunities: [] });
      return;
    }

    // Seçili şehri state'e at ve loading başlat
    set({ selectedCity: city, isLoading: true, error: null });

    try {
      // --- DİNAMİK URL OLUŞTURMA ---
      // Seçenek A (Standart): http://localhost:4000/v1/map/cities/1
      const url = `${BASE_URL}/map/cities/${city.id}`;
      
      // Seçenek B (Senin örneğin): http://localhost:4000/1
      // const url = `http://localhost:4000/${city.id}`; 

      console.log("İstek atılan dinamik URL:", url);

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Şehir detayları alınamadı: ${response.status}`);
      }

      const jsonResponse = await response.json();
      
      // Backend'den dönen verinin yapısına göre burayı ayarlıyoruz.
      // ÖRNEK SENARYO: Dönen veride "users" ve "communities" dizileri varsa:
      /*
        Gelen veri örneği:
        {
          success: true,
          data: {
             ...cityDetails,
             users: [...],
             communities: [...]
          }
        }
      */
     
      const details = jsonResponse.data || {};

      set({ 
        // Eğer backend ayrı ayrı array dönüyorsa:
        cityUsers: details.users || [], 
        cityCommunities: details.communities || [],
        isLoading: false 
      });

    } catch (err) {
      console.error("City Detail Error:", err);
      set({ error: err.message, isLoading: false });
    }
  },

  selectUser: (user) => set({ selectedUser: user }),
  selectCommunity: (community) => set({ selectedCommunity: community }),

  closeCityModal: () => get().selectCity(null),
  closeUserModal: () => set({ selectedUser: null }),
  closeCommunityModal: () => set({ selectedCommunity: null }),
}));

export default useGlobalStore;