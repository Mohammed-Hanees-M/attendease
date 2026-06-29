import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService } from '../../services/adminService'
import { toast } from 'react-hot-toast'
import { formatDate, formatDateTime } from '../../utils/formatDate'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Badge from '../../components/common/Badge'

export default function EmployeeList() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newEmp, setNewEmp] = useState({ name: '', email: '', phone_number: '', password: '' })
  const [errors, setErrors] = useState({})
  
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-employees', search],
    queryFn: () => adminService.getEmployees(search),
  })

  const { data: attData, isLoading: attLoading } = useQuery({
    queryKey: ['employee-attendance', selected?.id],
    queryFn: () => adminService.getEmployeeAttendance(selected.id),
    enabled: !!selected,
  })

  const addMutation = useMutation({
    mutationFn: adminService.createEmployee,
    onSuccess: () => {
      toast.success('Employee created successfully!')
      setShowAddModal(false)
      setNewEmp({ name: '', email: '', phone_number: '', password: '' })
      queryClient.invalidateQueries(['admin-employees'])
    },
    onError: (err) => {
      toast.error(err?.response?.data?.detail || 'Failed to create employee')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: adminService.deleteEmployee,
    onSuccess: () => {
      toast.success('Employee deleted successfully!')
      setSelected(null)
      queryClient.invalidateQueries(['admin-employees'])
    },
    onError: (err) => {
      toast.error(err?.response?.data?.detail || 'Failed to delete employee')
    }
  })

  const handleAddSubmit = (e) => {
    e.preventDefault()
    const errs = {}
    if (!newEmp.name) errs.name = 'Name is required'
    if (!newEmp.email) errs.email = 'Email is required'
    if (!newEmp.phone_number || newEmp.phone_number.length !== 10 || !/^\d+$/.test(newEmp.phone_number)) {
      errs.phone_number = 'Phone number must be exactly 10 digits'
    }
    if (!newEmp.password) errs.password = 'Password is required'
    
    setErrors(errs)
    if (Object.keys(errs).length === 0) {
      addMutation.mutate(newEmp)
    }
  }

  const handleDelete = (e, emp) => {
    e.stopPropagation()
    if (window.confirm(`Are you sure you want to completely delete ${emp.name}? This will remove all their records.`)) {
      deleteMutation.mutate(emp.id)
    }
  }

  return (
    <div className="space-y-5 relative">
      {/* Search */}
      <div className="card flex gap-3 items-center">
        <input
          type="text"
          className="input-field"
          placeholder="Search by name or email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button className="btn-secondary text-sm whitespace-nowrap" onClick={() => setSearch('')}>Clear</button>
        )}
        <button onClick={() => setShowAddModal(true)} className="btn-primary text-sm whitespace-nowrap ml-auto">
          + Add Employee
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Employee table */}
        <div className="card p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-700">Employee List</h3>
          </div>
          {isLoading ? <LoadingSpinner /> : (
            <div className="divide-y divide-slate-50">
              {!data?.employees?.length ? (
                <p className="text-center py-10 text-slate-400">No employees found.</p>
              ) : data.employees.map(emp => (
                <div
                  key={emp.id}
                  onClick={() => setSelected(emp)}
                  className={`px-6 py-4 cursor-pointer transition-colors hover:bg-slate-50 flex items-center gap-4 ${selected?.id === emp.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''}`}
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                    {emp.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-800 truncate">{emp.name}</p>
                    <p className="text-xs text-slate-500 truncate">{emp.email} {emp.phone_number ? `• ${emp.phone_number}` : ''}</p>
                  </div>
                  <button 
                    onClick={(e) => handleDelete(e, emp)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="Delete Employee"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Attendance panel */}
        <div className="card p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-700">
              {selected ? `${selected.name}'s Attendance` : 'Select an employee'}
            </h3>
          </div>
          {!selected ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <div className="text-4xl mb-3">👈</div>
              <p className="text-sm">Click an employee to view their attendance</p>
            </div>
          ) : attLoading ? <LoadingSpinner /> : (
            <div className="overflow-auto max-h-96">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 sticky top-0">
                  <tr>
                    <th className="text-left px-5 py-2.5 text-xs font-semibold text-slate-500">Date</th>
                    <th className="text-left px-5 py-2.5 text-xs font-semibold text-slate-500">Check-in</th>
                    <th className="text-left px-5 py-2.5 text-xs font-semibold text-slate-500">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {!attData?.records?.length ? (
                    <tr><td colSpan={3} className="text-center py-8 text-slate-400">No attendance records.</td></tr>
                  ) : attData.records.map(r => (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <td className="px-5 py-3 text-slate-700">{formatDate(r.attendance_date)}</td>
                      <td className="px-5 py-3 text-slate-600">{formatDateTime(r.check_in_time).split(',')[1]?.trim()}</td>
                      <td className="px-5 py-3"><Badge status={r.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-4">Register New Employee</h3>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input type="text" className="input-field" value={newEmp.name} onChange={e => setNewEmp({...newEmp, name: e.target.value})} />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="email" className="input-field" value={newEmp.email} onChange={e => setNewEmp({...newEmp, email: e.target.value})} />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input type="text" maxLength="10" className="input-field" placeholder="10 digits" value={newEmp.phone_number} onChange={e => setNewEmp({...newEmp, phone_number: e.target.value.replace(/\D/g, '')})} />
                {errors.phone_number && <p className="text-red-500 text-xs mt-1">{errors.phone_number}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input type="password" className="input-field" value={newEmp.password} onChange={e => setNewEmp({...newEmp, password: e.target.value})} />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" disabled={addMutation.isPending} className="btn-primary flex-1">Register</button>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
