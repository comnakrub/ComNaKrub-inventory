# ComNaKrub Inventory

ระบบจัดการสต็อกและชุดคอมพิวเตอร์สำหรับร้าน ComNaKrub

## Tech Stack

| ส่วน | เทคโนโลยี |
|------|-----------|
| Frontend | React 18 + Vite + TypeScript + Tailwind CSS + Radix UI |
| Backend | Node.js + Express + TypeScript |
| Database | SQLite + Prisma ORM |
| Deploy | Docker Compose บน QNAP TS-853DU-RP |

## โครงสร้าง Project

```
ComNaKrub-inventory/
├── packages/
│   ├── backend/          # Express API + Prisma
│   │   ├── src/
│   │   │   ├── server.ts
│   │   │   ├── app.ts
│   │   │   └── routes/
│   │   │       ├── parts.ts   # /api/parts
│   │   │       └── sets.ts    # /api/sets
│   │   └── prisma/
│   │       ├── schema.prisma
│   │       └── seed.ts
│   └── frontend/         # React SPA
│       └── src/
│           ├── pages/
│           │   └── Inventory.tsx
│           └── types/
│               └── part.ts
├── docker-compose.yml
├── deploy.ps1
└── package.json
```

## Database Schema

```
Part          - อะไหล่/สินค้า (CPU, RAM, VGA, MB, PSU, CASE, Monitor, M.2, SSD, Cooler, FAN)
CustomerSet   - ชุดคอมที่ประกอบให้ลูกค้า
SetItem       - รายการอะไหล่ในแต่ละชุด
Payment       - รายการชำระเงิน
```

## การพัฒนา (Development)

### ติดตั้ง dependencies

```bash
npm install
```

### รัน development server

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

### Database

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed ข้อมูลตัวอย่าง
npm run db:seed
```

## REST API

### Parts

| Method | Endpoint | คำอธิบาย |
|--------|----------|-----------|
| GET | `/api/parts` | ดูรายการสินค้า (รองรับ ?search=, ?category=, ?page=, ?limit=) |
| GET | `/api/parts/:id` | ดูสินค้าชิ้นเดียว |
| POST | `/api/parts` | เพิ่มสินค้าใหม่ |
| PATCH | `/api/parts/:id` | แก้ไขสินค้า |
| DELETE | `/api/parts/:id` | ลบสินค้า (soft delete) |

### Sets

| Method | Endpoint | คำอธิบาย |
|--------|----------|-----------|
| GET | `/api/sets` | ดูรายการชุดคอม |
| GET | `/api/sets/:id` | ดูชุดคอมชุดเดียว |
| POST | `/api/sets` | สร้างชุดคอมใหม่ |
| PATCH | `/api/sets/:id/status` | เปลี่ยนสถานะ (draft → confirmed → paid → cancelled) |
| POST | `/api/sets/:id/payments` | บันทึกการชำระเงิน |

## Deploy ขึ้น QNAP

### Requirements

- Docker Desktop (Windows)
- SSH access ไปที่ `192.168.99.105:22` user `na`
- Directory `/share/Container/comnakrub` บน QNAP

### Deploy ครั้งแรก (พร้อม seed ข้อมูล)

```powershell
.\deploy.ps1 -Seed
```

### Deploy ปกติ

```powershell
.\deploy.ps1
```

### ข้ามขั้นตอน build (ถ้า image ยังใหม่อยู่)

```powershell
.\deploy.ps1 -Build:$false
```

เข้าใช้งาน: **http://192.168.99.105:8765**

## หน้าที่มีในระบบ

| หน้า | Route | สถานะ |
|------|-------|--------|
| Inventory | `/` | เสร็จแล้ว |
| Customer Sets | `/sets` | กำลังพัฒนา |
| Reports | `/reports` | กำลังพัฒนา |

## ฟีเจอร์ Inventory Page

- ค้นหาสินค้าจากชื่อ, ยี่ห้อ, รุ่น, บาร์โค้ด
- กรองตามหมวดหมู่ (CPU / RAM / VGA / MB / PSU / CASE / Monitor / M.2 / SSD / Cooler / FAN)
- แสดงราคาทุน / ราคาขาย / กำไร
- แจ้งเตือนสินค้าใกล้หมด (≤3 ชิ้น = สีส้ม, 0 ชิ้น = สีแดง)
- Pagination 50 รายการต่อหน้า
