const { createApi } = require('utils/apiUtils')

export const postManageService = {
  http: createApi(),

  getPostOfMePagination(
    params = {
      current: 1,
      pageSize: 20,
      q: null,
      type: null,
      status: null
    }
  ) {
    const { current, pageSize, q, type, status } = params
    let path = '/posts/me'
    const queryParams = new URLSearchParams()

    queryParams.append('current', current)
    queryParams.append('pageSize', pageSize)
    if (q) queryParams.append('q', q)
    if (type) queryParams.append('type', type)
    if (status) queryParams.append('status', status)
    path += `?${queryParams.toString()}`

    return this.http
      .get(path)
      .then(response => {
        if (response.status === 200 && response.data) {
          return {
            total: response.data.total,
            current: response.data.current,
            limit: response.data.limit,
            data: response.data.data
          }
        } else {
          throw new Error(response.message || 'Failed to fetch posts')
        }
      })
      .catch(error => {
        throw error
      })
  }
}
