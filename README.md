# AttendEase — Employee Attendance & Leave Management System

A full-stack web application for managing employee attendance and leave requests with role-based access control.

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS, React Query |
| Backend    | Python 3.11+, FastAPI, SQLAlchemy |
| Database   | PostgreSQL                        |
| Auth       | JWT (access + refresh tokens), bcrypt |

---

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 14+

### 1. Database Setup
```sql
CREATE DATABASE attendance_db;
```

### 2. Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Linux/Mac
# venv\Scripts\activate         # Windows

pip install -r requirements.txt

cp .env.example .env
# Edit .env: set your DATABASE_URL and a strong SECRET_KEY

alembic upgrade head    # Run migrations
python seed.py          # Seed admin + sample employees

uvicorn app.main:app --reload --port 8000
```

### 3. Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open: **http://localhost:5173**

---

## Default Login Credentials

| Role     | Email                | Password      |
|----------|----------------------|---------------|
| Admin    | admin@company.com    | Admin@123     |
| Employee | john@company.com     | Employee@123  |
| Employee | jane@company.com     | Employee@123  |

---

## Features

### Employee
- Secure login with JWT authentication
- One-click daily attendance check-in (auto-detects Present/Late)
- Full attendance history with month/year filtering and pagination
- Submit leave requests (Sick / Casual / Emergency)
- Track leave approval status with admin comments

### Admin
- Real-time dashboard: total employees, present/late/absent today, pending leaves
- Employee management with search and attendance drill-down
- Leave approval system: Approve or Reject with optional comments
- Automatic dashboard stats refresh

---

## API Documentation

Once the backend is running:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

---

## Project Structure

```
attendance-system/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   └── utils/
│   ├── alembic/
│   ├── seed.py
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   ├── layouts/
    │   ├── routes/
    │   ├── services/
    │   ├── context/
    │   ├── hooks/
    │   └── utils/
    └── package.json
```

---

## Business Rules

- **Attendance**: One check-in per day per employee. Before 9:15 AM = Present. After = Late.
- **Leave**: Start and end dates required. End cannot be before start. Status starts as Pending.
- **RBAC**: Employees access only their own data. Admins can see and manage all data.
- **JWT**: Access token (15 min) + Refresh token (7 days) with auto-refresh on the frontend.
