/**
 * hooks/useWeather.ts
 * -----------------------------------------------------------------------
 * ฟีเจอร์ 9: Data Fetching & Caching ด้วย TanStack Query
 * ห่อ fetchWeatherBundle ด้วย useQuery เพื่อให้ได้ caching, loading state,
 * error state และ refetch ฟรีโดยไม่ต้องเขียน useState/useEffect เอง
 * -----------------------------------------------------------------------
 */
import { useQuery } from "@tanstack/react-query";
import type { Coordinates } from "../types/weather";
import { fetchWeatherBundle } from "../services/weatherApi";

export function useWeather(province: string | null, coords: Coordinates | null) {
  return useQuery({
    // queryKey ต้องมี coords ด้วย ไม่ใช่แค่ province เพราะ "ตำแหน่งปัจจุบัน" (feature 1)
    // ไม่มีชื่อจังหวัดที่แน่นอน แต่พิกัดต่างกันก็ควร fetch ใหม่
    queryKey: ["weather", province, coords?.lat, coords?.lon],
    queryFn: () => fetchWeatherBundle(province ?? "ตำแหน่งปัจจุบัน", coords as Coordinates),
    enabled: coords !== null, // ยังไม่มีพิกัด (เช่น geolocation ยังโหลดอยู่) ก็ยังไม่ fetch
  });
}
