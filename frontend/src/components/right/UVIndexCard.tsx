/**
 * components/right/UVIndexCard.tsx
 * -----------------------------------------------------------------------
 * การ์ดพื้นเข้ม แสดงค่า UV Index ของวันนี้ + ป้ายระดับความเสี่ยง
 * -----------------------------------------------------------------------
 */
import { SunIcon } from "../icons";

interface Props {
  uvIndexMax: number;
}

function uvCategory(uv: number): { label: string; risk: string } {
  if (uv <= 2) return { label: "Low", risk: "ความเสี่ยงต่ำจากรังสี UV" };
  if (uv <= 5) return { label: "Moderate", risk: "ความเสี่ยงปานกลางจากรังสี UV" };
  if (uv <= 7) return { label: "High", risk: "ความเสี่ยงสูงจากรังสี UV" };
  if (uv <= 10) return { label: "Very High", risk: "ความเสี่ยงสูงมากจากรังสี UV" };
  return { label: "Extreme", risk: "ความเสี่ยงรุนแรงจากรังสี UV" };
}

export default function UVIndexCard({ uvIndexMax }: Props) {
  const { label, risk } = uvCategory(uvIndexMax);

  return (
    <section className="rounded-2xl bg-navy p-4 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SunIcon className="text-orange" width={18} height={18} />
          <span className="text-sm font-semibold">{uvIndexMax} UVI</span>
        </div>
        <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-medium text-orange">
          {label}
        </span>
      </div>
      <p className="mt-1.5 text-xs text-white/60">{risk}</p>
    </section>
  );
}
