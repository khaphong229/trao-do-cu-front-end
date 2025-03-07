const { createApi } = require('utils/apiUtils')

const categoryService = {
  http: createApi(),

  getAllCategory() {
    return this.http.get('/posts/category')
  }
}

export default categoryService
