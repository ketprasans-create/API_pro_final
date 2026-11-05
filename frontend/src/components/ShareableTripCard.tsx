/**
 * components/ShareableTripCard.tsx
 * -----------------------------------------------------------------------
 * ฟีเจอร์ 10: Shareable Trip Weather Card
 * การ์ดสรุปอากาศของจังหวัด+วันที่แนะนำ พร้อม "คัดลอกลิงก์" (ใส่ query param
 * ?province=...&date=... ไว้ในลิงก์ปัจจุบัน) และ "บันทึกเป็นรูปภาพ" ด้วย html2canvas
 * -----------------------------------------------------------------------
 */
import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import type { WeatherDay } from "../types/weather";
import { weatherCodeLabel } from "../services/weatherApi";
import { ImageIcon, LinkIcon } from "./icons";

interface Props {
  province: string;
  day: WeatherDay;
}

export default function ShareableTripCard({ province, day }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<string | null>(null);

  async function handleCopyLink() {
    const url = new URL(window.location.href);
    url.searchParams.set("province", province);
    url.searchParams.set("date", day.date);
    try {
      await navigator.clipboard.writeText(url.toString());
      setStatus("คัดลอกลิงก์แล้ว");
    } catch {
      setStatus("คัดลอกไม่สำเร็จ ลองคัดลอกเองจาก address bar");
    }
    setTimeout(() => setStatus(null), 2000);
  }

  async function handleSaveImage() {
    if (!cardRef.current) return;
    const canvas = await html2canvas(cardRef.current, { backgroundColor: "#ffffff", scale: 2 });
    const link = document.createElement("a");
    link.download = `lomfa-${province}-${day.date}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <section className="space-y-2">
      <div
        ref={cardRef}
        className="rounded-2xl bg-gradient-to-br from-sky to-sky-soft p-5 text-white"
      >
        <p className="text-xs opacity-80">แผนเที่ยว</p>
        <h3 className="text-xl font-bold">{province}</h3>
        <p className="text-sm opacity-90">{day.date} · {weatherCodeLabel(day.weatherCode)}</p>
        <div className="mt-3 flex items-end gap-4">
          <span className="text-4xl font-bold">{day.tempMax}°</span>
          <span className="text-sm opacity-90">โอกาสฝน {day.pop}% · UV {day.uvIndexMax}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleCopyLink}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-line px-3 py-2 text-xs font-medium hover:bg-surface-2"
        >
          <LinkIcon width={14} height={14} /> คัดลอกลิงก์
        </button>
        <button
          type="button"
          onClick={handleSaveImage}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-sky px-3 py-2 text-xs font-medium text-white hover:brightness-110"
        >
          <ImageIcon width={14} height={14} /> บันทึกเป็นรูปภาพ
        </button>
      </div>

      {status && <p className="text-xs text-ink/70">{status}</p>}
    </section>
  );
}
