import { create } from 'zustand';

const useHistoryTabStore = create((set) => ({
  cityCommunities: [], // Backend'den gelen liste
  isLoading: false,
  error: null,

  // App ID'sine göre veri çeken fonksiyon (endpoint: /v1/apps/:id/cities)
  fetchCityCommunities: async (appId) => {
    if (!appId) return;

    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`http://localhost:4000/v1/apps/${appId}/cities`);
      
      if (!response.ok) {
        throw new Error('Veri çekilirken bir hata oluştu.');
      }

      const data = await response.json();

      // Backend direkt array dönüyor, onu state'e atıyoruz
      set({ 
        cityCommunities: data || [], 
        isLoading: false 
      });
    } catch (error) {
      console.error("History fetch error:", error);
      set({ error: error.message, isLoading: false });
    }
  }
}));

export default useHistoryTabStore;