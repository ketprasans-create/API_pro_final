/**
 * components/right/SunArcChart.tsx
 * -----------------------------------------------------------------------
 * แผนภูมิโค้งแสดงเวลา Sunset / Sunrise (เส้นประโค้ง + จุด 2 ฝั่ง) ตามภาพตัวอย่าง
 * วาดเองด้วย SVG path ธรรมดา ไม่ต้องพึ่งไลบรารีกราฟเพิ่ม
 * -----------------------------------------------------------------------
 */
interface Props {
  sunrise: string;
  sunset: string;
}

export default function SunArcChart({ sunrise, sunset }: Props) {
  return (
    <div className="px-1">
      <svg viewBox="0 0 280 72" className="w-full text-ink/40">
        <path d="M14 58 Q140 -6 266 58" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 5" />
        <circle cx="140" cy="16" r="5" className="fill-orange" />
        <circle cx="14" cy="58" r="4.5" className="fill-ink" />
        <circle cx="266" cy="58" r="4.5" className="fill-ink" />
      </svg>

      <div className="-mt-1 flex justify-between text-xs">
        <div>
          <p className="text-ink/60">Sunset</p>
          <p className="font-semibold text-ink">{sunset}</p>
        </div>
        <div className="text-right">
          <p className="text-ink/60">Sunrise</p>
          <p className="font-semibold text-ink">{sunrise}</p>
        </div>
      </div>
    </div>
  );
}
