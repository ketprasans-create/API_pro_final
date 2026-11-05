/**
 * components/dashboard/SeaLevelPressureCard.tsx
 * -----------------------------------------------------------------------
 * การ์ด Sea Level Pressure (ความกดอากาศที่ปรับเป็นระดับน้ำทะเล จาก Open-Meteo `pressure_msl`)
 * แสดงค่าปัจจุบัน ระดับ (ต่ำ/ปกติ/สูง) แนวโน้มไม่เกิน 3 ชั่วโมง และกราฟรายชั่วโมงของวันนี้
 * ถ้า API ไม่ส่งค่ามา จะแสดงข้อความแทน ไม่ทำให้หน้าพัง
 * -----------------------------------------------------------------------
 */
import type { SeaLevelPressure } from "../../types/weather";
import { ChevronRightIcon, GaugeIcon } from "../icons";

interface Props {
  data: SeaLevelPressure | null;
}

// เกณฑ์อ้างอิง: ความกดอากาศมาตรฐานที่ระดับน้ำทะเล = 1013.25 hPa, ปกติโดยทั่วไป 1009-1022 hPa
export function pressureLevel(hpa: number): { label: string; tone: string } {
  if (hpa < 1009) return { label: "ต่ำ", tone: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300" };
  if (hpa > 1022) return { label: "สูง", tone: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300" };
  return { label: "ปกติ", tone: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300" };
}

// แปลงค่ารายชั่วโมงเป็นจุดของเส้นกราฟ (SVG) สเกลตามค่าต่ำสุด-สูงสุดของวัน
export function sparklinePoints(values: number[], width: number, height: number, pad = 6): [number, number][] {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1; // ค่าคงที่ทั้งวัน -> เส้นตรงกลาง ไม่หารด้วยศูนย์
  return values.map((v, i) => [
    (i / (values.length - 1)) * width,
    max === min ? height / 2 : pad + (1 - (v - min) / span) * (height - pad * 2),
  ]);
}

function trendInfo(change: number | null, hours: number) {
  if (change === null) return null;
  if (change >= 1) return { text: `เพิ่มขึ้น ${change.toFixed(1)} hPa ใน ${hours} ชม.`, hint: "ความกดอากาศเพิ่มขึ้น มักหมายถึงอากาศแจ่มใสขึ้น", rotate: "-rotate-90" };
  if (change <= -1) return { text: `ลดลง ${Math.abs(change).toFixed(1)} hPa ใน ${hours} ชม.`, hint: "ความกดอากาศลดลง มักมาพร้อมเมฆและฝนที่เพิ่มขึ้น", rotate: "rotate-90" };
  return { text: `คงที่ ใน ${hours} ชม. ที่ผ่านมา`, hint: "ความกดอากาศนิ่ง อากาศมีแนวโน้มคงเดิมในช่วงนี้", rotate: "" };
}

const W = 240;
const H = 64;

export default function SeaLevelPressureCard({ data }: Props) {
  const level = data ? pressureLevel(data.current) : null;
  const trend = data ? trendInfo(data.trendChange, data.trendHours) : null;
  const points = data && data.hourly.length === 24 ? sparklinePoints(data.hourly, W, H) : null;
  const here = points ? points[data!.nowHour] : null;

  return (
    <section className="rounded-3xl border border-line bg-surface p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-ink/80">Sea Level Pressure</p>
          <p className="text-xs text-muted">ความกดอากาศระดับน้ำทะเล</p>
        </div>
        <GaugeIcon className="text-orange" width={28} height={28} />
      </div>

      {!data || !level ? (
        <p className="mt-6 text-sm text-muted">ไม่มีข้อมูลความกดอากาศสำหรับตำแหน่งนี้</p>
      ) : (
        <>
          <div className="mt-4 flex items-end gap-2">
            <span className="text-4xl font-semibold text-ink" data-testid="msl-value">
              {data.current.toFixed(1)}
            </span>
            <span className="mb-1 text-sm text-muted">hPa</span>
            <span className={`mb-1 ml-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${level.tone}`} data-testid="msl-level">
              {level.label}
            </span>
          </div>

          {trend && (
            <div className="mt-1 flex items-center gap-1.5 text-sm text-ink/80" data-testid="msl-trend">
              {trend.rotate !== "" ? (
                <ChevronRightIcon className={`${trend.rotate} text-orange`} width={16} height={16} />
              ) : (
                <span className="inline-block h-0.5 w-3 rounded bg-orange" />
              )}
              {trend.text}
            </div>
          )}
          {trend && <p className="mt-0.5 text-xs text-muted">{trend.hint}</p>}

          {points && (
            <div className="mt-4">
              <svg viewBox={`0 0 ${W} ${H}`} className="block h-16 w-full" role="img" aria-label="กราฟความกดอากาศรายชั่วโมงของวันนี้" preserveAspectRatio="none">
                <polyline
                  data-testid="msl-line"
                  points={points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ")}
                  fill="none"
                  stroke="#F6A542"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              {/* จุด "ตอนนี้" วางเป็น HTML ซ้อนบนกราฟ เพราะ preserveAspectRatio="none" จะบีบวงกลมใน SVG ให้เบี้ยว */}
              <div className="relative -mt-16 h-16 w-full">
                {here && (
                  <span
                    data-testid="msl-now"
                    className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface bg-orange"
                    style={{ left: `${(here[0] / W) * 100}%`, top: `${(here[1] / H) * 100}%` }}
                  />
                )}
              </div>
              <div className="flex justify-between text-[11px] text-muted">
                <span>00:00</span>
                <span>
                  วันนี้ต่ำสุด {data.min.toFixed(1)} · สูงสุด {data.max.toFixed(1)}
                </span>
                <span>23:00</span>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
