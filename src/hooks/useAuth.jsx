import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const withAuth = WrappedComponent => {
  return props => {
    const navigate = useNavigate()
    const { isAuthenticated } = useSelector(state => state.auth)

    const handleClick = e => {
      if (!isAuthenticated) {
        // Chuyển hướng sang trang login nếu chưa xác thực
        navigate('/login')
        return
      }

      // Nếu đã xác thực, thực hiện onClick ban đầu
      if (props.onClick) {
        props.onClick(e)
      }
    }

    return <WrappedComponent {...props} onClick={handleClick} />
  }
}

export default withAuth
