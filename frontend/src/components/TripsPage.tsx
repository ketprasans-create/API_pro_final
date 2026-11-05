/**
 * components/TripsPage.tsx
 * -----------------------------------------------------------------------
 * หน้า "วันเดินทางที่บันทึก" (แยกจากหน้าแรก เปิดผ่านไอคอนเอกสารใน Sidebar หรือ #/trips)
 * แสดงวันเดินทางที่บันทึกไว้เรียงตามวันที่ พร้อมสรุปอากาศ ณ ตอนที่บันทึก
 * และปุ่ม "รีเซ็ตทริปใหม่" (ถามยืนยันก่อนล้าง เพราะข้อมูลถูกเก็บถาวรในเบราว์เซอร์)
 * -----------------------------------------------------------------------
 */
import { useTripStore } from "../hooks/useTripStore";
import type { Route } from "../hooks/useHashRoute";
import { formatLongDate, formatShortDate, getLatestSavedDate } from "../services/tripRules";
import { weatherCodeLabel } from "../services/weatherApi";
import Sidebar from "./layout/Sidebar";
import { ChevronRightIcon, ResetIcon, weatherIconFor } from "./icons";

interface Props {
  route: Route;
  onNavigate: (route: Route) => void;
}

export default function TripsPage({ route, onNavigate }: Props) {
  const trips = useTripStore((s) => s.trips);
  const resetTrips = useTripStore((s) => s.resetTrips);
  const latest = getLatestSavedDate(trips.map((t) => t.date));

  function handleReset() {
    if (window.confirm("ล้างวันเดินทางที่บันทึกไว้ทั้งหมด และเริ่มทริปใหม่?")) resetTrips();
  }

  return (
    <div className="flex min-h-screen bg-page">
      <Sidebar route={route} onNavigate={onNavigate} />

      <main className="flex-1 space-y-5 px-5 py-6 md:px-8">
        <button
          type="button"
          onClick={() => onNavigate("dashboard")}
          className="flex items-center gap-1 text-sm font-medium text-ink/70 hover:text-ink"
        >
          <ChevronRightIcon className="rotate-180" width={16} height={16} />
          กลับหน้าแรก
        </button>

        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-ink">วันเดินทางที่บันทึก</h1>
            <p className="mt-0.5 text-sm text-muted" role="status" aria-live="polite">
              {latest === null
                ? "ยังไม่ได้บันทึกวันเดินทาง"
                : `บันทึกแล้ว ${trips.length} วัน · ล็อกวันก่อน ${formatShortDate(latest)} แล้ว เลือกย้อนหลังไม่ได้`}
            </p>
          </div>

          <button
            type="button"
            onClick={handleReset}
            disabled={trips.length === 0}
            className="flex items-center gap-1.5 rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-surface"
          >
            <ResetIcon width={16} height={16} />
            รีเซ็ตทริปใหม่
          </button>
        </header>

        {trips.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-line bg-surface p-10 text-center">
            <p className="text-sm text-muted">
              กดวันที่ในรายการ Weather Prediction ที่หน้าแรก แล้วกด "บันทึกวันเดินทาง" วันที่เลือกจะมาแสดงที่นี่
            </p>
            <button
              type="button"
              onClick={() => onNavigate("dashboard")}
              className="mt-4 rounded-full bg-orange px-5 py-2.5 text-sm font-semibold text-white hover:brightness-105"
            >
              ไปเลือกวันที่หน้าแรก
            </button>
          </div>
        ) : (
          <ol className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {trips.map((trip, index) => {
              const Icon = weatherIconFor(trip.weatherCode);
              return (
                <li key={trip.date} data-testid="trip-card" className="rounded-3xl border border-orange/40 bg-surface p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs text-muted">วันที่ {index + 1} ของทริป</p>
                      <p className="text-base font-semibold text-ink">{formatLongDate(trip.date)}</p>
                      <p className="text-sm text-muted">{trip.province}</p>
                    </div>
                    <Icon className="shrink-0 text-orange" width={32} height={32} />
                  </div>

                  <p className="mt-4 text-2xl font-semibold text-ink">
                    {trip.tempMax}°<span className="text-base text-muted"> / {trip.tempMin}°</span>
                  </p>
                  <p className="text-sm text-ink/70">{weatherCodeLabel(trip.weatherCode)}</p>
                  <p className="mt-2 text-xs text-muted">โอกาสฝน {trip.pop}%</p>
                </li>
              );
            })}
          </ol>
        )}
      </main>
    </div>
  );
}
