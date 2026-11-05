/**
 * components/ProvinceAutocomplete.tsx
 * -----------------------------------------------------------------------
 * ฟีเจอร์ 6: Auto-complete & Region Filter
 * ใช้ useDebounce หน่วงการกรองตอนพิมพ์ + ปุ่มแท็กกรองแยกตามภาค
 * -----------------------------------------------------------------------
 */
import { useMemo, useState } from "react";
import { PROVINCES, REGION_LABEL } from "../services/provinces";
import type { Region } from "../types/weather";
import { useDebounce } from "../hooks/useDebounce";

interface Props {
  onSelect: (provinceName: string) => void;
}

const REGIONS: Region[] = ["north", "northeast", "central", "west", "east", "south"];

export default function ProvinceAutocomplete({ onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [activeRegion, setActiveRegion] = useState<Region | null>(null);
  const debouncedQuery = useDebounce(query, 250);

  const matches = useMemo(() => {
    return PROVINCES.filter((p) => {
      const matchesQuery = !debouncedQuery || p.name.includes(debouncedQuery);
      const matchesRegion = !activeRegion || p.region === activeRegion;
      return matchesQuery && matchesRegion;
    }).slice(0, 10);
  }, [debouncedQuery, activeRegion]);

  return (
    <div className="space-y-2">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="พิมพ์ชื่อจังหวัด เช่น เชียงใหม่"
        className="w-full rounded-full border border-line px-4 py-2 text-sm outline-none focus:border-sky"
      />

      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => setActiveRegion(null)}
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            activeRegion === null ? "bg-sky text-white" : "bg-chip-bg text-ink/70"
          }`}
        >
          ทั้งหมด
        </button>
        {REGIONS.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setActiveRegion(r)}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              activeRegion === r ? "bg-sky text-white" : "bg-chip-bg text-ink/70"
            }`}
          >
            {REGION_LABEL[r]}
          </button>
        ))}
      </div>

      <ul className="max-h-56 overflow-y-auto rounded-xl border border-line">
        {matches.length === 0 && (
          <li className="px-3 py-2 text-sm text-muted">ไม่พบจังหวัดที่ตรงกัน</li>
        )}
        {matches.map((p) => (
          <li key={p.name}>
            <button
              type="button"
              onClick={() => onSelect(p.name)}
              className="w-full px-3 py-2 text-left text-sm hover:bg-sky-soft"
            >
              {p.name} <span className="text-xs text-muted">· {REGION_LABEL[p.region]}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
