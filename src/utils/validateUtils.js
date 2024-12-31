// src/utils/validationUtils.js
export const validateEmail = email => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(String(email).toLowerCase())
}

export const validatePassword = password => {
  return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password)
}

export const validateForm = (formData, validationRules) => {
  const errors = {}

  Object.keys(validationRules).forEach(field => {
    const rules = validationRules[field]
    const value = formData[field]

    if (rules.required && !value) {
      errors[field] = 'Trường này là bắt buộc'
    }

    if (rules.minLength && value.length < rules.minLength) {
      errors[field] = `Độ dài tối thiểu là ${rules.minLength} ký tự`
    }

    if (rules.email && !validateEmail(value)) {
      errors[field] = 'Email không hợp lệ'
    }

    if (rules.password && !validatePassword(value)) {
      errors[field] = 'Mật khẩu yếu'
    }
  })

  return errors
}
