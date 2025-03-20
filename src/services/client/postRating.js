import { createApi } from 'utils/apiUtils'

const postRatingService = {
  http: createApi(),

  getPostRating() {
    return this.http.get('/request_gift/all-requests')
  }
}

export default postRatingService
