import { create } from "zustand";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000")
  .replace(/\/$/, "");

const useCommunityModalStore = create((set, get) => ({
  // STATE
  selectedCommunity: null,
  communityStats: [],       // endpointten gelen şehir listesi (normalize edilmiş)
  isCommunityLoading: false,
  communityError: null,

  // Belirli bir community (app) için modalı aç + şehir verilerini çek
  openCommunityModal: async (community) => {
    if (!community || !community.id) {
      console.warn("openCommunityModal: geçersiz community:", community);
      return;
    }

    const appId = community.id;

    set({
      selectedCommunity: community,
      isCommunityLoading: true,
      communityError: null,
      communityStats: [],
    });

    try {
      const url = `${API_BASE}/v1/apps/${appId}/cities`;
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(
          `Community cities fetch failed (status ${res.status}) URL: ${url}`
        );
      }

      const json = await res.json();

      // Gelen data array ise direkt, değilse json.data'yı dene
      const rawList = Array.isArray(json) ? json : json.data || [];

      const normalized = rawList.map((item) => ({
        // Backend alanları
        id: item.id,
        name: item.name,
        members: item.members ?? 0,
        tx_count: item.tx_count ?? 0,
        score: item.score ?? 0,

        // CommunityModal için normalize edilmiş alanlar
        cityId: item.id,
        cityName: item.name,
        region: item.region || item.country || "", // yoksa boş
        txCount: item.tx_count ?? item.txCount ?? 0,

        // Şimdilik volume yok; score'u volume gibi kullanıyoruz
        volume: item.score ?? 0,

        // İstersen her şeyi raw altında da görebil
        raw: item,
      }));

      // Score'a göre descending sıralama (yüksek score önce)
      const sorted = normalized.sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score; // score DESC
        }
        // Score eşitse tx_count'a göre sırala
        return b.tx_count - a.tx_count;
      });

      set({
        communityStats: sorted,
        isCommunityLoading: false,
      });
    } catch (err) {
      console.error("openCommunityModal error:", err);
      set({
        isCommunityLoading: false,
        communityError: err.message,
      });
    }
  },

  // Modal kapatma / state temizleme
  closeCommunityModal: () => {
    set({
      selectedCommunity: null,
      communityStats: [],
      isCommunityLoading: false,
      communityError: null,
    });
  },
}));

export default useCommunityModalStore;