const { createApi } = require('utils/apiUtils')

const postService = {
  http: createApi(),

  createPost(dataPost) {
    return this.http.post('/posts', dataPost)
  },

  getPostPagination(
    params = {
      current: 1,
      pageSize: 8,
      q: null,
      city: null,
      title: null,
      description: null,
      type: 'gift',
      status: 'active',
      specificLocation: null,
      category_id: null
    }
  ) {
    const { current, pageSize, q, city, title, description, type, status, specificLocation, category_id } = params
    let path = '/posts'
    const queryParams = new URLSearchParams()

    queryParams.append('current', current)
    queryParams.append('pageSize', pageSize)
    if (q) queryParams.append('q', q)
    if (city) queryParams.append('city', city)
    if (title) queryParams.append('title', title)
    if (description) queryParams.append('description', description)
    if (type) queryParams.append('type', type)
    if (status) queryParams.append('status', status)
    if (specificLocation) queryParams.append('specificLocation', specificLocation)
    if (category_id) queryParams.append('category_id', category_id)

    path += `?${queryParams.toString()}`
    return this.http.get(path)
  },

  getPostById(id) {
    return this.http.get(`/posts/${id}`)
  },

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
  },
  rePost(data) {
    return this.http.post('/posts/repost', data)
  }
}

export default postService
