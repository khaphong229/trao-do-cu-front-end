import { createApi } from 'utils/apiUtils'

const postAdminService = {
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
    let path = '/admin/posts'
    const queryParams = new URLSearchParams()

    queryParams.append('page', page)
    queryParams.append('per_page', per_page)

    if (q) queryParams.append('q', q)
    if (sort_order) queryParams.append('sort_order', sort_order)
    if (field) queryParams.append('field', field)

    path += `?${queryParams.toString()}`
    return this.http.get(path)
  },
  approvalStatus(id) {
    return this.http.patch(`/admin/posts/${id}/approval`)
  }
}

export default postAdminService
