import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { leaveService } from '../../services/leaveService'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const LEAVE_TYPES = ['Sick', 'Casual', 'Emergency']

const Field = ({ label, error, children }) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
    {children}
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
)

export default function ApplyLeave() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [form, setForm] = useState({ leave_type: '', start_date: '', end_date: '', reason: '' })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.leave_type) e.leave_type = 'Leave type is required'
    if (!form.start_date) e.start_date = 'Start date is required'
    if (!form.end_date) e.end_date = 'End date is required'
    if (form.start_date && form.end_date && form.end_date < form.start_date)
      e.end_date = 'End date cannot be before start date'
    if (!form.reason.trim()) e.reason = 'Reason is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const mutation = useMutation({
    mutationFn: leaveService.submitRequest,
    onSuccess: () => {
      toast.success('Leave request submitted successfully!')
      queryClient.invalidateQueries({ queryKey: ['leave-history'] })
      navigate('/leave/history')
    },
    onError: (err) => {
      toast.error(err?.response?.data?.detail || 'Failed to submit leave request')
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    mutation.mutate(form)
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="card">
        <h2 className="text-lg font-bold text-slate-800 mb-6">Submit Leave Request</h2>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <Field label="Leave Type" error={errors.leave_type}>
            <select
              className={`input-field ${errors.leave_type ? 'border-red-400' : ''}`}
              value={form.leave_type}
              onChange={e => setForm(f => ({ ...f, leave_type: e.target.value }))}
            >
              <option value="">Select leave type…</option>
              {LEAVE_TYPES.map(t => <option key={t} value={t}>{t} Leave</option>)}
            </select>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Start Date" error={errors.start_date}>
              <input
                type="date"
                className={`input-field ${errors.start_date ? 'border-red-400' : ''}`}
                value={form.start_date}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))}
              />
            </Field>
            <Field label="End Date" error={errors.end_date}>
              <input
                type="date"
                className={`input-field ${errors.end_date ? 'border-red-400' : ''}`}
                value={form.end_date}
                min={form.start_date || new Date().toISOString().split('T')[0]}
                onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))}
              />
            </Field>
          </div>

          <Field label="Reason" error={errors.reason}>
            <textarea
              rows={4}
              className={`input-field resize-none ${errors.reason ? 'border-red-400' : ''}`}
              placeholder="Please describe your reason for leave…"
              value={form.reason}
              onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
            />
          </Field>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={mutation.isPending} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {mutation.isPending ? (
                <><div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Submitting…</>
              ) : '📝 Submit Request'}
            </button>
            <button type="button" className="btn-secondary" onClick={() => navigate('/leave/history')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}
