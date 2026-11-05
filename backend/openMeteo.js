/**
 * server/openMeteo.js
 * -----------------------------------------------------------------------
 * API Integration (ฝั่งเซิร์ฟเวอร์) — เรียก Open-Meteo แล้วแปลงข้อมูลให้อยู่ใน
 * รูปแบบเดียวกับ type WeatherBundle / AirQuality ที่ฝั่ง React ใช้อยู่
 * ต้องใช้ Node.js 18 ขึ้นไป (มี fetch และ AbortSignal.timeout ในตัว)
 * -----------------------------------------------------------------------
 */
import { selectionSortByPop } from "./sorter.js";
import { moonInfoForDate, nextMoonEvents } from "./moon.js";

const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const AIR_QUALITY_URL = "https://air-quality-api.open-meteo.com/v1/air-quality";
const TIMEOUT_MS = 10_000;

const HOUR_POINTS = [
  { label: "Morning", hour: 8 },
  { label: "Afternoon", hour: 14 },
  { label: "Evening", hour: 18 },
  { label: "Night", hour: 22 },
];

// แปลงองศาทิศทางลม (0-360) เป็นป้ายเข็มทิศ 8 ทิศ เช่น 270 -> "West Wind"
export function degToCompass(deg) {
  const dirs = ["North", "Northeast", "East", "Southeast", "South", "Southwest", "West", "Northwest"];
  const idx = Math.round(deg / 45) % 8;
  return `${dirs[idx]} Wind`;
}

function categorizeAqi(aqi) {
  if (aqi <= 40) return { category: "good", label: "Good" };
  if (aqi <= 80) return { category: "standard", label: "Standard" };
  return { category: "hazardous", label: "Hazardous" };
}

async function getJson(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!res.ok) {
    throw new Error(`Open-Meteo ตอบกลับสถานะ HTTP ${res.status}`);
  }
  return res.json();
}

const round1 = (n) => Math.round(n * 10) / 10;

// Sea Level Pressure: ค่าปัจจุบัน + กราฟรายชั่วโมงของวันนี้ + แนวโน้มเทียบกับไม่เกิน 3 ชั่วโมงก่อน
// คืน null ถ้า API ไม่ส่งค่ามา (หน้าเว็บจะแสดงข้อความว่าไม่มีข้อมูล แทนที่จะพัง)
function buildSeaLevel(raw, nowHour) {
  const current = raw.current?.pressure_msl;
  if (!Number.isFinite(current)) return null;

  const todayValues = (raw.hourly?.pressure_msl ?? []).slice(0, 24);
  // ใช้กราฟเฉพาะเมื่อมีครบ 24 ชั่วโมงและเป็นตัวเลขทุกค่า (กันเส้นกราฟขาดกลางคัน)
  const hourly = todayValues.length === 24 && todayValues.every(Number.isFinite) ? todayValues.map(round1) : [];

  const trendHours = Math.min(3, nowHour);
  const trendChange =
    hourly.length === 24 && trendHours > 0 ? round1(hourly[nowHour] - hourly[nowHour - trendHours]) : null;

  return {
    current: round1(current),
    hourly,
    min: hourly.length ? Math.min(...hourly) : round1(current),
    max: hourly.length ? Math.max(...hourly) : round1(current),
    nowHour,
    trendChange,
    trendHours,
  };
}

export async function fetchWeatherBundle(province, coords) {
  const params = new URLSearchParams({
    latitude: String(coords.lat),
    longitude: String(coords.lon),
    current:
      "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure,pressure_msl",
    hourly: "precipitation_probability,temperature_2m,visibility,weather_code,pressure_msl",
    daily:
      "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max,wind_speed_10m_max,sunrise,sunset",
    timezone: "Asia/Bangkok",
    forecast_days: "7",
  });

  const raw = await getJson(`${FORECAST_URL}?${params.toString()}`);

  const days = raw.daily.time.map((date, i) => {
    const hourStart = i * 24;
    return {
      date,
      weatherCode: raw.daily.weather_code[i],
      tempMax: Math.round(raw.daily.temperature_2m_max[i]),
      tempMin: Math.round(raw.daily.temperature_2m_min[i]),
      pop: raw.daily.precipitation_probability_max?.[i] ?? 0,
      uvIndexMax: Math.round(raw.daily.uv_index_max?.[i] ?? 0),
      windMax: Math.round(raw.daily.wind_speed_10m_max?.[i] ?? 0),
      hourlyPop: (raw.hourly?.precipitation_probability ?? []).slice(hourStart, hourStart + 24),
      sunrise: raw.daily.sunrise?.[i]?.slice(11, 16) ?? "--:--",
      sunset: raw.daily.sunset?.[i]?.slice(11, 16) ?? "--:--",
      moon: moonInfoForDate(date),
    };
  });

  const ranked = selectionSortByPop(days);
  const bestIndex = ranked[0].index;

  // จุดอุณหภูมิของวันนี้ (ชม. 8/14/18/22) สำหรับกราฟเส้น Morning/Afternoon/Evening/Night
  const hourlyTemps = raw.hourly?.temperature_2m ?? [];
  const hourlyCodes = raw.hourly?.weather_code ?? [];
  const todayHourlyTemps = HOUR_POINTS.map(({ label, hour }) => ({
    label,
    hour,
    temp: Math.round(hourlyTemps[hour] ?? days[0].tempMax),
    weatherCode: hourlyCodes[hour] ?? days[0].weatherCode,
  }));

  // ชั่วโมง "ตอนนี้" อ่านจาก current.time ที่ Open-Meteo ส่งมาในเขตเวลา Asia/Bangkok
  // (ไม่ใช้ new Date().getHours() เพราะเซิร์ฟเวอร์อาจตั้งเวลาเป็น UTC แล้วได้ชั่วโมงผิด)
  const parsedHour = Number(String(raw.current?.time ?? "").slice(11, 13));
  const nowHour = Number.isFinite(parsedHour) ? parsedHour : 12;
  const visibilityMeters = raw.hourly?.visibility ?? [];
  const visibilityKm = Math.round(((visibilityMeters[nowHour] ?? 10000) / 1000) * 10) / 10;

  return {
    province,
    current: {
      temperature: Math.round(raw.current.temperature_2m),
      feelsLike: Math.round(raw.current.apparent_temperature),
      humidity: raw.current.relative_humidity_2m,
      wind: Math.round(raw.current.wind_speed_10m),
      windDirectionDeg: raw.current.wind_direction_10m ?? 0,
      pressure: Math.round(raw.current.surface_pressure ?? 0),
      visibilityKm,
      weatherCode: raw.current.weather_code,
    },
    days,
    bestIndex,
    todayHourlyTemps,
    seaLevel: buildSeaLevel(raw, nowHour),
    moonEvents: nextMoonEvents(days[0].date),
  };
}

export async function fetchAirQuality(coords, windDirectionDeg) {
  const params = new URLSearchParams({
    latitude: String(coords.lat),
    longitude: String(coords.lon),
    current: "european_aqi,pm2_5",
    timezone: "Asia/Bangkok",
  });

  const raw = await getJson(`${AIR_QUALITY_URL}?${params.toString()}`);
  const aqi = Math.round(raw.current?.european_aqi ?? 0);
  const { category, label } = categorizeAqi(aqi);

  return {
    aqi,
    pm25: Math.round((raw.current?.pm2_5 ?? 0) * 10) / 10,
    category,
    categoryLabel: label,
    windLabel: degToCompass(windDirectionDeg),
  };
}
