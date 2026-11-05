/**
 * hooks/useFavoriteCities.ts
 * -----------------------------------------------------------------------
 * ฟีเจอร์ 4: Favorite Cities ด้วย Zustand + localStorage (ผ่าน persist middleware)
 * เก็บแค่ "ชื่อจังหวัด" ไว้ในสโตร์ ส่วนข้อมูลอากาศยังให้ useWeather/React Query
 * จัดการแยกต่างหาก (ไม่ผสมสถานะ UI กับสถานะข้อมูลจากเซิร์ฟเวอร์)
 * -----------------------------------------------------------------------
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoriteCitiesState {
  favorites: string[];
  toggleFavorite: (province: string) => void;
  isFavorite: (province: string) => boolean;
}

export const useFavoriteCities = create<FavoriteCitiesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggleFavorite: (province) =>
        set((state) => ({
          favorites: state.favorites.includes(province)
            ? state.favorites.filter((p) => p !== province)
            : [...state.favorites, province],
        })),
      isFavorite: (province) => get().favorites.includes(province),
    }),
    { name: "lomfa-favorite-cities" } // key ที่ใช้เก็บใน localStorage
  )
);
