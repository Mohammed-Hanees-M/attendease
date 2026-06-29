import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService } from '../../services/adminService'
import StatCard from '../../components/common/StatCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const queryClient = useQueryClient()

  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: adminService.getDashboard,
    refetchInterval: 60_000,
  })

  const resetMutation = useMutation({
    mutationFn: adminService.resetSystem,
    onSuccess: () => {
      toast.success('System has been completely reset.')
      queryClient.invalidateQueries()
      window.location.reload()
    },
    onError: (err) => {
      toast.error(err?.response?.data?.detail || 'Failed to reset system')
    }
  })

  const handleReset = () => {
    const confirmation = window.prompt("⚠️ DANGER ZONE ⚠️\n\nThis will DELETE ALL employees, attendance records, and leave requests. The admin account will remain.\n\nType 'RESET' to confirm:")
    if (confirmation === 'RESET') {
      resetMutation.mutate()
    } else if (confirmation !== null) {
      toast.error('Reset cancelled: You must type RESET exactly.')
    }
  }

  if (isLoading) return <LoadingSpinner text="Loading dashboard…" />

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="card bg-gradient-to-r from-slate-800 to-slate-900 text-white border-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Admin Overview</h2>
            <p className="text-slate-300 mt-1 text-sm">Real-time attendance and leave data for your organisation.</p>
          </div>
          <div className="text-5xl opacity-70">🛡️</div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Total Employees" value={stats?.totalEmployees} icon="👥" color="blue" />
        <StatCard title="Present Today" value={stats?.presentToday} icon="✅" color="green" />
        <StatCard title="Late Today" value={stats?.lateToday} icon="⏰" color="amber" />
        <StatCard title="Absent Today" value={stats?.absentToday} icon="❌" color="red" />
        <StatCard title="Pending Leaves" value={stats?.pendingLeaves} icon="📋" color="purple" />
        <StatCard
          title="Present Rate"
          value={stats?.totalEmployees ? `${Math.round(((stats.presentToday + stats.lateToday) / stats.totalEmployees) * 100)}%` : '—'}
          icon="📊"
          color="slate"
          sub="Present + Late / Total"
        />
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-4">
        <Link to="/admin/employees" className="card hover:shadow-md transition-shadow cursor-pointer border-dashed text-center">
          <div className="text-3xl mb-2">👥</div>
          <p className="font-semibold text-slate-700">Manage Employees</p>
          <p className="text-xs text-slate-400 mt-1">View and search all employees</p>
        </Link>
        <Link to="/admin/leave-requests" className="card hover:shadow-md transition-shadow cursor-pointer border-dashed text-center">
          <div className="text-3xl mb-2">📋</div>
          <p className="font-semibold text-slate-700">Leave Requests</p>
          <p className="text-xs text-slate-400 mt-1">{stats?.pendingLeaves} pending approval</p>
        </Link>
      </div>

      {/* Danger Zone */}
      <div className="mt-8 border-t border-slate-200 pt-8">
        <h3 className="text-red-600 font-bold mb-4">Danger Zone</h3>
        <div className="bg-red-50 rounded-xl p-6 border border-red-100 flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-red-800">Reset Project Data</h4>
            <p className="text-sm text-red-600 mt-1">This will permanently delete all employees, attendance, and leave data. The admin account will remain intact.</p>
          </div>
          <button 
            onClick={handleReset}
            disabled={resetMutation.isPending}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            {resetMutation.isPending ? 'Resetting…' : 'Reset All'}
          </button>
        </div>
      </div>
    </div>
  )
}
