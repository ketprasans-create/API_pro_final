import { useEffect, useState } from "react";
import WeatherDashboardV2 from "./components/WeatherDashboardV2";
import TripsPage from "./components/TripsPage";
import SettingsPage from "./components/SettingsPage";
import { useHashRoute } from "./hooks/useHashRoute";
import { useSettingsStore } from "./hooks/useSettingsStore";
import { PROVINCES } from "./services/provinces";

export default function App() {
  const [route, navigate] = useHashRoute();
  // เก็บจังหวัดที่เลือกไว้ที่ระดับ App เพื่อไม่ให้กลับไปเป็นกรุงเทพฯ ทุกครั้งที่สลับหน้า
  const [selectedProvince, setSelectedProvince] = useState(PROVINCES[0].name);
  const theme = useSettingsStore((s) => s.theme);

  // โหมดมืด = ใส่คลาส "dark" ที่ <html> (สีทั้งแอปอ่านจากตัวแปร CSS ใน index.css)
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route]);

  if (route === "trips") return <TripsPage route={route} onNavigate={navigate} />;
  if (route === "settings") return <SettingsPage route={route} onNavigate={navigate} />;

  return (
    <WeatherDashboardV2
      route={route}
      onNavigate={navigate}
      selectedProvince={selectedProvince}
      onSelectProvince={setSelectedProvince}
    />
  );
}
