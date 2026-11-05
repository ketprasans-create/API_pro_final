/**
 * components/DayDetailModal.tsx
 * -----------------------------------------------------------------------
 * Pop up สรุปสภาพอากาศแบบย่อของวันที่เลือก + ปุ่ม "บันทึกวันเดินทาง"
 * ตามกฎล็อกวัน: ถ้าวันนั้นอยู่ก่อนวันที่บันทึกล่าสุด ปุ่มจะ disabled
 * และแสดง "ถูกล็อก (ผ่านวันไปแล้ว)" ถ้าบันทึกไว้แล้วแสดง "บันทึกแล้ว"
 * ปิดได้ด้วยปุ่ม X, กด Esc, หรือคลิกพื้นหลัง
 * -----------------------------------------------------------------------
 */
import { useEffect, useRef } from "react";
import type { WeatherDay } from "../types/weather";
import { formatLongDate, formatShortDate, type DayStatus } from "../services/tripRules";
import { weatherCodeLabel } from "../services/weatherApi";
import { CheckIcon, CloseIcon, DropletIcon, LockIcon, SunIcon, WindIcon, weatherIconFor } from "./icons";

interface Props {
  day: WeatherDay;
  province: string;
  status: DayStatus;
  latestSavedDate: string | null;
  onSave: () => void;
  onClose: () => void;
  onViewTrips: () => void;
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-chip-bg px-3 py-2.5 text-center">
      <div className="flex justify-center text-orange">{icon}</div>
      <p className="mt-1 text-sm font-semibold text-ink">{value}</p>
      <p className="text-[11px] text-muted">{label}</p>
    </div>
  );
}

export default function DayDetailModal({ day, province, status, latestSavedDate, onSave, onClose, onViewTrips }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose; // ใช้ ref เพื่อไม่ให้ effect ด้านล่างรันซ้ำทุกครั้งที่ parent render (กันโฟกัสหลุดหลังกดบันทึก)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden"; // กันหน้าเว็บด้านหลังเลื่อนตอนเปิด pop up
    panelRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const Icon = weatherIconFor(day.weatherCode);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose(); // คลิกพื้นหลังเท่านั้น (ไม่ใช่ตัวกล่อง)
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="day-modal-title"
        tabIndex={-1}
        className="w-full max-w-sm rounded-3xl bg-surface p-6 shadow-xl outline-none"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id="day-modal-title" className="text-base font-semibold text-ink">
              {formatLongDate(day.date)}
            </h2>
            <p className="text-sm text-muted">{province}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="ปิด"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-chip-bg text-ink hover:bg-line"
          >
            <CloseIcon width={16} height={16} />
          </button>
        </div>

        <div className="mt-5 flex items-center gap-4">
          <Icon className="text-orange" width={44} height={44} />
          <div>
            <p className="text-sm text-ink/70">{weatherCodeLabel(day.weatherCode)}</p>
            <p className="text-3xl font-semibold text-ink">
              {day.tempMax}°<span className="text-xl text-muted"> / {day.tempMin}°</span>
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <Stat icon={<DropletIcon width={18} height={18} />} label="โอกาสฝน" value={`${day.pop}%`} />
          <Stat icon={<SunIcon width={18} height={18} />} label="ดัชนี UV" value={String(day.uvIndexMax)} />
          <Stat icon={<WindIcon width={18} height={18} />} label="ลมสูงสุด" value={`${day.windMax} กม./ชม.`} />
        </div>

        <p className="mt-4 min-h-[2.5rem] text-xs text-muted" role="status" aria-live="polite">
          {status === "available" && "เมื่อบันทึกแล้ว วันก่อนหน้านี้จะถูกล็อก เลือกย้อนหลังไม่ได้"}
          {status === "saved" && "บันทึกวันนี้ไว้ในวันเดินทางของคุณแล้ว"}
          {status === "locked" &&
            `เลือกย้อนหลังไม่ได้ — คุณบันทึกวันที่ ${latestSavedDate ? formatShortDate(latestSavedDate) : ""} ไปแล้ว ถ้าต้องการเริ่มใหม่ให้รีเซ็ตทริปในหน้าวันเดินทางที่บันทึก`}
        </p>

        <button
          type="button"
          disabled={status !== "available"}
          onClick={onSave}
          className={`mt-2 flex w-full items-center justify-center gap-1.5 rounded-full px-4 py-3 text-sm font-semibold transition-colors ${
            status === "available"
              ? "bg-orange text-white hover:brightness-105"
              : status === "saved"
                ? "cursor-default bg-orange-soft text-ink"
                : "cursor-not-allowed bg-line text-ink/70"
          }`}
        >
          {status === "available" && "บันทึกวันเดินทาง"}
          {status === "saved" && (
            <>
              <CheckIcon width={16} height={16} />
              บันทึกแล้ว
            </>
          )}
          {status === "locked" && (
            <>
              <LockIcon width={16} height={16} />
              ถูกล็อก (ผ่านวันไปแล้ว)
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onViewTrips}
          className="mt-3 w-full text-center text-sm font-medium text-ink/70 underline-offset-2 hover:underline"
        >
          ดูวันเดินทางที่บันทึก
        </button>
      </div>
    </div>
  );
}
