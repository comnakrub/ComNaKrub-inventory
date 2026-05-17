# CLAUDE.md — ComNaKrub Inventory

## Project Overview

ระบบจัดการสต็อกและชุดคอมพิวเตอร์ (monorepo) สำหรับร้าน ComNaKrub

- **Frontend:** `packages/frontend/` — React 18 + Vite + TypeScript + Tailwind + Radix UI
- **Backend:** `packages/backend/` — Express + TypeScript + Prisma + SQLite
- **Deploy target:** QNAP TS-853DU-RP ที่ `192.168.99.105:8765` via Docker Compose

## Architecture Decisions

- **SQLite** เลือกเพราะ deploy บน QNAP NAS — ไม่ต้องการ database server แยก
- **Soft delete** สำหรับ Part ใช้ `isActive: false` ไม่ได้ลบจริง เพื่อรักษา historical data ใน SetItem
- **Monorepo** ใช้ npm workspaces — รัน script จาก root ได้เลย
- **Port 8765** ใช้บน QNAP เพื่อหลีกเลี่ยง conflict กับ service อื่น

## Key File Locations

```
packages/backend/src/routes/parts.ts   — CRUD API สำหรับ Part
packages/backend/src/routes/sets.ts    — API สำหรับ CustomerSet + Payment
packages/backend/prisma/schema.prisma  — Database models
packages/backend/prisma/seed.ts        — Seed data (CPU, RAM, VGA, MB, PSU, CASE, Monitor, M.2, SSD, Cooler, FAN)
packages/frontend/src/pages/Inventory.tsx — หน้าหลักแสดง stock
packages/frontend/src/types/part.ts    — TypeScript types
docker-compose.yml                     — Production container config
deploy.ps1                             — PowerShell deploy script ไป QNAP
```

## Development Commands

```bash
npm run dev          # รัน backend (port 3001) + frontend (port 5173) พร้อมกัน
npm run build        # Build ทั้งสอง package
npm run db:generate  # Generate Prisma client หลังแก้ schema
npm run db:migrate   # Run migrations
npm run db:seed      # Seed ข้อมูลตัวอย่าง
```

## Database Models

```
Part          id, name, category, brand, model, quantity, costPrice, sellPrice, barcode?, imageUrl?, isActive
CustomerSet   id, customerName, customerPhone, notes, totalPrice, status (draft/confirmed/paid/cancelled)
SetItem       id, setId, partId, quantity, unitPrice  [join table]
Payment       id, setId, amount, method (cash/transfer), note, paidAt
```

## Part Categories (exact strings ใน DB)

`CPU` | `RAM` | `VGA` | `MB` | `PSU` | `CASE` | `Monitor` | `M.2` | `SSD` | `Cooler` | `FAN`

## API Conventions

- Base URL (dev): `http://localhost:3001`
- Prefix: `/api/parts`, `/api/sets`
- Request validation: Zod schemas ใน route files
- Error response: `{ error: string }`
- List response: `{ data: T[], total: number, page: number, limit: number }`
- Health check: `GET /api/health`

## Frontend Conventions

- Path alias `@/` → `packages/frontend/src/`
- Currency format: Thai Baht (th-TH) ผ่าน `formatCurrency()` ใน `lib/utils.ts`
- Component styling: Tailwind utility classes + `cn()` helper
- API calls: fetch ผ่าน Vite proxy `/api` → `localhost:3001`

## Docker / Deploy

```powershell
# Deploy พร้อม seed ข้อมูลครั้งแรก
.\deploy.ps1 -Seed

# Deploy ปกติ
.\deploy.ps1

# Deploy โดยไม่ build ใหม่
.\deploy.ps1 -Build:$false
```

- Remote dir: `/share/Container/comnakrub`
- SSH: `na@192.168.99.105:22`
- Database volume: `comnakrub-db` (ข้อมูลอยู่ที่ `/data/prod.db` ในตัว container)

## Pages Roadmap

| หน้า | Route | สถานะ |
|------|-------|--------|
| Inventory | `/` | เสร็จแล้ว |
| Customer Sets | `/sets` | TODO |
| Reports | `/reports` | TODO |

## Things to Be Careful About

- แก้ `schema.prisma` ต้อง run `npm run db:generate` ก่อนจะ compile ได้
- `barcode` field เป็น `@unique` — ถ้า seed ข้อมูลซ้ำจะ error
- Frontend dev ใช้ Vite proxy — production ใช้ Nginx proxy ใน `nginx.conf`
- ใน Docker: backend ไม่ expose port ออก host ตรงๆ — ผ่าน frontend Nginx เท่านั้น
