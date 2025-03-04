import { createApi } from 'utils/apiUtils'

const surveyService = {
  http: createApi(),

  getSurvey() {
    return this.http.get('/user-interests')
  },

  updateSurvey(data) {
    // console.log('Dữ liệu gửi lên API:', JSON.stringify(data)) // Debug
    return this.http.put('/user-interests', data)
  }
}

export default surveyService
