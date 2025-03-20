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
      password: data.currentPassword,
      new_password: data.newPassword
    })
  },

  resetPassword(data) {
    // Using only new_password field as per backend validation
    // Using token in the URL path parameter
    return this.http.post(`/auth/reset-password/${data.token}`, {
      new_password: data.new_password
    })
  },

  updateProfile(userData) {
    return this.http.put('/auth/me', userData)
  },

  loginGoogle(id) {
    return this.http.post('/auth/login-success', { googleId: id })
  },

  forgotPassword(email) {
    return this.http.post('/auth/forgot-password', { email })
  },

  updateDefaultAddress(data) {
    return this.http.post('/auth/update-default-address', { address_id: data })
  }
}

export default authService
