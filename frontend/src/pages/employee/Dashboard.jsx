import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '../../services/dashboardService'
import { attendanceService } from '../../services/attendanceService'
import StatCard from '../../components/common/StatCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { useAuth } from '../../context/AuthContext'
import { formatTime } from '../../utils/formatDate'

export default function Dashboard() {
  const { user } = useAuth()

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardService.getStats,
  })

  const { data: todayStatus } = useQuery({
    queryKey: ['today-status'],
    queryFn: attendanceService.getTodayStatus,
  })

  if (statsLoading) return <LoadingSpinner text="Loading dashboard…" />

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="card bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Good {getGreeting()}, {user?.name?.split(' ')[0]}! 👋</h2>
            <p className="text-blue-100 mt-1">
              {todayStatus?.checked_in
                ? `You checked in at ${formatTime(todayStatus.attendance?.check_in_time)} — ${todayStatus.attendance?.status}`
                : "You haven't checked in yet today."}
            </p>
          </div>
          <div className="text-5xl opacity-80">🏢</div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Working Days (Month)" value={stats?.workingDays} icon="📆" color="blue" />
        <StatCard title="Days Present" value={stats?.presentDays} icon="✅" color="green" />
        <StatCard title="Days Absent" value={stats?.absentDays} icon="❌" color="red" />
        <StatCard title="Pending Leaves" value={stats?.pendingLeaves} icon="⏳" color="amber" />
        <StatCard title="Approved Leaves" value={stats?.approvedLeaves} icon="✔️" color="purple" />
        <StatCard
          title="Attendance Rate"
          value={stats?.presentDays && stats?.workingDays ? `${Math.round((stats.presentDays / stats.workingDays) * 100)}%` : '—'}
          icon="📈"
          color="slate"
        />
      </div>

      {/* Today check-in status */}
      <div className="card">
        <h3 className="font-semibold text-slate-700 mb-3">Today's Status</h3>
        {todayStatus?.checked_in ? (
          <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
            <div className="text-3xl">✅</div>
            <div>
              <p className="font-semibold text-emerald-800">Checked In</p>
              <p className="text-sm text-emerald-600">Time: {formatTime(todayStatus.attendance?.check_in_time)} &middot; Status: {todayStatus.attendance?.status}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
            <div className="text-3xl">⚠️</div>
            <div>
              <p className="font-semibold text-amber-800">Not Checked In</p>
              <p className="text-sm text-amber-600">Go to Check In page to mark your attendance.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}
