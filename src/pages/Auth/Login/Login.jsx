import React from 'react'
import '../styles.scss'
import { useDispatch } from 'react-redux'
import { Form, Input, Button, Checkbox, message, Divider } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { getCurrentUser, loginUser } from '../../../features/auth/authThunks'

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

      // console.log(responseLogin, 'res login')

      if (responseLogin.status === 200) {
        const responseGetUser = await dispatch(getCurrentUser(isAdminLogin)).unwrap()
        if (responseGetUser) {
          message.success('Đăng nhập thành công')
          navigate(isAdminLogin ? '/admin/dashboard' : '/')
        }
      }
    } catch (error) {
      const { message: msg } = error
      if (error.status === 400) {
        message.error(msg)
      } else if (error.status === 403) {
        message.error('Không có quyền truy cập')
      } else {
        message.error(error.message || 'Đăng nhập thất bại')
      }
    }
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
            }
          ]}
        >
          <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder="Mật khẩu" />
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Ghi nhớ</Checkbox>
          </Form.Item>

          <Link className="loginFormForgot" to="/">
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
              <Button type="default" className="authFormButton">
                <Link to="/register">Đăng ký ngay</Link>
              </Button>
            </>
          )}
        </Form.Item>
      </Form>
    </div>
  )
}

export default Login
