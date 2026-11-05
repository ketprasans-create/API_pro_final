/**
 * services/weatherApi.ts
 * -----------------------------------------------------------------------
 * ฝั่ง client — เรียก API ของโปรเจกต์ backend (Express) ไม่ได้เรียก Open-Meteo ตรงๆ
 * การเรียก Open-Meteo + แปลงข้อมูล + Selection Sort อยู่ที่ backend/ ทั้งหมด
 *
 * ปลายทางของ API:
 *   - ไม่ตั้ง VITE_API_BASE_URL -> เรียก /api แบบ relative ผ่าน Vite proxy ไปพอร์ต 3000 (ตอน dev)
 *   - ตั้ง VITE_API_BASE_URL    -> เรียก backend ตรงๆ เช่น http://localhost:3000 (backend ต้องเปิด CORS)
 * -----------------------------------------------------------------------
 */
import type { AirQuality, Coordinates, WeatherBundle } from "../types/weather";

export function weatherCodeLabel(code: number): string {
  const map: Record<number, string> = {
    0: "ท้องฟ้าแจ่มใส",
    1: "แจ่มใสเป็นส่วนใหญ่",
    2: "มีเมฆบางส่วน",
    3: "มีเมฆมาก",
    45: "มีหมอก",
    48: "หมอกน้ำแข็ง",
    51: "ฝนละอองเบา",
    53: "ฝนละอองปานกลาง",
    55: "ฝนละอองหนาแน่น",
    56: "ฝนละอองเยือกแข็งเบา",
    57: "ฝนละอองเยือกแข็งหนาแน่น",
    61: "ฝนตกเล็กน้อย",
    63: "ฝนตกปานกลาง",
    65: "ฝนตกหนัก",
    66: "ฝนเยือกแข็งเบา",
    67: "ฝนเยือกแข็งหนัก",
    71: "หิมะตกเล็กน้อย",
    73: "หิมะตกปานกลาง",
    75: "หิมะตกหนัก",
    77: "เกล็ดหิมะ",
    80: "ฝนตกเป็นช่วง",
    81: "ฝนตกเป็นช่วงปานกลาง",
    82: "ฝนตกเป็นช่วงรุนแรง",
    85: "หิมะตกเป็นช่วง",
    86: "หิมะตกเป็นช่วงหนัก",
    95: "พายุฝนฟ้าคะนอง",
    96: "พายุฝนฟ้าคะนองมีลูกเห็บเล็กน้อย",
    99: "พายุฝนฟ้าคะนองมีลูกเห็บรุนแรง",
  };
  return map[code] ?? "ไม่ทราบสภาพอากาศ";
}

const API_BASE = ((import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "").replace(/\/+$/, "");

const SERVER_DOWN_HINT = "เชื่อมต่อ backend ไม่ได้ — ตรวจสอบว่าเปิดโฟลเดอร์ backend แล้วรัน npm run dev (พอร์ต 3000)";

async function getJson<T>(url: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url);
  } catch {
    throw new Error(SERVER_DOWN_HINT);
  }

  // ถ้า backend ไม่ได้รันอยู่ Vite proxy จะตอบ 500 กลับมาแบบไม่มี JSON
  const data = (await res.json().catch(() => null)) as ({ error?: string } & Record<string, unknown>) | null;

  if (!res.ok) {
    throw new Error(data?.error ?? (res.status >= 500 ? SERVER_DOWN_HINT : `เซิร์ฟเวอร์ตอบกลับสถานะ HTTP ${res.status}`));
  }
  if (data === null) {
    throw new Error("เซิร์ฟเวอร์ตอบกลับข้อมูลที่อ่านไม่ได้");
  }
  return data as T;
}

export function fetchWeatherBundle(province: string, coords: Coordinates): Promise<WeatherBundle> {
  const params = new URLSearchParams({
    province,
    lat: String(coords.lat),
    lon: String(coords.lon),
  });
  return getJson<WeatherBundle>(`${API_BASE}/api/weather?${params.toString()}`);
}

export function fetchAirQuality(coords: Coordinates, windDirectionDeg: number): Promise<AirQuality> {
  const params = new URLSearchParams({
    lat: String(coords.lat),
    lon: String(coords.lon),
    windDirectionDeg: String(windDirectionDeg),
  });
  return getJson<AirQuality>(`${API_BASE}/api/air-quality?${params.toString()}`);
}
