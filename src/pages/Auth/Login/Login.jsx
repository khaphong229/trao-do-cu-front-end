import React from 'react'
import '../styles.scss'
import { useDispatch } from 'react-redux'
import { Form, Input, Button, Checkbox, message, Divider } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { getCurrentUser, loginUser, loginWithGoogle } from '../../../features/auth/authThunks'
import { GoogleLogin } from '@react-oauth/google'

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const isAdminLogin = location.pathname.includes('/admin/login')

  const onFinish = async values => {
    const { email, password } = values

    try {
      const responseLogin = await dispatch(
        loginUser({
          email,
          password,
          isAdmin: isAdminLogin
        })
      ).unwrap()

      if (responseLogin.status === 200) {
        const responseGetUser = await dispatch(getCurrentUser(isAdminLogin)).unwrap()
        if (responseGetUser) {
          message.success('Đăng nhập thành công')
          const isSurvey = responseGetUser?.data?.isSurveyed
          navigate(isAdminLogin ? '/admin/dashboard' : isSurvey ? '/' : '/survey')
        }
      }
    } catch (error) {
      const { message: msg, status } = error
      if (status === 408) {
        message.error(msg)
      } else if (error.status === 400) {
        message.error(msg)
      } else if (error.status === 403) {
        message.error('Không có quyền truy cập')
      } else {
        message.error(error.message || 'Đăng nhập thất bại')
      }
    }
  }

  const handleGoogleLoginSuccess = async credentialResponse => {
    try {
      // Send the token ID to your backend
      const responseLogin = await dispatch(
        loginWithGoogle({
          credential: credentialResponse.credential,
          isAdmin: isAdminLogin
        })
      ).unwrap()

      if (responseLogin.status === 200) {
        const responseGetUser = await dispatch(getCurrentUser(isAdminLogin)).unwrap()
        if (responseGetUser) {
          message.success('Đăng nhập thành công')
          const isSurvey = responseGetUser?.data?.isSurveyed
          navigate(isAdminLogin ? '/admin/dashboard' : isSurvey ? '/' : '/survey')
        }
      }
    } catch (error) {
      message.error('Đăng nhập Google thất bại! Vui lòng thử lại.')
    }
  }

  const handleGoogleLoginError = () => {
    message.error('Đăng nhập Google thất bại! Vui lòng thử lại.')
  }

  return (
    <div className="authWrap">
      <h2 className="authHeading">{isAdminLogin ? 'Đăng nhập ADMIN' : 'Đăng nhập'}</h2>
      <Form name="normal_login" className="authForm" initialValues={{ remember: true }} onFinish={onFinish}>
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập email!'
            },
            {
              type: 'email',
              message: 'Vui lòng nhập email hợp lệ!'
            },
            {
              min: 10,
              message: 'Email tối thiểu 10 kí tự.'
            }
          ]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
        </Form.Item>
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
        >
          <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder="Mật khẩu" />
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Ghi nhớ</Checkbox>
          </Form.Item>

          <Link className="loginFormForgot" to="/forgot-password">
            Quên mật khẩu
          </Link>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="authFormButton">
            Đăng nhập
          </Button>
          {isAdminLogin || (
            <>
              <Divider plain>hoặc</Divider>
              <div className="google-login-button">
                <GoogleLogin
                  onSuccess={handleGoogleLoginSuccess}
                  onError={handleGoogleLoginError}
                  useOneTap
                  shape="rectangular"
                  text="continue_with"
                  width="100%"
                />
              </div>
              <p style={{ width: '100%', textAlign: 'center' }}>
                Bạn chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
              </p>
            </>
          )}
        </Form.Item>
      </Form>
    </div>
  )
}

export default Login
