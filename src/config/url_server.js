const URL_SERVER =
  process.env.REACT_APP_BUILD_MODE === 'production'
    ? process.env.REACT_APP_API_BASE_URL_PROD
    : process.env.REACT_APP_API_BASE_URL_DEV

export default URL_SERVER

export const URL_SERVER_IMAGE = URL_SERVER + '/static/'
