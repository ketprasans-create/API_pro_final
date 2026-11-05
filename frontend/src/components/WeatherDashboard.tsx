/**
 * components/WeatherDashboard.tsx
 * -----------------------------------------------------------------------
 * Main Component — ประกอบทุกฟีเจอร์ (1–10) เข้าด้วยกันเป็นหน้าเดียว
 *
 *   1. useGeolocation            -> อากาศตำแหน่งปัจจุบันเมื่อยังไม่เลือกจังหวัด
 *   2. ActivityBadge             -> คำแนะนำกิจกรรมของ "วันนี้"
 *   3. CityComparison            -> เครื่องมือเปรียบเทียบ 2 จังหวัด (แยกส่วนด้านล่าง)
 *   4. FavoriteCitiesBar         -> แถบจังหวัดโปรด (Zustand + localStorage)
 *   5. HourlyChart               -> กราฟฝนรายชั่วโมงของวันที่เลือก (Recharts)
 *   6. ProvinceAutocomplete      -> ค้นหา/กรองจังหวัดตามภาค
 *   7. TripRangePicker           -> วางแผนทริป N วัน + sequential lock rule
 *   8. WeatherAlertBanner        -> แบนเนอร์เตือนภัยด้านบนสุด
 *   9. useWeather (React Query)  -> fetch + cache + loading/error state
 *  10. ShareableTripCard         -> การ์ดแชร์วันที่แนะนำที่สุด
 * -----------------------------------------------------------------------
 */
import { useState } from "react";
import { useGeolocation } from "../hooks/useGeolocation";
import { useWeather } from "../hooks/useWeather";
import { getProvince } from "../services/provinces";
import { weatherCodeLabel } from "../services/weatherApi";

import WeatherAlertBanner from "./WeatherAlertBanner";
import ActivityBadge from "./ActivityBadge";
import ProvinceAutocomplete from "./ProvinceAutocomplete";
import FavoriteCitiesBar from "./FavoriteCitiesBar";
import HourlyChart from "./HourlyChart";
import TripRangePicker from "./TripRangePicker";
import ShareableTripCard from "./ShareableTripCard";
import CityComparison from "./CityComparison";
import { LocationIcon } from "./icons";

export default function WeatherDashboard() {
  // null = ใช้ตำแหน่งปัจจุบันจาก GPS (feature 1), ไม่ null = จังหวัดที่เลือกเอง
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);

  const geo = useGeolocation();
  const coords = selectedProvince ? getProvince(selectedProvince) ?? null : geo.coords;
  const weatherQuery = useWeather(selectedProvince, coords);

  const provinceLabel = selectedProvince ?? "ตำแหน่งปัจจุบัน";

  function handleSelectProvince(name: string) {
    setSelectedProvince(name);
    setActiveDayIndex(0);
    setSearchOpen(false);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-4">
      <header className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-sky">ลมฟ้า — อากาศ {provinceLabel}</h1>
        <div className="flex gap-2">
          {selectedProvince && (
            <button
              type="button"
              onClick={() => setSelectedProvince(null)}
              className="rounded-full border border-line px-3 py-1 text-xs"
            >
              <LocationIcon width={13} height={13} className="inline" /> ใช้ตำแหน่งปัจจุบัน
            </button>
          )}
          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            className="rounded-full bg-sky px-3 py-1 text-xs font-medium text-white"
          >
            ค้นหาจังหวัด
          </button>
        </div>
      </header>

      {searchOpen && (
        <div className="rounded-2xl border border-line bg-surface p-3">
          <ProvinceAutocomplete onSelect={handleSelectProvince} />
        </div>
      )}

      <FavoriteCitiesBar currentProvince={selectedProvince} onSelect={handleSelectProvince} />

      {!selectedProvince && geo.status === "error" && (
        <p className="rounded-xl bg-amber-50 p-3 text-xs text-amber-700">
          ขอตำแหน่งไม่สำเร็จ ({geo.error}) — ลองค้นหาจังหวัดแทนได้
        </p>
      )}

      {weatherQuery.isLoading && <p className="text-sm text-muted">กำลังโหลดข้อมูลอากาศ...</p>}
      {weatherQuery.isError && (
        <p className="rounded-xl bg-red-50 p-3 text-sm text-coral">
          {(weatherQuery.error as Error)?.message ?? "โหลดข้อมูลไม่สำเร็จ"}
        </p>
      )}

      {weatherQuery.data && (
        <>
          {(() => {
            const bundle = weatherQuery.data;
            const today = bundle.days[0];
            const activeDay = bundle.days[activeDayIndex] ?? today;
            const bestDay = bundle.days[bundle.bestIndex];

            return (
              <>
                <WeatherAlertBanner pop={today.pop} uvIndexMax={today.uvIndexMax} />

                {/* Hero: อากาศปัจจุบัน */}
                <section className="rounded-2xl bg-surface p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-ink/70">{weatherCodeLabel(bundle.current.weatherCode)}</p>
                      <p className="text-4xl font-bold">{bundle.current.temperature}°</p>
                      <p className="text-xs text-muted">
                        รู้สึกเหมือน {bundle.current.feelsLike}° · ความชื้น {bundle.current.humidity}%
                      </p>
                    </div>
                    <ActivityBadge pop={today.pop} uvIndexMax={today.uvIndexMax} tempMax={today.tempMax} />
                  </div>
                </section>

                {/* พยากรณ์ 7 วัน */}
                <section className="space-y-2">
                  <h2 className="text-sm font-semibold">พยากรณ์ 7 วัน</h2>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {bundle.days.map((d, idx) => (
                      <button
                        key={d.date}
                        type="button"
                        onClick={() => setActiveDayIndex(idx)}
                        className={`min-w-[86px] rounded-xl border p-2 text-center text-xs ${
                          idx === activeDayIndex ? "border-sky bg-sky-soft" : "border-line bg-surface"
                        }`}
                      >
                        {idx === bundle.bestIndex && <p className="text-[10px] font-semibold text-emerald-600">แนะนำ</p>}
                        <p className="font-medium">{d.date.slice(5)}</p>
                        <p>{d.tempMax}° / {d.tempMin}°</p>
                        <p className="text-sky">ฝน {d.pop}%</p>
                      </button>
                    ))}
                  </div>
                </section>

                {/* กราฟรายชั่วโมงของวันที่เลือก */}
                <section className="rounded-2xl border border-line bg-surface p-4">
                  <h2 className="mb-2 text-sm font-semibold">โอกาสฝนรายชั่วโมง — {activeDay.date}</h2>
                  <HourlyChart day={activeDay} />
                </section>

                <TripRangePicker province={bundle.province} days={bundle.days} />

                <ShareableTripCard province={bundle.province} day={bestDay} />
              </>
            );
          })()}
        </>
      )}

      <CityComparison />
    </div>
  );
}
