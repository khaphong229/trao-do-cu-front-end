const { createApi } = require('utils/apiUtils')

export const getPostReceiveRequestService = {
  http: createApi(),

  getPostReceiveRequestService() {
    let path = '/request_gift'
    const queryParams = new URLSearchParams()
    queryParams.append('pageSize', 10000)
    const queryString = queryParams.toString()
    if (queryString) {
      path += `?${queryString}`
    }

    return this.http.get(path).then(response => {
      if (response.status === 200 && response.data) {
        return {
          total: response.data.data.total,
          current: response.data.data.current,
          limit: response.data.data.limit,
          data: response.data.data.receiveRequests
        }
      }
      throw new Error(response.message || 'Failed to fetch receive requests')
    })
  },

  confirmRequestGift(id, status = 'accepted') {
    return this.http.patch('/request_gift', {
      _id: id,
      status: status
    })
  },
  rejectRequestGift(id) {
    return this.http.delete(`/request_gift/${id}`)
  }
}
