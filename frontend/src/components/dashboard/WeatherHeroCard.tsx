/**
 * components/dashboard/WeatherHeroCard.tsx
 * -----------------------------------------------------------------------
 * การ์ด "Weather" ใบใหญ่ด้านซ้ายบน: อุณหภูมิหลัก + chip ข้อมูล 3 ช่อง
 * (Pressure / Visibility / Humidity) พื้นหลังไล่สีฟ้า-ครีมแทนภาพประกอบท้องฟ้า
 * -----------------------------------------------------------------------
 */
import type { CurrentWeather } from "../../types/weather";
import { weatherCodeLabel } from "../../services/weatherApi";
import { weatherIconFor } from "../icons";

interface Props {
  current: CurrentWeather;
}

export default function WeatherHeroCard({ current }: Props) {
  const Icon = weatherIconFor(current.weatherCode);

  return (
    <section className="relative overflow-hidden rounded-3xl bg-weather-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-ink/80">Weather</p>
          <p className="text-xs text-muted">What's the weather?</p>
        </div>
        <Icon className="text-orange" width={34} height={34} />
      </div>

      <p className="mt-4 text-4xl font-semibold text-ink">{current.temperature}°C</p>
      <p className="text-sm text-ink/70">{weatherCodeLabel(current.weatherCode)}</p>

      <div className="mt-5 grid grid-cols-3 gap-2">
        <div className="rounded-xl bg-surface/70 px-2.5 py-2 text-center backdrop-blur-sm">
          <p className="text-[11px] text-muted">Pressure</p>
          <p className="text-sm font-semibold text-ink">{current.pressure}mb</p>
        </div>
        <div className="rounded-xl bg-surface/70 px-2.5 py-2 text-center backdrop-blur-sm">
          <p className="text-[11px] text-muted">Visibility</p>
          <p className="text-sm font-semibold text-ink">{current.visibilityKm} km</p>
        </div>
        <div className="rounded-xl bg-surface/70 px-2.5 py-2 text-center backdrop-blur-sm">
          <p className="text-[11px] text-muted">Humidity</p>
          <p className="text-sm font-semibold text-ink">{current.humidity}%</p>
        </div>
      </div>
    </section>
  );
}
