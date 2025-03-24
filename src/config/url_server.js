const URL_SERVER =
  process.env.REACT_APP_BUILD_MODE === 'production'
    ? process.env.REACT_APP_API_BASE_URL_PROD
    : process.env.REACT_APP_API_BASE_URL_DEV

export default URL_SERVER

export const URL_CLIENT =
  process.env.REACT_APP_BUILD_MODE === 'production' ? 'https://traodocu.vn' : 'http://localhost:3000'

export const URL_SERVER_IMAGE = URL_SERVER + '/static/'

export const SITE_KEY = process.env.REACT_APP_API_SITE_KEY

export const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID
