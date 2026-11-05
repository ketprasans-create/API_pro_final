/** @type {import('tailwindcss').Config} */

// สีหลักของแอปอ่านจากตัวแปร CSS ใน src/index.css (โหมดสว่างอยู่ที่ :root, โหมดมืดอยู่ที่ .dark)
// เขียนเป็น rgb(var(--c-xxx) / <alpha-value>) เพื่อให้ตัวปรับความโปร่งใส เช่น bg-surface/70 ยังใช้ได้
const v = (name) => `rgb(var(--c-${name}) / <alpha-value>)`;

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sky: v("sky"),
        "sky-soft": v("sky-soft"),
        marigold: "#F4B942",
        coral: "#F2703C",

        page: v("page"), // พื้นหลังหน้า
        surface: v("surface"), // พื้นการ์ด/แผงสีขาว (โหมดมืดเป็นเทาเข้ม)
        "surface-2": v("surface-2"),
        line: v("line"), // เส้นขอบ
        ink: v("ink"), // ตัวอักษรหลัก
        muted: v("muted"), // ตัวอักษรรอง
        orange: "#F6A542", // สีเน้น (ใช้เหมือนกันทั้งสองโหมด)
        "orange-soft": v("orange-soft"),
        teal: v("teal"), // แผงขวา
        navy: v("navy"), // การ์ด UV
        "chip-bg": v("chip"),
      },
      backgroundImage: {
        "weather-card": "linear-gradient(135deg, rgb(var(--weather-from)) 0%, rgb(var(--weather-to)) 100%)",
        "air-card": "linear-gradient(135deg, rgb(var(--air-from)) 0%, rgb(var(--air-to)) 100%)",
        "tomorrow-card": "linear-gradient(160deg, #2F6B55 0%, #1F4A3A 100%)",
      },
      keyframes: {
        "alert-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
      animation: {
        "alert-pulse": "alert-pulse 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
