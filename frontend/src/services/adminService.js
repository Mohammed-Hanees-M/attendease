import api from './api'

export const adminService = {
  async getDashboard() {
    const { data } = await api.get('/admin/dashboard')
    return data
  },

  async getEmployees(search = '') {
    const params = search ? { search } : {}
    const { data } = await api.get('/admin/employees', { params })
    return data
  },

  async getEmployeeAttendance(employeeId) {
    const { data } = await api.get(`/admin/employees/${employeeId}/attendance`)
    return data
  },

  async getLeaveRequests(status = '') {
    const params = status ? { status } : {}
    const { data } = await api.get('/admin/leave/requests', { params })
    return data
  },

  async updateLeaveStatus(leaveId, status, adminComment = '') {
    const payload = { status }
    if (adminComment) payload.admin_comment = adminComment
    const { data } = await api.put(`/admin/leave/${leaveId}`, payload)
    return data
  },

  async createEmployee(employeeData) {
    const { data } = await api.post('/admin/employees', employeeData)
    return data
  },

  async deleteEmployee(employeeId) {
    const { data } = await api.delete(`/admin/employees/${employeeId}`)
    return data
  },

  async resetSystem() {
    const { data } = await api.post('/admin/reset')
    return data
  },
}
