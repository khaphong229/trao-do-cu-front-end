import { createApi } from 'utils/apiUtils'

const postRatingService = {
  http: createApi(),

  getPostRating(userId) {
    // Add userId parameter
    return this.http.get(`/request_gift/all-requests?userId=${userId}`) // Add userId as query parameter
  }
}

export default postRatingService
