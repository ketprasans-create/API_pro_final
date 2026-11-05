/**
 * backend/index.js
 * -----------------------------------------------------------------------
 * Express API (รันแยกจากหน้าเว็บ React คนละโปรเจกต์ คนละพอร์ต)
 *
 *   GET /api/health
 *   GET /api/weather?lat=..&lon=..&province=..              -> WeatherBundle
 *   GET /api/air-quality?lat=..&lon=..&windDirectionDeg=..  -> AirQuality
 *
 * ตั้งค่าผ่านตัวแปรสภาพแวดล้อม (ไม่ตั้งก็ใช้ค่าเริ่มต้น):
 *   PORT         พอร์ตของ API                         (ค่าเริ่มต้น 3000)
 *   CORS_ORIGIN  origin ของหน้าเว็บที่อนุญาตให้เรียก API คั่นหลายค่าด้วยคอมมา
 *                หรือ * = อนุญาตทุกที่              (ค่าเริ่มต้น http://localhost:5173)
 * -----------------------------------------------------------------------
 */
import cors from "cors";
import express from "express";
import { fetchAirQuality, fetchWeatherBundle } from "./openMeteo.js";

const PORT = Number(process.env.PORT) || 3000;

const allowedOrigins = (process.env.CORS_ORIGIN ?? "http://localhost:5173,http://127.0.0.1:5173")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const app = express();

// หน้าเว็บอยู่คนละ origin (คนละพอร์ต) กับ API นี้ เบราว์เซอร์จึงต้องการ CORS header
app.use("/api", cors({ origin: allowedOrigins.includes("*") ? "*" : allowedOrigins }));

// แปลงค่า query string เป็นตัวเลข (ค่าว่าง/ไม่ได้ส่งมา = NaN เพื่อไม่ให้กลายเป็น 0 โดยไม่ตั้งใจ)
function toNumber(value) {
  return typeof value === "string" && value.trim() !== "" ? Number(value) : NaN;
}

function parseCoords(query) {
  const lat = toNumber(query.lat);
  const lon = toNumber(query.lon);
  const valid =
    Number.isFinite(lat) && Number.isFinite(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
  return valid ? { lat, lon } : null;
}

app.get("/", (req, res) => {
  res.json({
    name: "lomfa-backend",
    endpoints: [
      "/api/health",
      "/api/weather?lat=&lon=&province=",
      "/api/air-quality?lat=&lon=&windDirectionDeg=",
    ],
  });
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/api/weather", async (req, res) => {
  const coords = parseCoords(req.query);
  if (!coords) {
    return res.status(400).json({ error: "ต้องระบุ lat และ lon ให้ถูกต้อง" });
  }
  const province =
    typeof req.query.province === "string" && req.query.province.trim()
      ? req.query.province.trim().slice(0, 80)
      : "ตำแหน่งปัจจุบัน";

  try {
    res.json(await fetchWeatherBundle(province, coords));
  } catch (err) {
    console.error("[/api/weather]", err.message);
    res.status(502).json({ error: "ดึงข้อมูลพยากรณ์อากาศจาก Open-Meteo ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง" });
  }
});

app.get("/api/air-quality", async (req, res) => {
  const coords = parseCoords(req.query);
  if (!coords) {
    return res.status(400).json({ error: "ต้องระบุ lat และ lon ให้ถูกต้อง" });
  }
  const deg = toNumber(req.query.windDirectionDeg);
  const windDirectionDeg = Number.isFinite(deg) ? deg : 0;

  try {
    res.json(await fetchAirQuality(coords, windDirectionDeg));
  } catch (err) {
    console.error("[/api/air-quality]", err.message);
    res.status(502).json({ error: "ดึงข้อมูลคุณภาพอากาศจาก Open-Meteo ไม่สำเร็จ" });
  }
});

// เส้นทางอื่นที่ไม่มีอยู่จริง ตอบ 404 เป็น JSON
app.use((req, res) => {
  res.status(404).json({ error: "ไม่พบ endpoint นี้" });
});

app.listen(PORT, () => {
  console.log(`Backend ทำงานที่ http://localhost:${PORT}`);
  console.log(`อนุญาตให้เรียกจาก: ${allowedOrigins.join(", ")}`);
});
