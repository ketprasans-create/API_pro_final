/**
 * services/tripRules.ts
 * -----------------------------------------------------------------------
 * กฎการบันทึกวันเดินทาง (Sequential Lock Rule) + ตัวช่วยแสดงวันที่ภาษาไทย
 *
 * กฎ: เมื่อบันทึกวันใดแล้ว ทุกวันที่ "ก่อนหน้า" วันที่ถูกบันทึกล่าสุดจะถูกล็อก
 * (เลือกย้อนหลังไม่ได้) ส่วนวันหลังจากนั้นยังเลือกเพิ่มได้
 * สถานะของแต่ละวันคำนวณจากรายการวันที่บันทึกทุกครั้ง ไม่ได้เก็บแยกต่างหาก
 * -----------------------------------------------------------------------
 */
export type DayStatus = "saved" | "locked" | "available";

// วันที่ล่าสุดที่ถูกบันทึก (เทียบสตริง YYYY-MM-DD ได้ตรงๆ) null = ยังไม่ได้บันทึกอะไร
export function getLatestSavedDate(savedDates: string[]): string | null {
  return savedDates.reduce<string | null>((max, d) => (max === null || d > max ? d : max), null);
}

export function getDayStatus(date: string, savedDates: string[]): DayStatus {
  if (savedDates.includes(date)) return "saved"; // ตรวจก่อนเสมอ: วันที่บันทึกแล้วต้องเป็น "บันทึกแล้ว" ไม่ใช่ "ล็อก"
  const latest = getLatestSavedDate(savedDates);
  if (latest !== null && date < latest) return "locked";
  return "available";
}

const DAY_NAMES = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
const MONTHS_SHORT = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
const MONTHS_FULL = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
];

// แยก YYYY-MM-DD เอง ไม่ใช้ new Date("YYYY-MM-DD") เพื่อไม่ให้วันเพี้ยนเพราะ timezone
function parts(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return { year, month, day, weekday: new Date(year, month - 1, day).getDay() };
}

// "2026-11-03" -> "3 พ.ย."
export function formatShortDate(date: string): string {
  const { month, day } = parts(date);
  return `${day} ${MONTHS_SHORT[month - 1]}`;
}

// "2026-11-03" -> "วันอังคารที่ 3 พฤศจิกายน"
export function formatLongDate(date: string): string {
  const { month, day, weekday } = parts(date);
  return `วัน${DAY_NAMES[weekday]}ที่ ${day} ${MONTHS_FULL[month - 1]}`;
}
