/**
 * components/HourlyChart.tsx
 * -----------------------------------------------------------------------
 * ฟีเจอร์ 5: Interactive Hourly Chart (เปลี่ยนจาก div.hour-bar เดิมมาใช้ Recharts)
 * แสดงโอกาสฝนรายชั่วโมงของวันที่เลือก พร้อม tooltip แบบ interactive
 * -----------------------------------------------------------------------
 */
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { WeatherDay } from "../types/weather";

interface Props {
  day: WeatherDay;
}

export default function HourlyChart({ day }: Props) {
  const data = day.hourlyPop.map((pop, hour) => ({
    hour: `${String(hour).padStart(2, "0")}:00`,
    pop,
  }));

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="popFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2E6E8E" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#2E6E8E" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E6F1F6" />
          <XAxis dataKey="hour" interval={2} tick={{ fontSize: 11 }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" width={36} />
          <Tooltip
            formatter={(value: number) => [`${value}%`, "โอกาสฝน"]}
            labelFormatter={(label) => `เวลา ${label}`}
          />
          <Area type="monotone" dataKey="pop" stroke="#2E6E8E" fill="url(#popFill)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
