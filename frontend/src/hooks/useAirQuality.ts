/**
 * hooks/useAirQuality.ts
 * -----------------------------------------------------------------------
 * ดึงคุณภาพอากาศ (Air Quality card ในดีไซน์ใหม่) ผ่าน TanStack Query
 * เหมือน useWeather — แยก query ต่างหากเพราะเป็นคนละ endpoint ของ Open-Meteo
 * -----------------------------------------------------------------------
 */
import { useQuery } from "@tanstack/react-query";
import type { Coordinates } from "../types/weather";
import { fetchAirQuality } from "../services/weatherApi";

export function useAirQuality(coords: Coordinates | null, windDirectionDeg: number) {
  return useQuery({
    queryKey: ["air-quality", coords?.lat, coords?.lon],
    queryFn: () => fetchAirQuality(coords as Coordinates, windDirectionDeg),
    enabled: coords !== null,
  });
}
