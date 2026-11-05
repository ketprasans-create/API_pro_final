/**
 * components/right/CitySummary.tsx
 * -----------------------------------------------------------------------
 * หัวแผงขวา: ชื่อจังหวัด + อุณหภูมิรวมตัวใหญ่ (ตรงกับ "Sun / Banten / 22°C" ในภาพ)
 * -----------------------------------------------------------------------
 */
interface Props {
  province: string;
  temperature: number;
}

export default function CitySummary({ province, temperature }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs text-ink/60">วันนี้</p>
        <p className="text-sm font-medium text-ink">{province}</p>
      </div>
      <p className="text-3xl font-semibold text-ink">{temperature}°C</p>
    </div>
  );
}
