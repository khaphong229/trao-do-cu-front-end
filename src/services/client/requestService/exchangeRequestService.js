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
  getMyRequestedExchange() {
    return this.http.get('/request_exchange/me')
  }
}

export default exchangeRequestService
