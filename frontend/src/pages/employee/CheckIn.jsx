import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { attendanceService } from '../../services/attendanceService'
import { formatDate, formatTime } from '../../utils/formatDate'
import Badge from '../../components/common/Badge'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

export default function CheckIn() {
  const queryClient = useQueryClient()

  const { data: todayStatus, isLoading } = useQuery({
    queryKey: ['today-status'],
    queryFn: attendanceService.getTodayStatus,
    refetchInterval: 60_000,
  })

  const mutation = useMutation({
    mutationFn: attendanceService.checkIn,
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({ queryKey: ['today-status'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
    onError: (err) => {
      toast.error(err?.response?.data?.detail || 'Check-in failed')
    },
  })

  if (isLoading) return <LoadingSpinner text="Loading…" />

  const alreadyCheckedIn = todayStatus?.checked_in
  const now = new Date()

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Clock card */}
      <div className="card text-center border-0 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <p className="text-5xl font-bold tracking-tight">
          {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </p>
        <p className="text-blue-200 mt-2">{formatDate(now)}</p>
        <p className="text-blue-100 text-sm mt-1">
          Office start: 9:00 AM &middot; Late after: 9:15 AM
        </p>
      </div>

      {/* Status */}
      {alreadyCheckedIn ? (
        <div className="card text-center space-y-4">
          <div className="text-6xl">✅</div>
          <h2 className="text-xl font-bold text-slate-800">Already Checked In</h2>
          <div className="bg-slate-50 rounded-xl p-4 text-left space-y-2">
            <Row label="Date" value={formatDate(todayStatus.attendance?.attendance_date)} />
            <Row label="Check-in Time" value={formatTime(todayStatus.attendance?.check_in_time)} />
            <Row label="Status" value={<Badge status={todayStatus.attendance?.status} />} />
          </div>
          <p className="text-sm text-slate-500">You have already marked attendance for today.</p>
        </div>
      ) : (
        <div className="card text-center space-y-5">
          <div className="text-6xl">👆</div>
          <h2 className="text-xl font-bold text-slate-800">Mark Your Attendance</h2>
          <p className="text-slate-500 text-sm">
            Click the button below to check in. Your status will be automatically calculated based on the time.
          </p>
          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="btn-primary w-full text-base py-3 flex items-center justify-center gap-2"
          >
            {mutation.isPending ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Marking attendance…
              </>
            ) : '✅ Check In Now'}
          </button>
          <p className="text-xs text-slate-400">You can only check in once per day.</p>
        </div>
      )}
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between items-center py-1 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-medium text-slate-700">{value}</span>
    </div>
  )
}
