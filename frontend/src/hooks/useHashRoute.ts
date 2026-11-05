/**
 * hooks/useHashRoute.ts
 * -----------------------------------------------------------------------
 * สลับหน้าด้วย hash ใน URL: #/ = หน้าแรก, #/trips = วันเดินทางที่บันทึก, #/settings = ตั้งค่า
 * ไม่ต้องติดตั้ง react-router: ปุ่มย้อนกลับของเบราว์เซอร์และการรีเฟรชหน้าใช้งานได้ตามปกติ
 * -----------------------------------------------------------------------
 */
import { useCallback, useEffect, useState } from "react";

export type Route = "dashboard" | "trips" | "settings";

const HASH_OF: Record<Route, string> = {
  dashboard: "#/",
  trips: "#/trips",
  settings: "#/settings",
};

function readRoute(): Route {
  const hash = window.location.hash;
  if (hash === HASH_OF.trips) return "trips";
  if (hash === HASH_OF.settings) return "settings";
  return "dashboard";
}

export function useHashRoute(): [Route, (route: Route) => void] {
  const [route, setRoute] = useState<Route>(readRoute);

  useEffect(() => {
    const onHashChange = () => setRoute(readRoute());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const navigate = useCallback((next: Route) => {
    window.location.hash = HASH_OF[next];
  }, []);

  return [route, navigate];
}
