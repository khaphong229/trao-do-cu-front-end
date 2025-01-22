const { createApi } = require('utils/apiUtils')

const UploadService = {
  http: createApi(),

  uploadImage(dataUpload, type = 'post') {
    const formData = new FormData()
    formData.append(type, dataUpload)
    return this.http.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

export default UploadService
