/**
 * components/TripRangePicker.tsx
 * -----------------------------------------------------------------------
 * ฟีเจอร์ 7: Multi-day Trip Range Picker + Sequential Lock Rule
 * ใช้ bestTripWindow() หา "ช่วง N วันติดกัน" ที่ pop รวมน้อยที่สุด (Trip Score)
 * และใช้ useTripRangePicker คุม validation ห้ามบันทึกวันย้อนหลัง
 * -----------------------------------------------------------------------
 */
import { useMemo, useState } from "react";
import type { WeatherDay } from "../types/weather";
import { bestTripWindow } from "../services/sorter";
import { useTripRangePicker } from "../hooks/useTripRangePicker";

interface Props {
  province: string;
  days: WeatherDay[];
}

export default function TripRangePicker({ province, days }: Props) {
  const [tripLength, setTripLength] = useState(2); // ค่าเริ่มต้น: ทริป 2 วัน 1 คืน
  const { savedDates, minAllowedDate, isDateDisabled, trySaveDate } = useTripRangePicker();
  const [notice, setNotice] = useState<string | null>(null);

  const best = useMemo(() => bestTripWindow(days, tripLength), [days, tripLength]);
  const bestDays = best ? days.slice(best.startIndex, best.startIndex + best.length) : [];

  function handleSave(date: string) {
    const result = trySaveDate({ province, date });
    setNotice(result.ok ? `บันทึกวันที่ ${date} แล้ว` : result.reason ?? "บันทึกไม่สำเร็จ");
  }

  return (
    <section className="rounded-2xl border border-line bg-surface p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">วางแผนทริป (Trip Score)</h3>
        <select
          value={tripLength}
          onChange={(e) => setTripLength(Number(e.target.value))}
          className="rounded-lg border border-line px-2 py-1 text-xs"
        >
          {[1, 2, 3, 4].map((n) => (
            <option key={n} value={n}>
              {n} วัน{n > 1 ? ` ${n - 1} คืน` : ""}
            </option>
          ))}
        </select>
      </div>

      {best ? (
        <div className="rounded-xl bg-sky-soft p-3 text-sm">
          <p className="font-medium text-sky">
            ช่วงแนะนำ: {bestDays[0]?.date} – {bestDays[bestDays.length - 1]?.date}
          </p>
          <p className="text-xs text-ink/70">
            โอกาสฝนรวม {best.totalPop}% (เฉลี่ย {best.avgPop.toFixed(1)}% / วัน)
          </p>
        </div>
      ) : (
        <p className="text-xs text-muted">ไม่มีช่วงวันที่ยาวพอในพยากรณ์ 7 วันนี้</p>
      )}

      <div className="flex flex-wrap gap-2">
        {days.map((d) => {
          const disabled = isDateDisabled(d.date);
          return (
            <button
              key={d.date}
              type="button"
              disabled={disabled}
              onClick={() => handleSave(d.date)}
              title={disabled ? `เลือกย้อนหลังไม่ได้ (ต้องตั้งแต่ ${minAllowedDate})` : undefined}
              className={`rounded-lg border px-2 py-1 text-xs ${
                disabled
                  ? "cursor-not-allowed border-line text-muted"
                  : "border-line hover:border-sky hover:text-sky"
              }`}
            >
              {d.date.slice(5)}
            </button>
          );
        })}
      </div>

      {notice && <p className="text-xs text-ink/70">{notice}</p>}

      {savedDates.length > 0 && (
        <ul className="space-y-1 border-t border-line pt-2 text-xs text-ink/70">
          {savedDates.map((d, i) => (
            <li key={`${d.province}-${d.date}`}>
              #{i + 1} {d.province} — {d.date}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
