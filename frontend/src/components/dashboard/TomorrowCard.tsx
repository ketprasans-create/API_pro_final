/**
 * components/dashboard/TomorrowCard.tsx
 * -----------------------------------------------------------------------
 * การ์ดสีเขียวเข้ม "Tomorrow" ใบเล็กมุมขวาของแถวล่าง — สรุปพยากรณ์วันพรุ่งนี้
 * กดเพื่อเปิด pop up บันทึกวันเดินทางได้เหมือนรายการ Weather Prediction
 * (พรุ่งนี้ไม่อยู่ในรายการนั้น จึงต้องมีทางเข้านี้ ไม่งั้นจะบันทึกวันพรุ่งนี้ไม่ได้)
 * -----------------------------------------------------------------------
 */
import type { WeatherDay } from "../../types/weather";
import type { DayStatus } from "../../services/tripRules";
import { weatherCodeLabel } from "../../services/weatherApi";
import { CheckIcon, LockIcon, weatherIconFor } from "../icons";

interface Props {
  tomorrow: WeatherDay;
  province: string;
  status: DayStatus;
  onSelect: () => void;
}

export default function TomorrowCard({ tomorrow, province, status, onSelect }: Props) {
  const Icon = weatherIconFor(tomorrow.weatherCode);
  const dateLabel = new Date(`${tomorrow.date}T00:00:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  return (
    <button
      type="button"
      data-status={status}
      title="กดเพื่อดูรายละเอียดและบันทึกวันเดินทาง"
      onClick={onSelect}
      className="flex flex-col justify-between rounded-3xl bg-tomorrow-card p-5 text-left text-white transition-transform hover:scale-[1.01]"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-white/70">Tomorrow</p>
          <p className="text-sm font-medium">{dateLabel}</p>
          <p className="text-xs text-white/60">{province}</p>
        </div>
        {status === "saved" && <CheckIcon width={18} height={18} />}
        {status === "locked" && <LockIcon width={16} height={16} className="text-white/70" />}
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-3xl font-semibold">{tomorrow.tempMax}°C</p>
          <p className="text-xs text-white/70">{weatherCodeLabel(tomorrow.weatherCode)}</p>
        </div>
        <Icon width={30} height={30} />
      </div>
    </button>
  );
}
