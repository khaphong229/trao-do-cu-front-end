import axios from 'axios'
import { getAuthToken, removeItem } from './localStorageUtils'
import URL_SERVER from 'config/url_server'

// const BASE_URL = process.env.REACT_APP_API_BASE_URL

export const createApi = () => {
  const instance = axios.create({
    baseURL: URL_SERVER,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  instance.interceptors.request.use(
    config => {
      const token = getAuthToken()
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
      }
      return config
    },
    error => Promise.reject(error)
  )

  instance.interceptors.response.use(
    response => {
      // console.log(response, 'axi')
      return response
    },
    error => {
      if (error.response && error.response.status === 401) {
        removeItem('token')
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
      }
      return Promise.reject(error)
    }
  )

  return instance
}
