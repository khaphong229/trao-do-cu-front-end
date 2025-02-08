import { message } from 'antd'
import { getCurrentUser, loginGoogle } from 'features/auth/authThunks'
import React, { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { setAuthToken } from 'utils/localStorageUtils'

export default function LoginGoogle() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const fetch = useCallback(async () => {
    try {
      const response = await dispatch(loginGoogle(id)).unwrap()
      const { status } = response
      if (status === 200) {
        setAuthToken(response.data.access_token)
        const responseGetUser = await dispatch(getCurrentUser(false)).unwrap()
        if (responseGetUser) {
          message.success('Đăng nhập thành công')
          navigate('/')
        }
      }
    } catch (error) {
      message.error('Đăng nhập thất bại! Vui lòng thử lại.')
    }
  }, [dispatch, id, navigate])

  useEffect(() => {
    fetch()
  }, [fetch])

  return <div>Hello</div>
}
