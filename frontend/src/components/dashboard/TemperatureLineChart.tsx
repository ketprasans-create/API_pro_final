/**
 * components/dashboard/TemperatureLineChart.tsx
 * -----------------------------------------------------------------------
 * "How's the temperature today?" — กราฟเส้นอุณหภูมิ 4 จุดของวันนี้
 * (Morning/Afternoon/Evening/Night) ใช้ Recharts เหมือน HourlyChart เดิม
 * พร้อมไอคอนสภาพอากาศเหนือแต่ละจุด (อ้างอิงภาพตัวอย่าง)
 * -----------------------------------------------------------------------
 */
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { HourlyTempPoint } from "../../types/weather";
import { weatherIconFor } from "../icons";

interface Props {
  points: HourlyTempPoint[];
}

// จุดบนกราฟ: วงกลมส้ม + ไอคอนสภาพอากาศลอยอยู่เหนือจุด
function CustomDot({ cx, cy, payload }: { cx?: number; cy?: number; payload?: HourlyTempPoint }) {
  if (cx === undefined || cy === undefined || !payload) return null;
  const Icon = weatherIconFor(payload.weatherCode);
  return (
    <g>
      <foreignObject x={cx - 10} y={cy - 34} width={20} height={20}>
        <Icon className="text-orange" width={20} height={20} />
      </foreignObject>
      <circle cx={cx} cy={cy} r={4.5} fill="#F6A542" stroke="white" strokeWidth={2} />
    </g>
  );
}

export default function TemperatureLineChart({ points }: Props) {
  return (
    <section className="rounded-3xl border border-line bg-surface p-5">
      <h2 className="text-base font-semibold text-ink">How's the temperature today?</h2>

      <div className="mt-2 h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={points} margin={{ top: 26, right: 16, left: 0, bottom: 0 }}>
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#8A93A6" }} />
            <YAxis hide domain={["dataMin - 4", "dataMax + 4"]} />
            <Tooltip
              formatter={(v: number) => [`${v}°`, "อุณหภูมิ"]}
              contentStyle={{
                background: "rgb(var(--c-surface))",
                border: "1px solid rgb(var(--c-line))",
                borderRadius: 12,
                color: "rgb(var(--c-ink))",
              }}
              labelStyle={{ color: "rgb(var(--c-ink))" }}
              itemStyle={{ color: "rgb(var(--c-ink))" }}
            />
            <Line
              type="monotone"
              dataKey="temp"
              stroke="#F6A542"
              strokeWidth={2.5}
              dot={<CustomDot />}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-1 grid grid-cols-4 text-center">
        {points.map((p) => (
          <div key={p.label}>
            <p className="text-sm font-semibold text-ink">{p.temp}°</p>
            <p className="text-[11px] text-muted">{p.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
