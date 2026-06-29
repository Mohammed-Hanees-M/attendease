import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService } from '../../services/adminService'
import { formatDate } from '../../utils/formatDate'
import Badge from '../../components/common/Badge'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

const STATUS_FILTERS = ['', 'Pending', 'Approved', 'Rejected']

export default function LeaveApproval() {
  const [filter, setFilter] = useState('Pending')
  const [comment, setComment] = useState({})
  const [modal, setModal] = useState(null) // { id, action }
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-leave-requests', filter],
    queryFn: () => adminService.getLeaveRequests(filter),
  })

  const mutation = useMutation({
    mutationFn: ({ id, status, adminComment }) => adminService.updateLeaveStatus(id, status, adminComment),
    onSuccess: (_, vars) => {
      toast.success(`Leave request ${vars.status}`)
      queryClient.invalidateQueries({ queryKey: ['admin-leave-requests'] })
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] })
      setModal(null)
      setComment(c => { const n = {...c}; delete n[vars.id]; return n })
    },
    onError: (err) => toast.error(err?.response?.data?.detail || 'Action failed'),
  })

  const handleAction = (id, status) => {
    mutation.mutate({ id, status, adminComment: comment[id] || '' })
  }

  return (
    <div className="space-y-5">
      {/* Filter tabs */}
      <div className="card flex gap-2 flex-wrap">
        {STATUS_FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === f ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            {f || 'All'}
          </button>
        ))}
        {data && <span className="ml-auto text-sm text-slate-500 self-center">{data.total} request{data.total !== 1 ? 's' : ''}</span>}
      </div>

      {/* Table */}
      {isLoading ? <LoadingSpinner text="Loading requests…" /> : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Employee</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Type</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Dates</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Reason</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {!data?.records?.length ? (
                <tr><td colSpan={6} className="text-center py-12 text-slate-400">No leave requests found.</td></tr>
              ) : data.records.map(req => (
                <tr key={req.id} className="hover:bg-slate-50 transition-colors align-top">
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-800">{req.user_name}</p>
                    <p className="text-xs text-slate-400">{req.user_email}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-700">{req.leave_type}</td>
                  <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                    {formatDate(req.start_date)}<br />
                    <span className="text-xs text-slate-400">to {formatDate(req.end_date)}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 max-w-xs">
                    <p className="line-clamp-2">{req.reason}</p>
                  </td>
                  <td className="px-6 py-4"><Badge status={req.status} /></td>
                  <td className="px-6 py-4">
                    {req.status === 'Pending' ? (
                      <div className="space-y-2 min-w-48">
                        <input
                          type="text"
                          className="input-field text-xs py-1.5"
                          placeholder="Optional comment…"
                          value={comment[req.id] || ''}
                          onChange={e => setComment(c => ({ ...c, [req.id]: e.target.value }))}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAction(req.id, 'Approved')}
                            disabled={mutation.isPending}
                            className="btn-success text-xs py-1.5 px-3 flex-1"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleAction(req.id, 'Rejected')}
                            disabled={mutation.isPending}
                            className="btn-danger text-xs py-1.5 px-3 flex-1"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">{req.admin_comment || 'No comment'}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
