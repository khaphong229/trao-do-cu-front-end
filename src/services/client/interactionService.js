import { createApi } from 'utils/apiUtils'

export const interactionService = {
  http: createApi(),

  addInteraction(data) {
    return this.http.post('/user-interactions/batch', data)
  }
}
