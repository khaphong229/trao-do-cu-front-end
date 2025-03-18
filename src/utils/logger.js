const isDevelopment = process.env.REACT_APP_BUILD_MODE === 'dev'

const logger = {
  log: (...args) => {
    if (isDevelopment) {
      console.log(...args)
    }
  },
  warn: (...args) => {
    if (isDevelopment) {
      console.warn(...args)
    }
  },
  error: (...args) => {
    if (isDevelopment) {
      console.error(...args)
    }
  }
}

export default logger
