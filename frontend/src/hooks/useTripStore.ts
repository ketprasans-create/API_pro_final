/**
 * hooks/useTripStore.ts
 * -----------------------------------------------------------------------
 * Zustand store เก็บ "วันเดินทางที่บันทึกไว้" ใช้ร่วมกันระหว่างหน้าแรก (pop up บันทึกวัน)
 * กับหน้าวันเดินทางที่บันทึก และเก็บลง localStorage (persist) ปิดแท็บแล้วข้อมูลยังอยู่
 *
 * เก็บ "ภาพสรุปอากาศ ณ ตอนที่บันทึก" ไว้ด้วย หน้าที่แสดงรายการจึงไม่ต้องโหลดพยากรณ์ใหม่
 * กฎล็อกวันย้อนหลังตรวจในฟังก์ชัน saveTrip ด้วย ไม่พึ่งแค่การ disable ปุ่มใน UI
 * -----------------------------------------------------------------------
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getDayStatus, getLatestSavedDate, formatShortDate } from "../services/tripRules";

export interface SavedTrip {
  date: string; // YYYY-MM-DD
  province: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  pop: number;
}

interface SaveResult {
  ok: boolean;
  reason?: string;
}

interface TripState {
  trips: SavedTrip[];
  saveTrip: (trip: SavedTrip) => SaveResult;
  resetTrips: () => void;
}

export const useTripStore = create<TripState>()(
  persist(
    (set, get) => ({
      trips: [],

      saveTrip: (trip) => {
        const dates = get().trips.map((t) => t.date);
        const status = getDayStatus(trip.date, dates);

        if (status === "saved") return { ok: false, reason: "วันนี้ถูกบันทึกไว้แล้ว" };
        if (status === "locked") {
          const latest = getLatestSavedDate(dates);
          return {
            ok: false,
            reason: `เลือกย้อนหลังไม่ได้ — บันทึกวันที่ ${latest ? formatShortDate(latest) : ""} ไปแล้ว`,
          };
        }

        // วันที่ผ่านกฎต้องไม่ย้อนหลังและไม่ซ้ำ รายการจึงเรียงตามวันที่จากน้อยไปมากเสมอ
        set((state) => ({ trips: [...state.trips, trip] }));
        return { ok: true };
      },

      resetTrips: () => set({ trips: [] }),
    }),
    { name: "lomfa-saved-trips" } // key ใน localStorage
  )
);
