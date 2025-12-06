import { create } from "zustand";

/**
 * City objesi şu şekildedir:
 * {
 *   id: number,
 *   name: string,
 *   code: string,
 *   transactions: number,
 *   score: number,
 *   lat: number,
 *   lng: number
 * }
 */

const use3DDataStore = create((set) => ({
  // --- SADECE ŞEHİR VERİLERİ ---
  cities: [],

  // Tüm şehir listesini set et
  setCities: (cities) => set({ cities }),

  // Tek şehir ekle
  addCity: (city) =>
    set((state) => ({
      cities: [...state.cities, city],
    })),

  // Şehri ID'ye göre güncelle
  updateCity: (id, partial) =>
    set((state) => ({
      cities: state.cities.map((city) =>
        city.id === id ? { ...city, ...partial } : city
      ),
    })),

  // Şehir sil
  removeCity: (id) =>
    set((state) => ({
      cities: state.cities.filter((city) => city.id !== id),
    })),
}));

export default use3DDataStore;
