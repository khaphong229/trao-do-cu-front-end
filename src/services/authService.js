import { createApi } from '../utils/apiUtils'

const authService = {
  http: createApi(),

  login(credentials, isAdmin = false) {
    const loginPath = isAdmin ? '/admin/auth/login' : '/auth/login'
    return this.http.post(loginPath, credentials)
  },

  register(userData) {
    return this.http.post('/auth/register', userData)
  },

  logout(isAdmin = false) {
    const logoutPath = isAdmin ? '/admin/auth/logout' : '/auth/logout'
    const res = this.http.post(logoutPath)
    localStorage.removeItem('token')
    return res
  },

  getCurrentUser() {
    return this.http.get('/auth/me')
  },

  getAdminCurrentUser() {
    return this.http.get('/admin/auth/me')
  },

  resetPassword(email) {
    return this.http.post('/auth/reset-password', { email })
  },

  updateProfile(userData) {
    return this.http.put('/auth/me', userData)
  }
}

export default authService
