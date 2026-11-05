/**
 * backend/moon.js
 * -----------------------------------------------------------------------
 * ข้างขึ้นข้างแรม (Moon Phase) — คำนวณจากตำแหน่งดวงอาทิตย์/ดวงจันทร์ด้วยสูตรดาราศาสตร์
 * (ชุดพจน์หลักจาก Meeus, Astronomical Algorithms บทที่ 47) ไม่ต้องเรียก API ภายนอก
 *
 * ทำไมไม่ดึงจาก Open-Meteo: เอกสารลิสต์ Moon Phase ไว้ในตัวแปรรายวัน แต่ยังไม่มีตารางอธิบายชื่อตัวแปร/ความหมายของค่า
 * และถ้าใส่ชื่อผิด Open-Meteo จะตอบ error ทั้งคำขอ (ข้อมูลอากาศทั้งหน้าจะพัง)
 * ถ้าวันหน้ายืนยันชื่อตัวแปรได้ เปลี่ยนมาใช้ค่าจาก API ได้ที่ฟังก์ชัน moonInfoForDate เพียงจุดเดียว
 *
 * ค่าหลักที่ใช้คือ "มุมห่าง" (elongation) ระหว่างดวงจันทร์กับดวงอาทิตย์ตามแนวสุริยวิถี:
 *   0° = วันดับ (New Moon), 90° = ครึ่งดวงข้างขึ้น, 180° = เต็มดวง (Full Moon), 270° = ครึ่งดวงข้างแรม
 * -----------------------------------------------------------------------
 */
const RAD = Math.PI / 180;
export const SYNODIC_MONTH = 29.530588853; // วัน (ระยะเฉลี่ยจากวันดับถึงวันดับถัดไป)
const BANGKOK_OFFSET_MS = 7 * 3600 * 1000;

const norm360 = (x) => ((x % 360) + 360) % 360;
const julianDay = (date) => date.getTime() / 86400000 + 2440587.5;

// มุมห่างของดวงจันทร์จากดวงอาทิตย์ (0-360 องศา) ณ เวลา date
export function moonElongation(date) {
  const T = (julianDay(date) - 2451545.0) / 36525; // ศตวรรษจูเลียนนับจาก J2000
  const Lm = 218.3164477 + 481267.88123421 * T; // ลองจิจูดเฉลี่ยของดวงจันทร์
  const D = 297.8501921 + 445267.1114034 * T; // มุมห่างเฉลี่ย
  const M = 357.5291092 + 35999.0502909 * T; // anomaly เฉลี่ยของดวงอาทิตย์
  const Mm = 134.9633964 + 477198.8675055 * T; // anomaly เฉลี่ยของดวงจันทร์
  const F = 93.272095 + 483202.0175233 * T; // argument of latitude
  const s = (deg) => Math.sin(deg * RAD);

  const moonLon =
    Lm +
    6.288774 * s(Mm) +
    1.274027 * s(2 * D - Mm) +
    0.658314 * s(2 * D) +
    0.213618 * s(2 * Mm) -
    0.185116 * s(M) -
    0.114332 * s(2 * F) +
    0.058793 * s(2 * D - 2 * Mm) +
    0.057066 * s(2 * D - M - Mm) +
    0.053322 * s(2 * D + Mm) +
    0.045758 * s(2 * D - M) -
    0.040923 * s(M - Mm) -
    0.03472 * s(D) -
    0.030383 * s(M + Mm);

  const sunMean = 280.46646 + 36000.76983 * T;
  const sunC = (1.914602 - 0.004817 * T) * s(M) + 0.019993 * s(2 * M) + 0.000289 * s(3 * M);

  return norm360(moonLon - (sunMean + sunC));
}

// สัดส่วนพื้นที่ผิวที่สว่าง 0-1 (ประมาณจากมุมห่าง คลาดเคลื่อนน้อยกว่า 0.2°)
export const illuminationFromElongation = (e) => (1 - Math.cos(e * RAD)) / 2;

/**
 * ชื่อเฟส 8 แบบ ช่วงของเฟสหลัก 4 แบบกว้าง ±8° (รวม 16°)
 * ซึ่งมากกว่าระยะที่ดวงจันทร์เดินต่อวัน (สูงสุดราว 14.3°) จึงมีอย่างน้อย 1 วันต่อเดือนที่ตรงเฟสหลักเสมอ
 * ถ้าแคบกว่านั้น บางเดือนจะไม่มีวัน "เต็มดวง" เลย
 */
export function phaseKey(e) {
  if (e < 8 || e >= 352) return "new_moon";
  if (e < 82) return "waxing_crescent";
  if (e < 98) return "first_quarter";
  if (e < 172) return "waxing_gibbous";
  if (e < 188) return "full_moon";
  if (e < 262) return "waning_gibbous";
  if (e < 278) return "last_quarter";
  return "waning_crescent";
}

// ข้างขึ้นข้างแรมของวันที่ YYYY-MM-DD ณ เวลา 12:00 น. (เวลาไทย)
export function moonInfoForDate(dateStr) {
  const e = moonElongation(new Date(`${dateStr}T12:00:00+07:00`));
  return {
    phase: phaseKey(e),
    illumination: Math.round(illuminationFromElongation(e) * 100), // %
    ageDays: Math.round((e / 360) * SYNODIC_MONTH * 10) / 10, // อายุดวงจันทร์ (วันนับจากวันดับ)
    waxing: e < 180, // ข้างขึ้น (กำลังสว่างขึ้น) / ข้างแรม
  };
}

// หาเวลาที่มุมห่างตัดผ่านค่า target (0 = วันดับ, 180 = เต็มดวง) ครั้งถัดไปหลังเวลา from
function nextCrossing(from, target) {
  const signed = (t) => norm360(moonElongation(t) - target + 180) - 180; // ติดลบก่อนถึง target เป็นบวกหลังผ่าน
  const STEP = 6 * 3600 * 1000;
  let prevTime = from;
  let prev = signed(prevTime);
  for (let elapsed = STEP; elapsed <= 32 * 24 * 3600 * 1000; elapsed += STEP) {
    const time = new Date(from.getTime() + elapsed);
    const cur = signed(time);
    if (prev < 0 && cur >= 0) {
      // ตัดผ่านระหว่าง prevTime กับ time -> หาจุดตัดด้วย bisection
      let lo = prevTime.getTime();
      let hi = time.getTime();
      for (let i = 0; i < 24; i++) {
        const mid = (lo + hi) / 2;
        if (signed(new Date(mid)) < 0) lo = mid;
        else hi = mid;
      }
      return new Date(hi);
    }
    prevTime = time;
    prev = cur;
  }
  return null;
}

const toBangkokDate = (date) => new Date(date.getTime() + BANGKOK_OFFSET_MS).toISOString().slice(0, 10);

// วันที่ (เวลาไทย) ของวันเต็มดวงและวันดับครั้งถัดไป นับจากต้นวัน dateStr
export function nextMoonEvents(dateStr) {
  const from = new Date(`${dateStr}T00:00:00+07:00`);
  const full = nextCrossing(from, 180);
  const dark = nextCrossing(from, 0);
  if (!full || !dark) return null;
  return { fullMoon: toBangkokDate(full), newMoon: toBangkokDate(dark) };
}
