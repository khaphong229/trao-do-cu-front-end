import { createApi } from '../../utils/apiUtils'

const userService = {
  http: createApi(),

  getPagination(
    params = {
      page: 1,
      per_page: 10,
      q: null,
      sort_order: null,
      field: null
    }
  ) {
    const { page, per_page, q, sort_order, field } = params
    let path = '/admin/users'
    const queryParams = new URLSearchParams()

    queryParams.append('page', page)
    queryParams.append('per_page', per_page)

    if (q) queryParams.append('q', q)
    if (sort_order) queryParams.append('sort_order', sort_order)
    if (field) queryParams.append('field', field)

    path += `?${queryParams.toString()}`
    return this.http.get(path)
  },

  getById(id) {
    return this.http.get(`/admin/users/${id}`)
  },

  addUser(data) {
    return this.http.post('/admin/users', data)
  },

  updateUser(id, data) {
    return this.http.put(`/admin/users/${id}`, data)
  },

  deleteUser(id) {
    return this.http.delete(`/admin/users/${id}`)
  },

  toggleUserStatus(id) {
    return this.http.patch(`/admin/users/${id}/status`)
  }
}

export default userService
