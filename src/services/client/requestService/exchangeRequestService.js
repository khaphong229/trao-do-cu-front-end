import { createApi } from 'utils/apiUtils'

const exchangeRequestService = {
  http: createApi(),

  requestExchange(requestData) {
    return this.http.post('/request_exchange', requestData)
  },
  checkRequestedExchange({ post_id, user_req_id }) {
    return this.http.get('request_exchange', {
      params: { post_id, user_req_id }
    })
  },
  getMyRequestedExchange(status) {
    let path = '/request_exchange/me'
    if (status !== null) {
      path += `?status=${status}`
    }
    return this.http.get(path)
  },

  getExchangeRequests: function ({ current = 1, pageSize = 10, post_id, status, statusPotsId }) {
    let path = '/request_exchange'
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
      if (response.status === 200) {
        const exchangeData = Array.isArray(response.data) ? response.data : response.data.data

        return {
          status: response.status,
          data: exchangeData
        }
      }
      throw new Error(response.message || 'Failed to fetch exchange requests')
    })
  },
  confirmRequestExchange(id, status = 'accepted') {
    return this.http.patch('/request_exchange', {
      _id: id,
      status: status
    })
  },
  rejectRequestExchange(id) {
    return this.http.delete(`/request_exchange/${id}`)
  }
}

export default exchangeRequestService
