const { createApi } = require('utils/apiUtils')

const UploadService = {
  http: createApi(),

  uploadImage(files, type = 'post') {
    const formData = new FormData()

    // If files is an array, append each file to the same field name
    if (Array.isArray(files)) {
      files.forEach(file => {
        formData.append(type, file)
      })
    }
    // If it's a single file
    else {
      formData.append(type, files)
    }

    return this.http.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

export default UploadService
