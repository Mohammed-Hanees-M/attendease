import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { attendanceService } from '../../services/attendanceService'
import { formatDate, formatTime } from '../../utils/formatDate'
import Badge from '../../components/common/Badge'
import LoadingSpinner from '../../components/common/LoadingSpinner'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function AttendanceHistory() {
  const now = new Date()
  const [page, setPage] = useState(1)
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())

  const { data, isLoading } = useQuery({
    queryKey: ['attendance-history', page, month, year],
    queryFn: () => attendanceService.getHistory(page, month || null, year || null),
    keepPreviousData: true,
  })

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="card flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Month</label>
          <select
            className="input-field w-36"
            value={month}
            onChange={e => { setMonth(+e.target.value); setPage(1) }}
          >
            <option value="">All months</option>
            {MONTHS.map((m, i) => <option key={i} value={i+1}>{m}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Year</label>
          <select
            className="input-field w-28"
            value={year}
            onChange={e => { setYear(+e.target.value); setPage(1) }}
          >
            {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <button className="btn-secondary text-sm" onClick={() => { setMonth(now.getMonth()+1); setYear(now.getFullYear()); setPage(1) }}>
          Reset
        </button>
        {data && <span className="text-sm text-slate-500 ml-auto">{data.total} record{data.total !== 1 ? 's' : ''} found</span>}
      </div>

      {/* Table */}
      {isLoading ? <LoadingSpinner text="Loading records…" /> : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Date</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Check-in Time</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data?.records?.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-12 text-slate-400">No attendance records found.</td>
                </tr>
              ) : data?.records?.map(rec => (
                <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3.5 font-medium text-slate-700">{formatDate(rec.attendance_date)}</td>
                  <td className="px-6 py-3.5 text-slate-600">{formatTime(rec.check_in_time)}</td>
                  <td className="px-6 py-3.5"><Badge status={rec.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {data?.pages > 1 && (
            <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100">
              <p className="text-sm text-slate-500">Page {data.page} of {data.pages}</p>
              <div className="flex gap-2">
                <button className="btn-secondary text-sm py-1.5" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</button>
                <button className="btn-secondary text-sm py-1.5" disabled={page === data.pages} onClick={() => setPage(p => p + 1)}>Next</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
