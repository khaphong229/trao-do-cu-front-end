const { createApi } = require('utils/apiUtils')

export const getExchangeRequestService = {
  http: createApi(),

  getExchangeRequests: function () {
    let path = '/request_exchange'
    const queryParams = new URLSearchParams()
    queryParams.append('pageSize', 10000)

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
