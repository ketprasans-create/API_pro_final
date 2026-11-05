/**
 * components/dashboard/AirQualityCard.tsx
 * -----------------------------------------------------------------------
 * การ์ด "Air Quality" ใบใหญ่ด้านขวาบน: ค่า AQI + ทิศทางลม + แถบสเกล
 * Good / Standard / Hazardous พร้อมตัวชี้ตำแหน่งตามค่า AQI จริง
 * -----------------------------------------------------------------------
 */
import type { AirQuality } from "../../types/weather";
import { WindIcon } from "../icons";

interface Props {
  airQuality?: AirQuality;
  isLoading: boolean;
}

export default function AirQualityCard({ airQuality, isLoading }: Props) {
  const pct = airQuality ? Math.min(100, airQuality.aqi) : 0;

  return (
    <section className="rounded-3xl bg-air-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-ink/80">Air Quality</p>
          <p className="text-xs text-muted">Main pollution: PM2.5</p>
        </div>
        <WindIcon className="text-orange" width={28} height={28} />
      </div>

      {isLoading || !airQuality ? (
        <p className="mt-6 text-sm text-muted">กำลังโหลดคุณภาพอากาศ...</p>
      ) : (
        <>
          <div className="mt-4 flex items-end gap-2">
            <span className="text-4xl font-semibold text-ink">{airQuality.aqi}</span>
            <span className="mb-1 rounded-full bg-surface/70 px-2 py-0.5 text-[11px] font-medium text-ink">
              AQI
            </span>
          </div>
          <p className="text-sm text-ink/70">{airQuality.windLabel}</p>

          <div className="mt-5">
            <div className="flex justify-between text-[11px] text-ink/70">
              <span>Good</span>
              <span>Standard</span>
              <span>Hazardous</span>
            </div>
            <div className="relative mt-1 h-2 rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-red-500">
              <div
                className="absolute -top-1.5 h-5 w-5 -translate-x-1/2 rounded-full border-2 border-surface bg-ink shadow"
                style={{ left: `${pct}%` }}
                title={airQuality.categoryLabel}
              />
            </div>
          </div>
        </>
      )}
    </section>
  );
}
