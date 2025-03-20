import { notification } from 'antd'

const notifi = {
  success: (message, description) => {
    notification.success({
      message,
      description
    })
  },
  info: (message, description) => {
    notification.info({
      message,
      description
    })
  },
  warning: (message, description) => {
    notification.warning({
      message,
      description
    })
  },
  error: (message, description) => {
    notification.error({
      message,
      description
    })
  }
}

export default notifi
