/**
 * components/right/WeatherPredictionList.tsx
 * -----------------------------------------------------------------------
 * รายการพยากรณ์อากาศล่วงหน้า (วันถัดจากพรุ่งนี้) + ปุ่ม "Next 5 Days"
 * กดแต่ละวันเพื่อเปิด pop up สรุปอากาศและบันทึกเป็นวันเดินทาง
 * แถวที่บันทึกแล้วมีกรอบส้ม+เครื่องหมายถูก แถวที่ถูกล็อก (ผ่านวันไปแล้ว) ซีดลง+รูปกุญแจ
 * -----------------------------------------------------------------------
 */
import { useState } from "react";
import type { WeatherDay } from "../../types/weather";
import type { DayStatus } from "../../services/tripRules";
import { weatherCodeLabel } from "../../services/weatherApi";
import { weatherIconFor, ChevronRightIcon, CheckIcon, LockIcon } from "../icons";

interface Props {
  days: WeatherDay[]; // วันถัดจากพรุ่งนี้เป็นต้นไป
  statusOf: (date: string) => DayStatus;
  onSelectDay: (date: string) => void;
}

export default function WeatherPredictionList({ days, statusOf, onSelectDay }: Props) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? days : days.slice(0, 2);

  return (
    <section>
      <h2 className="mb-2 text-sm font-semibold text-ink">Weather Prediction</h2>

      <ul className="space-y-2">
        {visible.map((d) => {
          const Icon = weatherIconFor(d.weatherCode);
          const status = statusOf(d.date);
          const dateLabel = new Date(`${d.date}T00:00:00`).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
          });
          return (
            <li key={d.date}>
              <button
                type="button"
                data-status={status}
                title="กดเพื่อดูรายละเอียดและบันทึกวันเดินทาง"
                onClick={() => onSelectDay(d.date)}
                className={`flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-left transition-colors hover:bg-surface ${
                  status === "locked" ? "bg-surface/40 opacity-70" : "bg-surface/70"
                } ${status === "saved" ? "ring-2 ring-orange" : ""}`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="text-orange" width={20} height={20} />
                  <div>
                    <p className="text-xs text-ink/60">{dateLabel}</p>
                    <p className="text-sm font-medium text-ink">{weatherCodeLabel(d.weatherCode)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-ink">
                    {d.tempMax}°/{d.tempMin}°
                  </p>
                  {status === "saved" && <CheckIcon className="text-orange" width={16} height={16} />}
                  {status === "locked" && <LockIcon className="text-muted" width={15} height={15} />}
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      {!expanded && days.length > 2 && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-3 flex w-full items-center justify-center gap-1 rounded-full bg-orange py-2.5 text-sm font-semibold text-white"
        >
          Next 5 Days
          <ChevronRightIcon width={16} height={16} />
        </button>
      )}
    </section>
  );
}
