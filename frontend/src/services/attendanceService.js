import api from './api'

export const attendanceService = {
  async checkIn() {
    const { data } = await api.post('/attendance/checkin')
    return data
  },

  async getTodayStatus() {
    const { data } = await api.get('/attendance/today')
    return data
  },

  async getHistory(page = 1, month = null, year = null) {
    const params = { page }
    if (month) params.month = month
    if (year) params.year = year
    const { data } = await api.get('/attendance/history', { params })
    return data
  },
}
