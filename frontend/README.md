# Frontend — React + Vite + Tailwind CSS

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit VITE_API_URL if your backend runs on a different port

# 3. Start development server
npm run dev
```

App runs at: http://localhost:5173

## Build for production
```bash
npm run build
npm run preview
```

## Folder structure
```
src/
├── pages/
│   ├── LoginPage.jsx
│   ├── employee/
│   │   ├── Dashboard.jsx
│   │   ├── CheckIn.jsx
│   │   ├── AttendanceHistory.jsx
│   │   ├── ApplyLeave.jsx
│   │   └── LeaveHistory.jsx
│   └── admin/
│       ├── AdminDashboard.jsx
│       ├── EmployeeList.jsx
│       └── LeaveApproval.jsx
├── components/common/  — Sidebar, Navbar, StatCard, Badge, Spinner
├── layouts/            — EmployeeLayout, AdminLayout
├── routes/             — PrivateRoute, AdminRoute guards
├── services/           — api.js + service modules
├── context/            — AuthContext
├── hooks/              — useAuth
└── utils/              — formatDate
```
