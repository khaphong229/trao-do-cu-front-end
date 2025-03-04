const AUTH_TOKEN_STORE_KEY = 'token'
const INTERACTION_USER = 'interactionUser'

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

export const setInteractionUser = interactions => {
  try {
    const interactionsString = JSON.stringify(interactions)
    localStorage.setItem('interactionUser', interactionsString)
  } catch (error) {
    console.error('Error saving interactions to localStorage:', error)
  }
}

export const getInteractionUser = () => {
  try {
    const interactionsString = localStorage.getItem('interactionUser')
    return interactionsString ? JSON.parse(interactionsString) : []
  } catch (error) {
    console.error('Error retrieving interactions from localStorage:', error)
    return []
  }
}

export const removeInteractionUser = () => {
  localStorage.removeItem(INTERACTION_USER)
}

export const setCategories = categories => {
  try {
    const categoriesString = JSON.stringify(categories)
    localStorage.setItem('categories', categoriesString)
  } catch (error) {
    console.error(error)
  }
}

export const getCategories = () => {
  try {
    const categoriesString = localStorage.getItem('categories')
    return categoriesString ? JSON.parse(categoriesString) : []
  } catch (error) {
    console.error(error)
    return []
  }
}
