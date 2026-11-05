/**
 * hooks/useGeolocation.ts
 * -----------------------------------------------------------------------
 * ฟีเจอร์ 1: Current Location Weather
 * ขอพิกัด GPS จากอุปกรณ์ผู้ใช้ผ่าน navigator.geolocation แล้วคืนสถานะ
 * loading / error / coords ให้ component เอาไปใช้ fetch อากาศต่อ
 * -----------------------------------------------------------------------
 */
import { useEffect, useState } from "react";
import type { Coordinates } from "../types/weather";

interface GeolocationState {
  coords: Coordinates | null;
  status: "idle" | "loading" | "success" | "error" | "unsupported";
  error: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    coords: null,
    status: "idle",
    error: null,
  });

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setState({ coords: null, status: "unsupported", error: "เบราว์เซอร์นี้ไม่รองรับ Geolocation" });
      return;
    }

    setState((s) => ({ ...s, status: "loading" }));

    const watcherId = navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          coords: { lat: pos.coords.latitude, lon: pos.coords.longitude },
          status: "success",
          error: null,
        });
      },
      (err) => {
        setState({ coords: null, status: "error", error: err.message });
      },
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 5 * 60 * 1000 }
    );

    return () => {
      // getCurrentPosition ไม่มี watchId ให้ clear (ต่างจาก watchPosition) จึงไม่ต้อง cleanup เพิ่ม
      void watcherId;
    };
  }, []);

  return state;
}
