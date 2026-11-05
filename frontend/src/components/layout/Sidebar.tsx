/**
 * components/layout/Sidebar.tsx
 * -----------------------------------------------------------------------
 * แถบไอคอนนำทางด้านซ้าย มี 3 ปุ่ม: หน้าแรก / วันเดินทางที่บันทึก / ตั้งค่า
 * ไอคอนวันเดินทางมีเลขบอกจำนวนวันที่บันทึกไว้
 * -----------------------------------------------------------------------
 */
import type { Route } from "../../hooks/useHashRoute";
import { useTripStore } from "../../hooks/useTripStore";
import { DocumentIcon, HomeIcon, SettingsIcon } from "../icons";

interface Item {
  icon: typeof HomeIcon;
  label: string;
  route: Route;
}

const ITEMS: Item[] = [
  { icon: HomeIcon, label: "หน้าแรก", route: "dashboard" },
  { icon: DocumentIcon, label: "วันเดินทางที่บันทึก", route: "trips" },
  { icon: SettingsIcon, label: "ตั้งค่า", route: "settings" },
];

interface Props {
  route: Route;
  onNavigate: (route: Route) => void;
}

export default function Sidebar({ route, onNavigate }: Props) {
  const tripCount = useTripStore((s) => s.trips.length);

  return (
    <aside className="hidden md:flex w-20 shrink-0 flex-col items-center gap-8 bg-surface py-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange text-sm font-bold text-white">
        LF
      </div>

      <nav className="flex flex-col gap-3">
        {ITEMS.map(({ icon: Icon, label, route: target }) => {
          const active = target === route;
          return (
            <button
              key={label}
              type="button"
              title={label}
              aria-label={label}
              aria-current={active ? "page" : undefined}
              onClick={() => onNavigate(target)}
              className={`relative flex h-11 w-11 items-center justify-center rounded-2xl transition-colors ${
                active ? "bg-orange text-white" : "text-muted hover:bg-chip-bg hover:text-ink"
              }`}
            >
              <Icon width={19} height={19} />
              {target === "trips" && tripCount > 0 && (
                <span
                  data-testid="trip-count"
                  className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-[10px] font-semibold text-surface"
                >
                  {tripCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
