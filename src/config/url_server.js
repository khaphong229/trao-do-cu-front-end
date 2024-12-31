const URL_SERVER =
  process.env.REACT_APP_BUILD_MODE === 'production' ? 'https://trao-do-cu-api.onrender.com' : 'http://localhost:3456'

console.log('URL Server:', URL_SERVER)

export default URL_SERVER

export const URL_SERVER_IMAGE = URL_SERVER + '/static/'
