const { createApi } = require('utils/apiUtils')

const categoryService = {
  http: createApi(),

  getAllCategory() {
    return this.http.get('/admin/category')
  }
}

export default categoryService
