import { createApi } from 'utils/apiUtils'

const surveyService = {
  http: createApi(),

  getSurvey() {
    return this.http.get('/user-interests')
  },

  updateSurvey(data) {
    return this.http.put('/user-interests', data)
  },

  updateSurveyStatus() {
    return this.http.put('/surveys/update-status')
  }
}

export default surveyService
