import { createApi } from 'utils/apiUtils'

const surveyService = {
  http: createApi(),

  saveFavouriteCategory(data) {
    return this.http.post('/survey/save', data)
  }
}

export default surveyService
