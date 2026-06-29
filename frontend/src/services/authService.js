import api from './api'

export const authService = {
  async login(email, password) {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('access_token', data.access_token)
    localStorage.setItem('refresh_token', data.refresh_token)
    localStorage.setItem('user', JSON.stringify({
      id: data.user_id,
      name: data.name,
      role: data.role,
    }))
    return data
  },

  async logout() {
    try { await api.post('/auth/logout') } catch {}
    localStorage.clear()
  },

  getUser() {
    const u = localStorage.getItem('user')
    return u ? JSON.parse(u) : null
  },

  isAuthenticated() {
    return !!localStorage.getItem('access_token')
  },

  isAdmin() {
    const user = this.getUser()
    return user?.role === 'admin'
  },
}
