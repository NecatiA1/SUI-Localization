import { create } from "zustand";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000")
  .replace(/\/$/, "");

const useHistoryTabStore = create((set) => ({
  cityCommunities: [],
  isLoading: false,
  error: null,

  // cityId: seçilen şehrin id'si
  fetchCityCommunities: async (cityId) => {
    if (!cityId) return;

    set({ isLoading: true, error: null });

    try {
      // ✅ Yeni endpoint: /v1/apps/summary?cityId={cityId}
      const url = `${API_BASE}/v1/apps/summary?cityId=${encodeURIComponent(
        cityId
      )}`;

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`status ${res.status}`);
      }

      const json = await res.json();
      // Backend direkt array döndürüyor, ama yine de korumalı parse edelim
      const list = Array.isArray(json) ? json : json.data || [];

      set({ cityCommunities: list, isLoading: false });
    } catch (err) {
      console.error("fetchCityCommunities error:", err);
      set({ error: err.message, isLoading: false });
    }
  },
}));

export default useHistoryTabStore;
