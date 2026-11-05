import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./index.css";

// feature 9: TanStack Query จัดการ fetch/cache/loading/error ของ Open-Meteo ให้ทั้งแอป
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // ข้อมูลอากาศถือว่ายังสดอยู่ 5 นาที ไม่ fetch ซ้ำถ้าไม่จำเป็น
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
