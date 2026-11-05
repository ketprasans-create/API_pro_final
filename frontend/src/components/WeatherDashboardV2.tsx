/**
 * components/WeatherDashboardV2.tsx
 * -----------------------------------------------------------------------
 * หน้าแรก (Dashboard) — รีสกินตามภาพตัวอย่าง (sidebar ไอคอน, การ์ด Weather/Air Quality,
 * กราฟอุณหภูมิ, การ์ดพรุ่งนี้, แผงขวาสรุป+UV+พยากรณ์)
 *
 * การ์ดแต่ละใบเปิด-ปิดได้จากหน้าตั้งค่า (useSettingsStore) ถ้าแถวไหนเหลือการ์ดเดียว
 * การ์ดนั้นจะขยายเต็มความกว้าง
 *
 * การบันทึกวันเดินทาง: กดวันในรายการ Weather Prediction (หรือการ์ด Tomorrow)
 * -> pop up สรุปอากาศ -> กด "บันทึกวันเดินทาง" ข้อมูลไปอยู่ที่ useTripStore
 * และแสดงในหน้า "วันเดินทางที่บันทึก" (TripsPage) ส่วนนี้ไม่ขึ้นกับการตั้งค่า
 * -----------------------------------------------------------------------
 */
import { useMemo, useState } from "react";
import { useWeather } from "../hooks/useWeather";
import { useAirQuality } from "../hooks/useAirQuality";
import { useTripStore } from "../hooks/useTripStore";
import { useSettingsStore } from "../hooks/useSettingsStore";
import type { Route } from "../hooks/useHashRoute";
import { getProvince } from "../services/provinces";
import { getDayStatus, getLatestSavedDate } from "../services/tripRules";

import Sidebar from "./layout/Sidebar";
import TopHeader from "./layout/TopHeader";
import WeatherHeroCard from "./dashboard/WeatherHeroCard";
import AirQualityCard from "./dashboard/AirQualityCard";
import SeaLevelPressureCard from "./dashboard/SeaLevelPressureCard";
import MoonPhaseCard from "./dashboard/MoonPhaseCard";
import TemperatureLineChart from "./dashboard/TemperatureLineChart";
import TomorrowCard from "./dashboard/TomorrowCard";
import RightPanel from "./right/RightPanel";
import WeatherAlertBanner from "./WeatherAlertBanner";
import DayDetailModal from "./DayDetailModal";

import FavoriteCitiesBar from "./FavoriteCitiesBar";
import ShareableTripCard from "./ShareableTripCard";
import CityComparison from "./CityComparison";
import { ChevronRightIcon } from "./icons";

interface Props {
  route: Route;
  onNavigate: (route: Route) => void;
  selectedProvince: string;
  onSelectProvince: (name: string) => void;
}

export default function WeatherDashboardV2({ route, onNavigate, selectedProvince, onSelectProvince }: Props) {
  const [showMore, setShowMore] = useState(false);
  const [detailDate, setDetailDate] = useState<string | null>(null); // วันที่ที่เปิด pop up อยู่ (null = ปิด)

  const widgets = useSettingsStore((s) => s.widgets);

  const trips = useTripStore((s) => s.trips);
  const saveTrip = useTripStore((s) => s.saveTrip);
  const savedDates = useMemo(() => trips.map((t) => t.date), [trips]);
  const latestSavedDate = getLatestSavedDate(savedDates);
  const statusOf = (date: string) => getDayStatus(date, savedDates);

  const coords = getProvince(selectedProvince) ?? null;
  const weatherQuery = useWeather(selectedProvince, coords);
  const airQuery = useAirQuality(coords, weatherQuery.data?.current.windDirectionDeg ?? 0);

  const bundle = weatherQuery.data;
  const detailDay = bundle && detailDate ? bundle.days.find((d) => d.date === detailDate) : undefined;

  // แถวบน: Weather + Air Quality | แถวกลาง: Sea Level Pressure + Moon Phase | แถวล่าง: กราฟอุณหภูมิ + Tomorrow
  const topRow = widgets.weather || widgets.airQuality;
  const middleRow = widgets.seaLevelPressure || widgets.moonPhase;
  const bottomRow = widgets.temperatureChart || widgets.tomorrow;
  const nothingOnMain = !(topRow || middleRow || bottomRow || widgets.moreTools);

  function handleSelectProvince(name: string) {
    setDetailDate(null);
    onSelectProvince(name);
  }

  return (
    <div className="flex min-h-screen bg-page">
      <Sidebar route={route} onNavigate={onNavigate} />

      <main className="flex-1 space-y-5 px-5 py-6 md:px-8">
        <TopHeader greetingName={selectedProvince} onSelectProvince={handleSelectProvince} />

        {weatherQuery.isLoading && <p className="text-sm text-muted">กำลังโหลดข้อมูลอากาศ...</p>}
        {weatherQuery.isError && (
          <p className="rounded-2xl bg-red-50 dark:bg-red-500/10 p-3 text-sm text-coral">
            {(weatherQuery.error as Error)?.message ?? "โหลดข้อมูลไม่สำเร็จ"}
          </p>
        )}

        {bundle && (
          <>
            {widgets.alertBanner && (
              <WeatherAlertBanner pop={bundle.days[0].pop} uvIndexMax={bundle.days[0].uvIndexMax} />
            )}

            {topRow && (
              <div className={`grid gap-5 ${widgets.weather && widgets.airQuality ? "md:grid-cols-2" : ""}`}>
                {widgets.weather && <WeatherHeroCard current={bundle.current} />}
                {widgets.airQuality && <AirQualityCard airQuality={airQuery.data} isLoading={airQuery.isLoading} />}
              </div>
            )}

            {middleRow && (
              <div className={`grid gap-5 ${widgets.seaLevelPressure && widgets.moonPhase ? "md:grid-cols-2" : ""}`}>
                {widgets.seaLevelPressure && <SeaLevelPressureCard data={bundle.seaLevel} />}
                {widgets.moonPhase && <MoonPhaseCard days={bundle.days} events={bundle.moonEvents} />}
              </div>
            )}

            {bottomRow && (
              <div className={`grid gap-5 ${widgets.temperatureChart && widgets.tomorrow ? "md:grid-cols-3" : ""}`}>
                {widgets.temperatureChart && (
                  <div className={widgets.tomorrow ? "md:col-span-2" : ""}>
                    <TemperatureLineChart points={bundle.todayHourlyTemps} />
                  </div>
                )}
                {widgets.tomorrow && (
                  <TomorrowCard
                    tomorrow={bundle.days[1] ?? bundle.days[0]}
                    province={bundle.province}
                    status={statusOf((bundle.days[1] ?? bundle.days[0]).date)}
                    onSelect={() => setDetailDate((bundle.days[1] ?? bundle.days[0]).date)}
                  />
                )}
              </div>
            )}

            {widgets.moreTools && (
              <section className="rounded-3xl border border-line bg-surface p-4">
                <button
                  type="button"
                  onClick={() => setShowMore((v) => !v)}
                  className="flex w-full items-center justify-between text-sm font-semibold text-ink"
                >
                  เครื่องมือเพิ่มเติม (จังหวัดโปรด, เปรียบเทียบเมือง, แชร์การ์ด)
                  <ChevronRightIcon
                    className={`transition-transform ${showMore ? "rotate-90" : ""}`}
                    width={16}
                    height={16}
                  />
                </button>

                {showMore && (
                  <div className="mt-4 space-y-4">
                    <FavoriteCitiesBar currentProvince={selectedProvince} onSelect={handleSelectProvince} />
                    <ShareableTripCard province={bundle.province} day={bundle.days[bundle.bestIndex]} />
                    <CityComparison />
                  </div>
                )}
              </section>
            )}

            {nothingOnMain && (
              <div className="rounded-3xl border border-dashed border-line bg-surface p-8 text-center">
                <p className="text-sm text-muted">ตอนนี้ปิดการ์ดบนหน้าหลักไว้ทั้งหมด เลือกสิ่งที่อยากให้แสดงได้ที่หน้าตั้งค่า</p>
                <button
                  type="button"
                  onClick={() => onNavigate("settings")}
                  className="mt-4 rounded-full bg-orange px-5 py-2.5 text-sm font-semibold text-white hover:brightness-105"
                >
                  ไปหน้าตั้งค่า
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {bundle && <RightPanel bundle={bundle} widgets={widgets} statusOf={statusOf} onSelectDay={setDetailDate} />}

      {bundle && detailDay && (
        <DayDetailModal
          day={detailDay}
          province={bundle.province}
          status={statusOf(detailDay.date)}
          latestSavedDate={latestSavedDate}
          onSave={() =>
            saveTrip({
              date: detailDay.date,
              province: bundle.province,
              weatherCode: detailDay.weatherCode,
              tempMax: detailDay.tempMax,
              tempMin: detailDay.tempMin,
              pop: detailDay.pop,
            })
          }
          onClose={() => setDetailDate(null)}
          onViewTrips={() => {
            setDetailDate(null);
            onNavigate("trips");
          }}
        />
      )}
    </div>
  );
}
