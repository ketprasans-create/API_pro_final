/**
 * components/MoonDisc.tsx
 * -----------------------------------------------------------------------
 * วาดดวงจันทร์ตามเฟสด้วย SVG (ไม่ใช้รูปภาพ) ใช้ได้ทุกขนาด
 *
 * ส่วนที่สว่าง = ขอบนอกครึ่งวงกลม (ด้านขวาเมื่อข้างขึ้น / ด้านซ้ายเมื่อข้างแรม ตามที่เห็นในซีกโลกเหนือ
 * ซึ่งรวมประเทศไทย) + เส้นแบ่งแสงเงา (terminator) ที่เป็นครึ่งวงรี รัศมีแนวนอน = r * |1 - 2k|
 * เมื่อ k คือสัดส่วนที่สว่าง: k < 0.5 ได้เสี้ยว (เส้นแบ่งโค้งเข้าหาด้านสว่าง) / k > 0.5 ได้ค่อนดวง
 * -----------------------------------------------------------------------
 */
interface Props {
  illumination: number; // 0-100
  waxing: boolean;
  size?: number;
  className?: string;
}

// path ของส่วนที่สว่าง (คืน null ถ้าเป็นวันดับ ไม่ต้องวาดส่วนสว่าง)
export function moonLitPath(illumination: number, waxing: boolean, r = 44, cx = 50, cy = 50): string | null {
  const k = Math.min(1, Math.max(0, illumination / 100));
  if (k < 0.005) return null;

  const rx = r * Math.abs(1 - 2 * k);
  const top = `${cx} ${cy - r}`;
  const bottom = `${cx} ${cy + r}`;
  const crescent = k < 0.5;

  if (waxing) {
    // ขอบนอกด้านขวา (บน -> ล่าง ตามเข็มนาฬิกา) แล้วย้อนกลับตามเส้นแบ่งแสงเงา (ล่าง -> บน)
    return `M ${top} A ${r} ${r} 0 0 1 ${bottom} A ${rx} ${r} 0 0 ${crescent ? 0 : 1} ${top} Z`;
  }
  // ข้างแรม: ขอบนอกด้านซ้าย (บน -> ล่าง ทวนเข็ม)
  return `M ${top} A ${r} ${r} 0 0 0 ${bottom} A ${rx} ${r} 0 0 ${crescent ? 1 : 0} ${top} Z`;
}

export default function MoonDisc({ illumination, waxing, size = 96, className }: Props) {
  const path = moonLitPath(illumination, waxing);
  const full = illumination >= 99.5;

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={`ดวงจันทร์สว่าง ${Math.round(illumination)}%`}
    >
      <circle cx="50" cy="50" r="44" fill="#2A3547" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
      {full ? (
        <circle data-testid="moon-lit" cx="50" cy="50" r="44" fill="#F4E4B0" />
      ) : (
        path && <path data-testid="moon-lit" d={path} fill="#F4E4B0" />
      )}
    </svg>
  );
}
