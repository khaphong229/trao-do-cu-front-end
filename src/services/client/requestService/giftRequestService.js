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
  }
}

export default giftRequestService
