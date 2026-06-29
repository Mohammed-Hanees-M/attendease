import { useQuery } from '@tanstack/react-query'
import { leaveService } from '../../services/leaveService'
import { formatDate } from '../../utils/formatDate'
import Badge from '../../components/common/Badge'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { Link } from 'react-router-dom'

export default function LeaveHistory() {
  const { data, isLoading } = useQuery({
    queryKey: ['leave-history'],
    queryFn: leaveService.getHistory,
  })

  if (isLoading) return <LoadingSpinner text="Loading leave history…" />

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{data?.total || 0} request{data?.total !== 1 ? 's' : ''} total</p>
        <Link to="/leave/apply" className="btn-primary text-sm py-2">+ New Request</Link>
      </div>

      <div className="card p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Leave Type</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Start Date</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">End Date</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Reason</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Comment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {!data?.records?.length ? (
              <tr><td colSpan={6} className="text-center py-12 text-slate-400">No leave requests yet. <Link to="/leave/apply" className="text-blue-500 hover:underline">Apply now</Link></td></tr>
            ) : data.records.map(req => (
              <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-3.5 font-medium text-slate-700">{req.leave_type} Leave</td>
                <td className="px-6 py-3.5 text-slate-600">{formatDate(req.start_date)}</td>
                <td className="px-6 py-3.5 text-slate-600">{formatDate(req.end_date)}</td>
                <td className="px-6 py-3.5 text-slate-500 max-w-xs truncate" title={req.reason}>{req.reason}</td>
                <td className="px-6 py-3.5"><Badge status={req.status} /></td>
                <td className="px-6 py-3.5 text-slate-500 text-xs">{req.admin_comment || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
