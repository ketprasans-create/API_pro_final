/**
 * types/weather.ts
 * -----------------------------------------------------------------------
 * ชนิดข้อมูล (type) กลางที่ทุก hook/component ในแอปใช้ร่วมกัน
 * เขียนแยกไว้ที่เดียว เพื่อให้ service, hook และ component อ้างอิงชนิดเดียวกัน
 * ไม่ต้องเดาโครงสร้างข้อมูลจากโค้ดที่เรียก API อีกที
 * -----------------------------------------------------------------------
 */

export type Region = "north" | "northeast" | "central" | "west" | "east" | "south";

export interface Province {
  name: string;
  lat: number;
  lon: number;
  region: Region;
}

export interface Coordinates {
  lat: number;
  lon: number;
}

export type MoonPhaseKey =
  | "new_moon"
  | "waxing_crescent"
  | "first_quarter"
  | "waxing_gibbous"
  | "full_moon"
  | "waning_gibbous"
  | "last_quarter"
  | "waning_crescent";

// ข้างขึ้นข้างแรมของวันหนึ่ง (backend คำนวณให้ ณ เวลา 12:00 น. ตามเวลาไทย)
export interface MoonInfo {
  phase: MoonPhaseKey;
  illumination: number; // % ของดวงจันทร์ที่สว่าง 0-100
  ageDays: number; // อายุดวงจันทร์ นับจากวันดับ
  waxing: boolean; // true = ข้างขึ้น (กำลังสว่างขึ้น)
}

// วันที่ (YYYY-MM-DD เวลาไทย) ของวันเต็มดวงและวันดับครั้งถัดไป
export interface MoonEvents {
  fullMoon: string;
  newMoon: string;
}

// ความกดอากาศระดับน้ำทะเล (Sea Level Pressure, hPa)
export interface SeaLevelPressure {
  current: number;
  hourly: number[]; // ของวันนี้ 24 ค่า (ว่างถ้าข้อมูลไม่ครบ)
  min: number;
  max: number;
  nowHour: number; // ชั่วโมงปัจจุบัน (0-23) ใช้ชี้จุดบนกราฟ
  trendChange: number | null; // hPa เทียบกับ trendHours ชั่วโมงก่อน (null = ไม่มีข้อมูล)
  trendHours: number;
}

// สภาพอากาศของ "วันเดียว" หลังแปลงจาก daily + hourly ของ Open-Meteo แล้ว
export interface WeatherDay {
  date: string; // YYYY-MM-DD
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  pop: number; // precipitation_probability_max (%) ใช้เป็นตัวแปรหลักในการ "เปรียบเทียบ" ของ Selection Sort
  uvIndexMax: number;
  windMax: number;
  hourlyPop: number[]; // โอกาสฝนรายชั่วโมง 24 ค่า สำหรับกราฟ (feature 5)
  sunrise: string; // "HH:mm"
  sunset: string; // "HH:mm"
  moon: MoonInfo;
}

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  wind: number;
  windDirectionDeg: number;
  pressure: number; // hPa (surface_pressure)
  visibilityKm: number;
  weatherCode: number;
}

// จุดอุณหภูมิของ "วันนี้" ที่ตัดมาจาก hourly เพื่อวาดกราฟ Morning/Afternoon/Evening/Night
export interface HourlyTempPoint {
  label: string; // "Morning" | "Afternoon" | "Evening" | "Night"
  hour: number;
  temp: number;
  weatherCode: number;
}

// ผลลัพธ์รวมที่ hook useWeather คืนออกมา หลังเรียก Open-Meteo + จัดอันดับด้วย Selection Sort
export interface WeatherBundle {
  province: string;
  current: CurrentWeather;
  days: WeatherDay[]; // เรียงตามวันที่เสมอ (เหมือนเวอร์ชัน server.js เดิม)
  bestIndex: number; // index ใน days ที่ pop ต่ำสุด (วันเดียว)
  todayHourlyTemps: HourlyTempPoint[];
  seaLevel: SeaLevelPressure | null; // null = API ไม่ส่งค่ามา
  moonEvents: MoonEvents | null;
}

export type AqiCategory = "good" | "standard" | "hazardous";

export interface AirQuality {
  aqi: number; // European AQI (0-100+)
  pm25: number;
  category: AqiCategory;
  categoryLabel: string;
  windLabel: string; // ทิศทางลมเป็นเข็มทิศ เช่น "West Wind"
}

// คะแนนของ "ช่วงเดินทางต่อเนื่อง N วัน" สำหรับฟีเจอร์ Trip Range Picker (ข้อ 7)
export interface TripWindowScore {
  startIndex: number; // index เริ่มต้นใน days
  length: number; // จำนวนวันในช่วง
  totalPop: number; // ผลรวม pop ของทุกวันในช่วง — ยิ่งน้อยยิ่งดี
  avgPop: number;
}

export interface SavedTripDate {
  province: string;
  date: string; // YYYY-MM-DD
}
