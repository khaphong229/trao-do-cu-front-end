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
  changePassWord(data) {
    return this.http.patch('/auth/change-password', {
      password: data.currentPassword, // Chuyển thành `password`
      new_password: data.newPassword // Chuyển thành `new_password`
    })
  },

  resetPassword(token) {
    return this.http.post('/auth/reset-password', { token })
  },

  updateProfile(userData) {
    return this.http.put('/auth/me', userData)
  },

  loginGoogle(id) {
    return this.http.post('/auth/login-success', { googleId: id })
  },

  updateDefaultAddress(id) {
    return this.http.post('/auth/update-default-address', { address_id: id })
  }
}

export default authService
