const AUTH_TOKEN_STORE_KEY = 'token'

export const removeAuthToken = () => {
  return localStorage.removeItem(AUTH_TOKEN_STORE_KEY)
}

export const removeItem = name => {
  return localStorage.removeItem(name)
}

export const setAuthToken = token => {
  localStorage.setItem(AUTH_TOKEN_STORE_KEY, token)
}

export const getAuthToken = () => {
  return localStorage.getItem(AUTH_TOKEN_STORE_KEY)
}

export const removeToken = tokenKey => {
  localStorage.removeItem(tokenKey)
}

export const hasAuthToken = () => {
  return !!getAuthToken()
}
