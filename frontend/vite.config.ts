import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // โหมดเริ่มต้น (ไม่ต้องตั้งค่าอะไร): ตอนพัฒนา ส่งคำขอ /api ต่อไปที่ backend พอร์ต 3000
    // ถ้าตั้ง VITE_API_BASE_URL ใน .env หน้าเว็บจะเรียก backend ตรงๆ และไม่ใช้ proxy นี้
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
