import api from './api'

export const leaveService = {
  async submitRequest(payload) {
    const { data } = await api.post('/leave/request', payload)
    return data
  },

  async getHistory() {
    const { data } = await api.get('/leave/history')
    return data
  },
}
