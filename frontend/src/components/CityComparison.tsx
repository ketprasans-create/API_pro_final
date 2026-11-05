/**
 * components/CityComparison.tsx
 * -----------------------------------------------------------------------
 * ฟีเจอร์ 3: City Comparison Tool
 * เลือก 2 จังหวัด แล้วดึงอากาศทั้งคู่พร้อมกันด้วย Promise.all (เร็วกว่า
 * fetch ทีละตัวตามลำดับ) แสดงผลแบบ side-by-side
 * -----------------------------------------------------------------------
 */
import { useState } from "react";
import { PROVINCES, getProvince } from "../services/provinces";
import { fetchWeatherBundle } from "../services/weatherApi";
import type { WeatherBundle } from "../types/weather";
import ActivityBadge from "./ActivityBadge";

export default function CityComparison() {
  const [left, setLeft] = useState(PROVINCES[0].name);
  const [right, setRight] = useState(PROVINCES[19].name); // เชียงใหม่ โดยประมาณ ไว้เป็นค่าเริ่มต้นที่ต่างจาก left
  const [results, setResults] = useState<[WeatherBundle, WeatherBundle] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function compare() {
    const leftCoords = getProvince(left);
    const rightCoords = getProvince(right);
    if (!leftCoords || !rightCoords) return;

    setLoading(true);
    setError(null);
    try {
      // ดึงอากาศทั้งสองจังหวัดพร้อมกัน แทนที่จะ await ทีละตัว
      const [a, b] = await Promise.all([
        fetchWeatherBundle(left, leftCoords),
        fetchWeatherBundle(right, rightCoords),
      ]);
      setResults([a, b]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "เปรียบเทียบไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-line bg-surface p-4 space-y-3">
      <h3 className="text-sm font-semibold">เปรียบเทียบจังหวัด</h3>

      <div className="flex items-center gap-2">
        <select value={left} onChange={(e) => setLeft(e.target.value)} className="flex-1 rounded-lg border border-line bg-surface px-2 py-1 text-sm text-ink">
          {PROVINCES.map((p) => (
            <option key={p.name} value={p.name}>{p.name}</option>
          ))}
        </select>
        <span className="text-xs text-muted">เทียบกับ</span>
        <select value={right} onChange={(e) => setRight(e.target.value)} className="flex-1 rounded-lg border border-line bg-surface px-2 py-1 text-sm text-ink">
          {PROVINCES.map((p) => (
            <option key={p.name} value={p.name}>{p.name}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={compare}
          disabled={loading || left === right}
          className="rounded-lg bg-sky px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading ? "กำลังโหลด..." : "เปรียบเทียบ"}
        </button>
      </div>

      {left === right && <p className="text-xs text-amber-600">เลือกจังหวัดให้ต่างกัน 2 จังหวัด</p>}
      {error && <p className="text-xs text-coral">{error}</p>}

      {results && (
        <div className="grid grid-cols-2 gap-3">
          {results.map((r) => {
            const today = r.days[0];
            return (
              <div key={r.province} className="rounded-xl bg-sky-soft p-3">
                <p className="text-sm font-semibold">{r.province}</p>
                <p className="text-2xl font-bold">{r.current.temperature}°</p>
                <p className="text-xs text-ink/70">โอกาสฝน {today.pop}% · UV {today.uvIndexMax}</p>
                <div className="mt-2">
                  <ActivityBadge pop={today.pop} uvIndexMax={today.uvIndexMax} tempMax={today.tempMax} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
