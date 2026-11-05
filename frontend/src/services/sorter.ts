/**
 * services/sorter.ts
 * -----------------------------------------------------------------------
 * Data Processing — Selection Sort
 * สองแบบ: (1) เรียงหา "วันเดียว" ที่ pop (โอกาสฝน) น้อยที่สุด เหมือนเวอร์ชัน
 * server.js เดิม และ (2) เรียงหา "ช่วงต่อเนื่อง N วัน" ที่ pop รวมน้อยที่สุด
 * สำหรับฟีเจอร์ Trip Range Picker (ข้อ 7 — ใช้ selection sort ตามที่โจทย์ระบุ)
 * -----------------------------------------------------------------------
 */
import type { WeatherDay, TripWindowScore } from "../types/weather";

interface Ranked {
  pop: number;
  index: number;
}

// (1) เรียงหาวันที่ pop น้อยที่สุด — เหมือน selectionSortByPop ใน server.js เดิม
export function selectionSortByPop(days: WeatherDay[]): Ranked[] {
  const arr: Ranked[] = days.map((d, i) => ({ pop: d.pop, index: i }));
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j].pop < arr[minIdx].pop) minIdx = j; // เปรียบเทียบ pop ของสองวัน
    }
    if (minIdx !== i) {
      const tmp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = tmp;
    }
  }
  return arr;
}

// (2) หาช่วงเดินทางต่อเนื่อง `length` วัน ที่ pop รวมน้อยที่สุด (ใช้กับ Trip Range Picker)
export function bestTripWindow(
  days: WeatherDay[],
  length: number
): TripWindowScore | null {
  if (length < 1 || length > days.length) return null;

  // ขั้นที่ 1: คำนวณคะแนน (ผลรวม pop) ของทุกหน้าต่างขนาด `length` ที่เป็นไปได้
  const windows: TripWindowScore[] = [];
  for (let start = 0; start + length <= days.length; start++) {
    let totalPop = 0;
    for (let k = start; k < start + length; k++) totalPop += days[k].pop;
    windows.push({ startIndex: start, length, totalPop, avgPop: totalPop / length });
  }

  // ขั้นที่ 2: Selection Sort หา window ที่ totalPop น้อยที่สุด
  let best = 0;
  for (let i = 1; i < windows.length; i++) {
    if (windows[i].totalPop < windows[best].totalPop) best = i;
  }
  return windows[best] ?? null;
}
