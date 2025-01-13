import { createApi } from 'utils/apiUtils'

const giftRequestService = {
  http: createApi(),

  requestGift(requestData) {
    return this.http.post('/request_gift', requestData)
  },
  checkRequestedGift({ post_id, user_req_id }) {
    return this.http.get('request_gift', {
      params: { post_id, user_req_id }
    })
  },
  getMyRequestedGift() {
    return this.http.get('/request_gift/me')
  },
  getPostReceiveRequestService({ current = 1, pageSize = 10 }) {
    let path = '/request_gift'
    const queryParams = new URLSearchParams()

    queryParams.append('current', current)
    queryParams.append('pageSize', pageSize)
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

export default giftRequestService
