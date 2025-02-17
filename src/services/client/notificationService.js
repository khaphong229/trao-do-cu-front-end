const { createApi } = require('utils/apiUtils')

const notificationService = {
  http: createApi(),

  getNotificationPagination(params = { current: 1, pageSize: 10, q: null }) {
    const { current, pageSize, q } = params
    let path = '/notifications'
    const queryParams = new URLSearchParams()

    queryParams.append('current', current)
    queryParams.append('pageSize', pageSize)
    if (q) queryParams.append('q', q)

    path += `?${queryParams.toString()}`
    return this.http.get(path)
  },

  markAsRead(notificationId) {
    return this.http.put(`/notifications/read/${notificationId}`)
  },

  markAllAsRead() {
    return this.http.put('/notifications/read-all')
  }
}

export default notificationService
