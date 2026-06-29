import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './routes/PrivateRoute'
import AdminRoute from './routes/AdminRoute'
import EmployeeLayout from './layouts/EmployeeLayout'
import AdminLayout from './layouts/AdminLayout'

// Pages
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/employee/Dashboard'
import CheckIn from './pages/employee/CheckIn'
import AttendanceHistory from './pages/employee/AttendanceHistory'
import ApplyLeave from './pages/employee/ApplyLeave'
import LeaveHistory from './pages/employee/LeaveHistory'
import AdminDashboard from './pages/admin/AdminDashboard'
import EmployeeList from './pages/admin/EmployeeList'
import LeaveApproval from './pages/admin/LeaveApproval'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Employee routes */}
          <Route
            element={
              <PrivateRoute>
                <EmployeeLayout />
              </PrivateRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/checkin" element={<CheckIn />} />
            <Route path="/attendance" element={<AttendanceHistory />} />
            <Route path="/leave/apply" element={<ApplyLeave />} />
            <Route path="/leave/history" element={<LeaveHistory />} />
          </Route>

          {/* Admin routes */}
          <Route
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/employees" element={<EmployeeList />} />
            <Route path="/admin/leave-requests" element={<LeaveApproval />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
