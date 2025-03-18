import { createApi } from 'utils/apiUtils'

const postAdminService = {
  http: createApi(),

  getPagination(params) {
    const { current = 1, limit = 10, q = '', sort_order, field } = params || {}

    let path = '/admin/posts'
    const queryParams = new URLSearchParams()

    queryParams.append('current', current)
    queryParams.append('limit', limit)

    if (q) queryParams.append('q', q)
    if (sort_order) queryParams.append('sort_order', sort_order)
    if (field) queryParams.append('field', field)

    path += `?${queryParams.toString()}`
    return this.http.get(path)
  },

  approvalStatus(id, data) {
    return this.http.patch(`/admin/posts/${id}/approval`, data)
  }
}

export default postAdminService
