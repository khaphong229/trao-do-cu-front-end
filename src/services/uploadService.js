const { createApi } = require('utils/apiUtils')

const UploadService = {
  http: createApi(),

  uploadImage(dataUpload) {
    const formData = new FormData()
    formData.append('post', dataUpload)
    return this.http.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

export default UploadService
