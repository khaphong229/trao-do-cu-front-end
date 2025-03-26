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
  getMyRequestedGift(params = {}) {
    const { status = null, pageSize = 10, current = 1 } = params
    let path = `/request_gift/me?pageSize=${pageSize}&current=${current}`

    if (status !== null) {
      path += `&status=${status}`
    }

    return this.http.get(path)
  },
  getReceiveRequest({ current = 1, pageSize = 10, post_id = '', status, statusPotsId }) {
    let path = '/request_gift'
    const queryParams = new URLSearchParams()

    queryParams.append('current', current)
    queryParams.append('pageSize', pageSize)
    queryParams.append('post_id', post_id)
    if (status) {
      queryParams.append('status', 'pending')
    }
    if (statusPotsId) {
      queryParams.append('statusPotsId', 'active')
    }

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
  rejectedRequestGift(id, status = 'rejected') {
    return this.http.patch('/request_gift', {
      _id: id,
      status: status
    })
  },
  rejectRequestGift(id) {
    return this.http.delete(`/request_gift/${id}`)
  },
  getCountReceive(id) {
    return this.http.get(`/request_gift/requesters-count/${id}`)
  }
}

export default giftRequestService
