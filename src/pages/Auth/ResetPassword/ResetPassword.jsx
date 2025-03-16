import React, { useState, useEffect } from 'react'
import { Form, Input, Button, message, Result } from 'antd'
import { LockOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from './resetPassword.module.scss'
import { clearChangePassWordState } from 'features/auth/authSlice'
import { resetPassword } from 'features/auth/authThunks'

const ResetPassword = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [token, setToken] = useState('')
  const { isLoading, changePassWordSuccess, changePassWordMessage, error } = useSelector(state => state.auth)
  const [invalidToken, setInvalidToken] = useState(false)

  useEffect(() => {
    // Extract token from URL query parameters
    const searchParams = new URLSearchParams(location.search)
    const tokenFromUrl = searchParams.get('token')

    if (!tokenFromUrl) {
      setInvalidToken(true)
    } else {
      setToken(tokenFromUrl)
    }
  }, [location])

  useEffect(() => {
    return () => {
      dispatch(clearChangePassWordState())
    }
  }, [dispatch])

  useEffect(() => {
    if (changePassWordSuccess) {
      message.success(changePassWordMessage || 'Mật khẩu đã được đặt lại thành công!')
      // Redirect to login page after successful password reset
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    }

    if (error) {
      message.error(error)
    }
  }, [changePassWordSuccess, changePassWordMessage, error, navigate])

  const onFinish = values => {
    if (values.password !== values.confirmPassword) {
      message.error('Mật khẩu xác nhận không khớp!')
      return
    }

    dispatch(
      resetPassword({
        token: token,
        password: values.password
      })
    )
  }

  if (invalidToken) {
    return (
      <div className={styles['reset-password-container']}>
        <Result
          status="error"
          title="Liên kết không hợp lệ"
          subTitle="Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn."
          extra={[
            <Button type="primary" key="home" onClick={() => navigate('/')}>
              Về Trang Chủ
            </Button>,
            <Button key="forgot" onClick={() => navigate('/forgot-password')}>
              Gửi Lại Yêu Cầu
            </Button>
          ]}
        />
      </div>
    )
  }

  return (
    <div className={styles['reset-password-container']}>
      <div className={styles['reset-password-card']}>
        <h2>Đặt Lại Mật Khẩu</h2>
        <p>Vui lòng nhập mật khẩu mới của bạn.</p>
        <Form name="reset_password" onFinish={onFinish} layout="vertical">
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập mật khẩu!'
              },
              {
                min: 6,
                message: 'Mật khẩu tối thiểu 6 kí tự.'
              }
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Mật khẩu mới"
              className={styles['custom-input']}
            />
          </Form.Item>

          <Form.Item
            name="confirm"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Vui lòng xác nhận lại mật khẩu!'
              },
              {
                min: 6,
                message: 'Mật khẩu tối thiểu 6 kí tự.'
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }

                  return Promise.reject('Mật khẩu không khớp. Vui lòng nhập lại!')
                }
              })
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Xác nhận mật khẩu"
              className={styles['custom-input']}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading} block className={styles['submit-button']}>
              Đặt Lại Mật Khẩu
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default ResetPassword
