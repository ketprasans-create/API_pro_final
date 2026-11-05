/**
 * components/layout/TopHeader.tsx
 * -----------------------------------------------------------------------
 * ส่วนหัวของ main content: คำทักทาย + ช่องค้นหาจังหวัดทรงแคปซูล + กระดิ่งแจ้งเตือน
 * ใช้ตรรกะกรองจังหวัดแบบเดียวกับ ProvinceAutocomplete (feature 6 เดิม) แต่ย่อ
 * ให้เป็น dropdown เล็กในทรงแคปซูลให้ตรงกับภาพตัวอย่าง
 * -----------------------------------------------------------------------
 */
import { useMemo, useState } from "react";
import { PROVINCES } from "../../services/provinces";
import { useDebounce } from "../../hooks/useDebounce";
import { BellIcon, SearchIcon } from "../icons";

interface Props {
  greetingName: string;
  onSelectProvince: (name: string) => void;
}

export default function TopHeader({ greetingName, onSelectProvince }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const debounced = useDebounce(query, 200);

  // ยังไม่พิมพ์อะไร -> โชว์ 8 จังหวัดแรกให้เลือกได้เลย (กันปัญหาคลิกแล้วไม่มีอะไรขึ้น)
  const matches = useMemo(
    () =>
      debounced
        ? PROVINCES.filter((p) => p.name.includes(debounced)).slice(0, 6)
        : PROVINCES.slice(0, 8),
    [debounced]
  );

  function select(name: string) {
    onSelectProvince(name);
    setQuery("");
    setOpen(false);
  }

  return (
    <header className="flex items-center justify-between gap-4">
      <div>
        <p className="text-xs text-muted">สวัสดี,</p>
        <h1 className="text-xl font-semibold text-ink">{greetingName}</h1>
      </div>

      <div className="relative flex-1 max-w-sm">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" width={16} height={16} />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          placeholder="ค้นหาจังหวัด..."
          className="w-full rounded-full bg-chip-bg py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-muted outline-none focus:ring-2 focus:ring-orange/40"
        />
        {open && (
          <ul className="absolute z-20 mt-2 max-h-72 w-full overflow-y-auto rounded-2xl border border-line bg-surface shadow-lg">
            {matches.length === 0 && (
              <li className="px-4 py-2 text-sm text-muted">ไม่พบจังหวัดที่ตรงกัน</li>
            )}
            {matches.map((p) => (
              <li key={p.name}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => select(p.name)}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-chip-bg"
                >
                  {p.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        type="button"
        aria-label="การแจ้งเตือน"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-chip-bg text-ink"
      >
        <BellIcon width={18} height={18} />
      </button>
    </header>
  );
}
