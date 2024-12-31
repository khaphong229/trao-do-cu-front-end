// src/config/env.js
const ENV = {
  development: {
    API_URL: 'http://localhost:3000/api',
    DEBUG: true
  },
  production: {
    API_URL: 'https://api.yourapp.com',
    DEBUG: false
  }
}

export const getEnvConfig = () => {
  const env = process.env.NODE_ENV || 'development'
  return ENV[env]
}

export const config = getEnvConfig()
