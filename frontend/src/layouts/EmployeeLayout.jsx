import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/common/Sidebar'
import Navbar from '../components/common/Navbar'

const titles = {
  '/dashboard': 'Dashboard',
  '/checkin': 'Check In',
  '/attendance': 'Attendance History',
  '/leave/apply': 'Apply for Leave',
  '/leave/history': 'Leave History',
}

export default function EmployeeLayout() {
  const { pathname } = useLocation()
  const title = titles[pathname] || 'AttendEase'
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title={title} />
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
