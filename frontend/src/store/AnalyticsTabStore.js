import { create } from 'zustand';

const useAnalyticsTabStore = create((set) => ({
  cityUsers: [], // Kullanıcı listesi (addresses)
  cityData: null, // Şehirle ilgili genel bilgiler (risk_rate, transactions vb.) istenirse diye
  isLoading: false,
  error: null,

  // Şehir ID'sine göre veri çeken fonksiyon
  fetchCitySummary: async (cityId) => {
    if (!cityId) return;

    set({ isLoading: true, error: null });
    try {
      // Endpoint yapısı: http://localhost:4000/v1/map/cities/:id/summary
      const response = await fetch(`http://localhost:4000/v1/map/cities/${cityId}/summary`);
      
      if (!response.ok) {
        throw new Error('Veri çekilirken bir hata oluştu.');
      }

      const data = await response.json();

      // JSON yapına göre kullanıcı listesi "addresses" key'i içinde geliyor.
      set({ 
        cityUsers: data.addresses || [], 
        cityData: {
          name: data.name,
          riskRate: data.risk_rate,
          totalTransactions: data.transactions
        },
        isLoading: false 
      });
    } catch (error) {
      console.error("Fetch error:", error);
      set({ error: error.message, isLoading: false });
    }
  }
}));

export default useAnalyticsTabStore;