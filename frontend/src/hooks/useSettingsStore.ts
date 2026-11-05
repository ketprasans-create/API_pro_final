/**
 * hooks/useSettingsStore.ts
 * -----------------------------------------------------------------------
 * การตั้งค่าของผู้ใช้ (เก็บถาวรใน localStorage):
 *   - theme   : โหมดสว่าง / โหมดมืด
 *   - widgets : การ์ดไหนแสดงบนหน้าหลักบ้าง
 *
 * ไม่มีรายการ Weather Prediction และการบันทึกวันเดินทางในนี้ เพราะต้องแสดงเสมอ
 * -----------------------------------------------------------------------
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark";

export type WidgetKey =
  | "weather"
  | "airQuality"
  | "seaLevelPressure"
  | "moonPhase"
  | "temperatureChart"
  | "tomorrow"
  | "alertBanner"
  | "moreTools"
  | "citySummary"
  | "sun"
  | "uv";

export interface WidgetInfo {
  key: WidgetKey;
  label: string;
  description: string;
  group: "main" | "side";
}

// รายการที่ผู้ใช้เลือกเปิด/ปิดได้ (ใช้สร้างหน้าตั้งค่า) เรียงตามที่แสดงบนหน้าจอ
export const WIDGETS: WidgetInfo[] = [
  { key: "weather", label: "สภาพอากาศ", description: "อุณหภูมิ ความกดอากาศ ทัศนวิสัย และความชื้น", group: "main" },
  { key: "airQuality", label: "คุณภาพอากาศ", description: "ค่า AQI และทิศทางลม", group: "main" },
  {
    key: "seaLevelPressure",
    label: "ความกดอากาศระดับน้ำทะเล",
    description: "Sea Level Pressure แนวโน้ม 3 ชั่วโมง และกราฟรายชั่วโมงของวันนี้",
    group: "main",
  },
  { key: "moonPhase", label: "ข้างขึ้นข้างแรม", description: "Moon Phase วันนี้ และดวงจันทร์ 7 วันข้างหน้า", group: "main" },
  { key: "temperatureChart", label: "กราฟอุณหภูมิวันนี้", description: "อุณหภูมิช่วงเช้า บ่าย เย็น และกลางคืน", group: "main" },
  {
    key: "tomorrow",
    label: "พยากรณ์พรุ่งนี้",
    description: "การ์ดสรุปอากาศวันพรุ่งนี้ (ถ้าปิด วันพรุ่งนี้จะย้ายไปอยู่ในรายการ Weather Prediction แทน)",
    group: "main",
  },
  { key: "alertBanner", label: "แบนเนอร์เตือนอากาศสุดขั้ว", description: "เตือนเมื่อโอกาสฝนเกิน 80% หรือ UV เกิน 11", group: "main" },
  { key: "moreTools", label: "เครื่องมือเพิ่มเติม", description: "จังหวัดโปรด เปรียบเทียบเมือง และการ์ดแชร์", group: "main" },
  { key: "citySummary", label: "สรุปเมืองและอุณหภูมิ", description: "ชื่อจังหวัดกับอุณหภูมิปัจจุบัน", group: "side" },
  { key: "sun", label: "พระอาทิตย์ขึ้น-ตก", description: "เวลา Sunrise และ Sunset ของวันนี้", group: "side" },
  { key: "uv", label: "ดัชนี UV", description: "ระดับรังสี UV และความเสี่ยงของวันนี้", group: "side" },
];

export const WIDGET_KEYS = WIDGETS.map((w) => w.key);

export type WidgetVisibility = Record<WidgetKey, boolean>;

export const ALL_WIDGETS_ON = Object.fromEntries(WIDGET_KEYS.map((k) => [k, true])) as WidgetVisibility;

// ชุดสำเร็จรูป "เฉพาะสภาพอากาศกับ UV"
export const WEATHER_AND_UV_ONLY = Object.fromEntries(
  WIDGET_KEYS.map((k) => [k, k === "weather" || k === "uv"])
) as WidgetVisibility;

interface SettingsState {
  theme: Theme;
  widgets: WidgetVisibility;
  setTheme: (theme: Theme) => void;
  setWidget: (key: WidgetKey, visible: boolean) => void;
  setAllWidgets: (preset: WidgetVisibility) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: "light",
      widgets: ALL_WIDGETS_ON,
      setTheme: (theme) => set({ theme }),
      setWidget: (key, visible) => set((s) => ({ widgets: { ...s.widgets, [key]: visible } })),
      setAllWidgets: (preset) => set({ widgets: { ...preset } }),
    }),
    {
      name: "lomfa-settings", // ต้องตรงกับ key ที่อ่านใน index.html (สคริปต์กันจอสว่างวาบ)
      // รวมค่าที่เก็บไว้กับค่าเริ่มต้น: ถ้าวันหน้ามีการ์ดใหม่เพิ่ม ผู้ใช้เดิมจะได้การ์ดนั้น "เปิด" ไม่ใช่ undefined
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<SettingsState>;
        return {
          ...current,
          theme: p.theme === "dark" ? "dark" : "light",
          widgets: { ...current.widgets, ...(p.widgets ?? {}) },
        };
      },
    }
  )
);
