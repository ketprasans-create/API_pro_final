/**
 * components/SettingsPage.tsx
 * -----------------------------------------------------------------------
 * หน้าตั้งค่า (เปิดจากไอคอนเฟืองใน Sidebar หรือ #/settings)
 *   1) โหมดการแสดงผล: สว่าง / มืด (มีผลทันทีและจำไว้ในเบราว์เซอร์)
 *   2) เลือกว่าจะให้หน้าหลักแสดงอะไรบ้าง เปิด/ปิดทีละการ์ด หรือใช้ชุดสำเร็จรูป
 * รายการ Weather Prediction และการบันทึกวันเดินทางแสดงเสมอ ไม่อยู่ในรายการที่ปิดได้
 * -----------------------------------------------------------------------
 */
import type { Route } from "../hooks/useHashRoute";
import {
  ALL_WIDGETS_ON,
  WEATHER_AND_UV_ONLY,
  WIDGETS,
  useSettingsStore,
  type Theme,
  type WidgetVisibility,
} from "../hooks/useSettingsStore";
import Sidebar from "./layout/Sidebar";
import { CheckIcon, ChevronRightIcon, MoonIcon, SunIcon } from "./icons";

interface Props {
  route: Route;
  onNavigate: (route: Route) => void;
}

const THEMES: { value: Theme; label: string; description: string; icon: typeof SunIcon }[] = [
  { value: "light", label: "โหมดสว่าง", description: "พื้นหลังสว่าง อ่านง่ายตอนกลางวัน", icon: SunIcon },
  { value: "dark", label: "โหมดมืด", description: "พื้นหลังมืด สบายตาตอนกลางคืน", icon: MoonIcon },
];

const GROUPS: { id: "main" | "side"; title: string }[] = [
  { id: "main", title: "การ์ดบนหน้าหลัก" },
  { id: "side", title: "แผงด้านขวา" },
];

function sameVisibility(a: WidgetVisibility, b: WidgetVisibility) {
  return WIDGETS.every((w) => a[w.key] === b[w.key]);
}

function Switch({ checked, label, onChange }: { checked: boolean; label: string; onChange: (next: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-orange" : "bg-line"}`}
    >
      <span
        className={`absolute left-0 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-[22px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

export default function SettingsPage({ route, onNavigate }: Props) {
  const theme = useSettingsStore((s) => s.theme);
  const widgets = useSettingsStore((s) => s.widgets);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const setWidget = useSettingsStore((s) => s.setWidget);
  const setAllWidgets = useSettingsStore((s) => s.setAllWidgets);

  const onCount = WIDGETS.filter((w) => widgets[w.key]).length;
  const presetAll = sameVisibility(widgets, ALL_WIDGETS_ON);
  const presetSimple = sameVisibility(widgets, WEATHER_AND_UV_ONLY);

  return (
    <div className="flex min-h-screen bg-page">
      <Sidebar route={route} onNavigate={onNavigate} />

      <main className="flex-1 space-y-6 px-5 py-6 md:px-8">
        <button
          type="button"
          onClick={() => onNavigate("dashboard")}
          className="flex items-center gap-1 text-sm font-medium text-ink/70 hover:text-ink"
        >
          <ChevronRightIcon className="rotate-180" width={16} height={16} />
          กลับหน้าแรก
        </button>

        <header>
          <h1 className="text-xl font-semibold text-ink">ตั้งค่า</h1>
          <p className="mt-0.5 text-sm text-muted">ปรับโหมดการแสดงผลและเลือกสิ่งที่ต้องการให้แสดงบนหน้าหลัก</p>
        </header>

        {/* ---------- โหมดการแสดงผล ---------- */}
        <section className="rounded-3xl border border-line bg-surface p-5">
          <h2 id="theme-title" className="text-base font-semibold text-ink">
            โหมดการแสดงผล
          </h2>
          <div role="radiogroup" aria-labelledby="theme-title" className="mt-4 grid gap-3 sm:grid-cols-2">
            {THEMES.map(({ value, label, description, icon: Icon }) => {
              const selected = theme === value;
              return (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setTheme(value)}
                  className={`flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-colors ${
                    selected ? "border-orange bg-orange-soft" : "border-line hover:bg-surface-2"
                  }`}
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-chip-bg text-orange">
                    <Icon width={22} height={22} />
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-semibold text-ink">{label}</span>
                    <span className="block text-xs text-muted">{description}</span>
                  </span>
                  {selected && <CheckIcon className="shrink-0 text-orange" width={20} height={20} />}
                </button>
              );
            })}
          </div>
        </section>

        {/* ---------- เลือกสิ่งที่แสดงบนหน้าหลัก ---------- */}
        <section className="rounded-3xl border border-line bg-surface p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-ink">สิ่งที่แสดงบนหน้าหลัก</h2>
              <p className="mt-0.5 text-sm text-muted" role="status" aria-live="polite">
                แสดงอยู่ {onCount} จาก {WIDGETS.length} รายการ
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setAllWidgets(ALL_WIDGETS_ON)}
                aria-pressed={presetAll}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  presetAll ? "border-orange bg-orange-soft text-ink" : "border-line text-ink hover:bg-surface-2"
                }`}
              >
                แสดงทั้งหมด
              </button>
              <button
                type="button"
                onClick={() => setAllWidgets(WEATHER_AND_UV_ONLY)}
                aria-pressed={presetSimple}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  presetSimple ? "border-orange bg-orange-soft text-ink" : "border-line text-ink hover:bg-surface-2"
                }`}
              >
                เฉพาะสภาพอากาศและ UV
              </button>
            </div>
          </div>

          {GROUPS.map((group) => (
            <div key={group.id} className="mt-5">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">{group.title}</h3>
              <ul className="mt-2 divide-y divide-line">
                {WIDGETS.filter((w) => w.group === group.id).map((w) => (
                  <li key={w.key} className="flex items-center justify-between gap-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-ink">{w.label}</p>
                      <p className="text-xs text-muted">{w.description}</p>
                    </div>
                    <Switch checked={widgets[w.key]} label={w.label} onChange={(next) => setWidget(w.key, next)} />
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <p className="mt-5 rounded-2xl bg-chip-bg px-4 py-3 text-xs text-muted">
            รายการ Weather Prediction และการบันทึกวันเดินทางแสดงอยู่เสมอ ไม่สามารถปิดได้
          </p>
        </section>
      </main>
    </div>
  );
}
