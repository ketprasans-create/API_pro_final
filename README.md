# ลมฟ้า — แยกหน้าบ้าน (React) กับหลังบ้าน (Express)

สองโปรเจกต์ มี `package.json` และ `node_modules` ของตัวเอง รันคนละเทอร์มินัล คนละพอร์ต

```
lomfa/
├─ backend/                 # Express API  -> http://localhost:3000
│  ├─ index.js              # routes + CORS
│  ├─ openMeteo.js          # เรียก Open-Meteo + แปลงข้อมูล
│  ├─ sorter.js             # Selection Sort หาวันฝนน้อยที่สุด
│  └─ package.json
└─ frontend/                # React + Vite -> http://localhost:5173
   ├─ src/                  # (โค้ด React เดิมทั้งหมด)
   ├─ .env.example
   ├─ vite.config.ts
   └─ package.json
```

## วิธีรัน (เปิด 2 เทอร์มินัล)

**เทอร์มินัล 1 — backend**

```powershell
cd backend
npm install
npm run dev
```

ควรเห็น `Backend ทำงานที่ http://localhost:3000`

**เทอร์มินัล 2 — frontend**

```powershell
cd frontend
npm install
npm run dev
```

แล้วเปิด http://localhost:5173

ลำดับการเปิดไม่สำคัญ แต่ถ้า backend ยังไม่รัน หน้าเว็บจะขึ้นข้อความ
"เชื่อมต่อ backend ไม่ได้" เปิด backend แล้วกดลองใหม่ได้เลย

## หน้าเว็บเรียก backend ยังไง (2 โหมด)

1. **โหมดเริ่มต้น (ไม่ต้องตั้งค่าอะไร)** — หน้าเว็บเรียก `/api/...` แล้ว Vite proxy ส่งต่อไปที่
   `http://localhost:3000` ให้เอง (ตั้งไว้ใน `frontend/vite.config.ts`)
2. **เรียกตรงๆ** — คัดลอก `frontend/.env.example` เป็น `frontend/.env` แล้วแก้
   `VITE_API_BASE_URL` เป็น URL ของ backend (เช่น `http://localhost:4000` หรือ URL บนเซิร์ฟเวอร์จริง)
   หลังแก้ `.env` ต้องหยุดแล้วรัน `npm run dev` ของ frontend ใหม่
   โหมดนี้เบราว์เซอร์เรียกข้ามพอร์ต จึงต้องให้ backend อนุญาต CORS (ดูด้านล่าง)

## ตั้งค่า backend (ตัวแปรสภาพแวดล้อม ไม่ตั้งก็ใช้ค่าเริ่มต้น)

| ตัวแปร | ความหมาย | ค่าเริ่มต้น |
|---|---|---|
| `PORT` | พอร์ตของ API | `3000` |
| `CORS_ORIGIN` | origin ของหน้าเว็บที่อนุญาต คั่นหลายค่าด้วยคอมมา หรือ `*` = ทุกที่ | `http://localhost:5173,http://127.0.0.1:5173` |

ตัวอย่างใน PowerShell (ตั้งก่อนรัน ใช้ได้เฉพาะเทอร์มินัลนั้น):

```powershell
$env:PORT = "4000"
$env:CORS_ORIGIN = "http://localhost:5173"
npm run dev
```

ถ้าเปลี่ยนพอร์ต backend ให้ใช้โหมดเรียกตรงๆ (ข้อ 2) ชี้ `VITE_API_BASE_URL` ไปที่พอร์ตใหม่

## API ของ backend

- `GET /api/health`
- `GET /api/weather?lat=13.75&lon=100.5&province=กรุงเทพมหานคร` — พยากรณ์ 7 วัน + วันแนะนำ (`bestIndex` จาก Selection Sort)
- `GET /api/air-quality?lat=13.75&lon=100.5&windDirectionDeg=270` — คุณภาพอากาศ (AQI)

ข้อมูลพิกัด 77 จังหวัด (Hash Table / Map) ยังอยู่ฝั่ง frontend (`frontend/src/services/provinces.ts`)
หน้าเว็บส่งพิกัดมาให้ backend

## Build หน้าเว็บ (สำหรับนำไปวางบนโฮสต์)

```powershell
cd frontend
npm run build
```

ได้โฟลเดอร์ `frontend/dist/` ไปวางบนโฮสต์ static ใดก็ได้ แล้วตั้ง `VITE_API_BASE_URL` เป็น URL ของ backend
ก่อน build (ค่านี้ถูกฝังตอน build) และตั้ง `CORS_ORIGIN` ของ backend เป็นโดเมนของหน้าเว็บ

`npm run build` ไม่เช็ก type ของ TypeScript ถ้าอยากเช็กให้รัน `npm run typecheck` แยกต่างหาก
