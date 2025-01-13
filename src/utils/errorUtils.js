export const handleApiError = error => {
  if (error.response) {
    // Lỗi từ server trả về
    const { status, data } = error.response
    switch (status) {
      case 400:
        return 'Yêu cầu không hợp lệ'
      case 401:
        return 'Chưa xác thực'
      case 403:
        return 'Từ chối quyền truy cập'
      case 404:
        return 'Không tìm thấy tài nguyên'
      case 500:
        return 'Lỗi hệ thống'
      default:
        return data.message || 'Đã có lỗi xảy ra'
    }
  } else if (error.request) {
    // Lỗi mạng
    return 'Không thể kết nối đến máy chủ'
  } else {
    // Lỗi khác
    return error.message || 'Lỗi không xác định'
  }
}

export const logError = (error, context = '') => {
  console.error(`Error in ${context}:`, error)
  // Có thể tích hợp logging service như Sentry
}

export const timeoutPromise = (timeout = 5000) => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject({
        response: {
          data: {
            status: 408,
            message: 'Timeout: Đăng nhập quá thời gian, vui lòng thử lại!'
          }
        }
      })
    }, timeout)
  })
}
