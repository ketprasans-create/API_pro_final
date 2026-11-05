/**
 * components/WeatherAlertBanner.tsx
 * -----------------------------------------------------------------------
 * ฟีเจอร์ 8: Dynamic Weather Alert Banner
 * เตือนภัยเมื่อโอกาสฝน (pop) > 80% หรือ UV index > 11 ของ "วันนี้"
 * ใช้ Tailwind keyframe "alert-pulse" ที่ประกาศไว้ใน tailwind.config.js
 * -----------------------------------------------------------------------
 */
import { AlertTriangleIcon } from "./icons";

interface Props {
  pop: number;
  uvIndexMax: number;
}

export default function WeatherAlertBanner({ pop, uvIndexMax }: Props) {
  const alerts: string[] = [];
  if (pop > 80) alerts.push(`โอกาสฝนวันนี้สูงถึง ${pop}% เตรียมร่ม/เสื้อกันฝนให้พร้อม`);
  if (uvIndexMax > 11) alerts.push(`ดัชนี UV วันนี้สูงมาก (${uvIndexMax}) เลี่ยงแดดจัดช่วงเที่ยง`);

  if (alerts.length === 0) return null;

  return (
    <div
      role="alert"
      className="animate-alert-pulse flex items-center gap-2 rounded-xl bg-coral px-4 py-3 text-sm font-semibold text-white"
    >
      <AlertTriangleIcon width={16} height={16} />
      <span>{alerts.join(" · ")}</span>
    </div>
  );
}
