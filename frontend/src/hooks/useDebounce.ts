/**
 * hooks/useDebounce.ts
 * -----------------------------------------------------------------------
 * Generic debounce hook — ใช้กับช่องค้นหาจังหวัด (ฟีเจอร์ 6) เพื่อไม่ต้อง
 * กรองรายการทุกครั้งที่ผู้ใช้พิมพ์ทีละตัวอักษร (รอให้หยุดพิมพ์ก่อน)
 * -----------------------------------------------------------------------
 */
import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delayMs = 250): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
