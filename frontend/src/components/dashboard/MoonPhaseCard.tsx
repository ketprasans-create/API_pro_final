/**
 * components/dashboard/MoonPhaseCard.tsx
 * -----------------------------------------------------------------------
 * การ์ด Moon Phase (ข้างขึ้นข้างแรม): เฟสของวันนี้ + % ที่สว่าง + อายุดวงจันทร์
 * + วันเต็มดวง/วันดับครั้งถัดไป + แถบดวงจันทร์ของพยากรณ์ทุกวัน
 * ข้อมูลคำนวณที่ backend (backend/moon.js)
 * -----------------------------------------------------------------------
 */
import type { MoonEvents, MoonPhaseKey, WeatherDay } from "../../types/weather";
import { formatShortDate } from "../../services/tripRules";
import MoonDisc from "../MoonDisc";

export const MOON_PHASE_LABEL: Record<MoonPhaseKey, { th: string; en: string }> = {
  new_moon: { th: "วันดับ (เดือนมืด)", en: "New Moon" },
  waxing_crescent: { th: "เสี้ยวข้างขึ้น", en: "Waxing Crescent" },
  first_quarter: { th: "ครึ่งดวงข้างขึ้น", en: "First Quarter" },
  waxing_gibbous: { th: "ค่อนดวงข้างขึ้น", en: "Waxing Gibbous" },
  full_moon: { th: "เต็มดวง", en: "Full Moon" },
  waning_gibbous: { th: "ค่อนดวงข้างแรม", en: "Waning Gibbous" },
  last_quarter: { th: "ครึ่งดวงข้างแรม", en: "Last Quarter" },
  waning_crescent: { th: "เสี้ยวข้างแรม", en: "Waning Crescent" },
};

interface Props {
  days: WeatherDay[];
  events: MoonEvents | null;
}

export default function MoonPhaseCard({ days, events }: Props) {
  const today = days[0];
  const label = MOON_PHASE_LABEL[today.moon.phase];

  return (
    <section className="rounded-3xl bg-navy p-5 text-white">
      <div>
        <p className="text-sm font-medium text-white/90">Moon Phase</p>
        <p className="text-xs text-white/60">ข้างขึ้นข้างแรม</p>
      </div>

      <div className="mt-4 flex items-center gap-5">
        <MoonDisc illumination={today.moon.illumination} waxing={today.moon.waxing} size={96} className="shrink-0" />
        <div>
          <p className="text-xl font-semibold" data-testid="moon-name">
            {label.th}
          </p>
          <p className="text-xs text-white/60">{label.en}</p>
          <p className="mt-2 text-sm text-white/80">
            สว่าง {today.moon.illumination}% · อายุ {today.moon.ageDays} วัน
          </p>
        </div>
      </div>

      {events && (
        <p className="mt-4 text-xs text-white/70" data-testid="moon-events">
          เต็มดวงครั้งถัดไป {formatShortDate(events.fullMoon)} · วันดับครั้งถัดไป {formatShortDate(events.newMoon)}
        </p>
      )}

      <ul className="mt-4 flex justify-between gap-1 border-t border-white/10 pt-4">
        {days.map((d, i) => (
          <li key={d.date} className="flex flex-col items-center gap-1" data-testid="moon-day">
            <MoonDisc illumination={d.moon.illumination} waxing={d.moon.waxing} size={26} />
            <span className={`text-[10px] ${i === 0 ? "font-semibold text-white" : "text-white/60"}`}>
              {formatShortDate(d.date)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
