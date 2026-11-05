/**
 * components/ActivityBadge.tsx
 * -----------------------------------------------------------------------
 * ฟีเจอร์ 2: Smart Activity Recommender
 * คำนวณกิจกรรมแนะนำจาก pop (โอกาสฝน) / uvIndexMax / tempMax ของ "วันนี้"
 * เป็น pure function ธรรมดา (recommendActivity) แยกจาก component การแสดงผล
 * เพื่อให้เทสต์ได้ง่ายและเอาไปใช้ซ้ำที่อื่น (เช่นในการ์ดเปรียบเทียบเมือง)
 * -----------------------------------------------------------------------
 */
import type { ComponentType } from "react";
import { CoffeeIcon, SunIcon, UmbrellaIcon, WavesIcon } from "./icons";

interface ActivityInput {
  pop: number;
  uvIndexMax: number;
  tempMax: number;
}

interface ActivitySuggestion {
  Icon: ComponentType<{ width?: number; height?: number; className?: string }>;
  label: string;
  tone: "good" | "caution" | "warn";
}

export function recommendActivity({ pop, uvIndexMax, tempMax }: ActivityInput): ActivitySuggestion {
  if (pop >= 60) {
    return { Icon: UmbrellaIcon, label: "ฝนตกชุก เหมาะกับคาเฟ่/กิจกรรมในร่ม", tone: "warn" };
  }
  if (uvIndexMax >= 8) {
    return { Icon: SunIcon, label: "แดดแรงมาก พกครีมกันแดด/ร่มกันแดด", tone: "caution" };
  }
  if (pop < 30 && tempMax >= 28) {
    return { Icon: WavesIcon, label: "อากาศดี เหมาะไปทะเลหรือกิจกรรมกลางแจ้ง", tone: "good" };
  }
  return { Icon: CoffeeIcon, label: "อากาศเฉยๆ เหมาะเดินเล่น/คาเฟ่ชิลๆ", tone: "good" };
}

const TONE_CLASS: Record<ActivitySuggestion["tone"], string> = {
  good: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
  caution: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  warn: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
};

export default function ActivityBadge(props: ActivityInput) {
  const { Icon, label, tone } = recommendActivity(props);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${TONE_CLASS[tone]}`}
    >
      <Icon width={15} height={15} />
      {label}
    </span>
  );
}
