# e-utilities-cost

ระบบควบคุม/ติดตามค่าสาธารณูปโภคของหน่วยงาน/สถานศึกษา (Utility Expense Tracking & Control System)

Backend: Node.js + Express + Sequelize + MariaDB + JWT
Frontend: Vue 3 (Composition API) + Vite + Tailwind CSS + Pinia + Chart.js
Infra: Docker + Docker Compose, Docker Hub

## โครงสร้างโปรเจกต์

```
e-utilities-cost/
├── backend/        # Express API
├── frontend/        # Vue 3 SPA
├── docker-compose.yml
├── .env.example
└── README.md
```

## รันด้วย Docker Compose (แนะนำ)

```bash
cp .env.example .env
# แก้ไขค่าใน .env ให้เป็นรหัสผ่าน/secret ของคุณเอง

docker compose up -d --build

# สร้างข้อมูลเริ่มต้น (หมวดหมู่ + admin user)
docker compose exec backend npm run seed
```

- Frontend: http://localhost:8080
- Backend API: http://localhost:3000/api
- phpMyAdmin: http://localhost:8081

Default admin login หลัง seed: `admin` / `admin1234` — **เปลี่ยนรหัสผ่านทันทีหลัง deploy จริง**

## รันแบบ dev (ไม่ใช้ Docker)

### Backend
```bash
cd backend
cp .env.example .env
npm install
# แก้ .env ให้ชี้ไปยัง MariaDB ของคุณ (DB_HOST=localhost ถ้ารันในเครื่อง)
npm run seed
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Build & Push image ขึ้น Docker Hub

```bash
docker login

docker build -t <dockerhub-username>/e-utilities-cost-backend:latest ./backend
docker build -t <dockerhub-username>/e-utilities-cost-frontend:latest ./frontend

docker push <dockerhub-username>/e-utilities-cost-backend:latest
docker push <dockerhub-username>/e-utilities-cost-frontend:latest
```

## API หลัก

| Method | Endpoint | คำอธิบาย |
|---|---|---|
| POST | /api/auth/login | เข้าสู่ระบบ |
| POST | /api/auth/logout | ออกจากระบบ |
| POST | /api/auth/refresh | ขอ access token ใหม่ |
| GET | /api/auth/me | ข้อมูล user ปัจจุบัน |
| GET/POST/PUT/DELETE | /api/expense-categories | จัดการประเภทค่าใช้จ่าย |
| GET/POST/PUT/DELETE | /api/budget-categories | จัดการหมวดเงิน |
| GET/POST/PUT/DELETE | /api/expenses | จัดการรายการค่าใช้จ่าย |
| GET | /api/dashboard/summary?year= | สรุปยอดรายเดือนทั้งปี |
| GET | /api/dashboard/by-category?year= | สรุปแยกตามประเภท |
| GET | /api/dashboard/by-budget?year= | สรุปแยกตามหมวดเงิน |
| GET | /api/dashboard/compare?year1=&year2= | เปรียบเทียบปีต่อปี |

## Security notes

- Password hash ด้วย bcrypt
- JWT secret เก็บใน `.env` เท่านั้น — ห้าม commit `.env` จริงขึ้น git (ดู `.gitignore`)
- Rate-limit บน `/api/auth/login`
- helmet + cors จำกัด origin เฉพาะ frontend
