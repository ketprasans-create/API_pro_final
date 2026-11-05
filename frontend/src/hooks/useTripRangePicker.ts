/**
 * hooks/useTripRangePicker.ts
 * -----------------------------------------------------------------------
 * ฟีเจอร์ 7: Multi-day Trip Range Picker + Sequential Lock Rule
 *
 * Validation state ที่โจทย์ขอ: เมื่อบันทึกวันใดไปแล้ว ห้ามบันทึก/เลือกวันที่
 * "ก่อนหน้า" วันนั้นได้อีก เพื่อบังคับให้ทริปเดินหน้าไปเรื่อยๆ ตามลำดับเวลา
 *
 * วิธีกันวันย้อนหลัง (minDate):
 *   - minAllowedDate = วันที่ล่าสุด (มากที่สุด) ที่เคยบันทึกไว้แล้ว
 *   - ถ้ายังไม่เคยบันทึกอะไรเลย -> ไม่มีข้อจำกัด (minAllowedDate = null)
 *   - การบันทึกวันใหม่ ต้องมีวันที่ >= minAllowedDate เท่านั้น ไม่งั้น reject
 *   - isDateDisabled(date) ให้ UI (เช่น ปฏิทิน/การ์ด) เอาไปปิดปุ่มของวันที่
 *     อยู่ก่อนหน้า minAllowedDate ได้โดยตรง
 * -----------------------------------------------------------------------
 */
import { useMemo, useState } from "react";
import type { SavedTripDate } from "../types/weather";

interface SaveResult {
  ok: boolean;
  reason?: string;
}

export function useTripRangePicker() {
  const [savedDates, setSavedDates] = useState<SavedTripDate[]>([]);

  // วันที่ล่าสุดที่บันทึกไว้ (string เทียบกันได้ตรงๆ เพราะเป็นรูปแบบ YYYY-MM-DD)
  const minAllowedDate = useMemo(() => {
    if (savedDates.length === 0) return null;
    return savedDates.reduce((max, d) => (d.date > max ? d.date : max), savedDates[0].date);
  }, [savedDates]);

  function isDateDisabled(date: string): boolean {
    return minAllowedDate !== null && date < minAllowedDate;
  }

  function trySaveDate(entry: SavedTripDate): SaveResult {
    if (minAllowedDate !== null && entry.date < minAllowedDate) {
      return {
        ok: false,
        reason: `เลือกวันย้อนหลังไม่ได้ — บันทึกได้ตั้งแต่วันที่ ${minAllowedDate} เป็นต้นไป`,
      };
    }
    if (savedDates.some((d) => d.date === entry.date && d.province === entry.province)) {
      return { ok: false, reason: "วันนี้ถูกบันทึกไว้แล้ว" };
    }
    setSavedDates((prev) => [...prev, entry]);
    return { ok: true };
  }

  function clearAll() {
    setSavedDates([]);
  }

  return { savedDates, minAllowedDate, isDateDisabled, trySaveDate, clearAll };
}
