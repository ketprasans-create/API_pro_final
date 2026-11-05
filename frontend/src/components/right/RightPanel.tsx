/**
 * components/right/RightPanel.tsx
 * -----------------------------------------------------------------------
 * แผงด้านขวาสุด พื้นหลังทีลเต็มความสูงจอ: สรุปเมือง / พระอาทิตย์ขึ้น-ตก / UV / Weather Prediction
 * สามส่วนแรกเปิด-ปิดได้จากหน้าตั้งค่า ส่วน Weather Prediction แสดงเสมอ (เป็นทางเข้าบันทึกวันเดินทาง)
 * -----------------------------------------------------------------------
 */
import type { WeatherBundle } from "../../types/weather";
import type { DayStatus } from "../../services/tripRules";
import type { WidgetVisibility } from "../../hooks/useSettingsStore";
import CitySummary from "./CitySummary";
import SunArcChart from "./SunArcChart";
import UVIndexCard from "./UVIndexCard";
import WeatherPredictionList from "./WeatherPredictionList";

interface Props {
  bundle: WeatherBundle;
  widgets: WidgetVisibility;
  statusOf: (date: string) => DayStatus;
  onSelectDay: (date: string) => void;
}

export default function RightPanel({ bundle, widgets, statusOf, onSelectDay }: Props) {
  const today = bundle.days[0];
  // ปกติรายการเริ่มที่วันถัดจากพรุ่งนี้ (พรุ่งนี้อยู่ในการ์ด Tomorrow)
  // ถ้าผู้ใช้ปิดการ์ด Tomorrow ให้พรุ่งนี้มาอยู่ในรายการแทน จะได้ยังบันทึกวันพรุ่งนี้ได้
  const upcoming = bundle.days.slice(widgets.tomorrow ? 2 : 1);

  return (
    <aside className="hidden lg:flex w-80 shrink-0 flex-col gap-5 bg-teal px-5 py-6">
      {widgets.citySummary && <CitySummary province={bundle.province} temperature={bundle.current.temperature} />}
      {widgets.sun && <SunArcChart sunrise={today.sunrise} sunset={today.sunset} />}
      {widgets.uv && <UVIndexCard uvIndexMax={today.uvIndexMax} />}
      <WeatherPredictionList days={upcoming} statusOf={statusOf} onSelectDay={onSelectDay} />
    </aside>
  );
}
