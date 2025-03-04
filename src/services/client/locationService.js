import { createApi } from 'utils/apiUtils'

export const locationService = {
  http: createApi(),

  getProvince() {
    return this.http.get('/locations/vietnameses-provinces')
  },
  getCity() {
    return this.http.get('/locations/vietnamese-city')
  }
}
