import React, { useState, useEffect } from 'react'
import { Form, Input, Button, message } from 'antd'
import { MailOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import '../styles.scss'
import { clearChangePassWordState } from 'features/auth/authSlice'
import { forgotPassword } from 'features/auth/authThunks'

const ForgotPassword = () => {
  const dispatch = useDispatch()
  const { isLoading, changePassWordSuccess, changePassWordMessage, error } = useSelector(state => state.auth)

  // Clear states when component unmounts or when success/error needs to be reset
  useEffect(() => {
    return () => {
      dispatch(clearChangePassWordState())
    }
  }, [dispatch])

  // Handle success or error messages
  useEffect(() => {
    if (changePassWordSuccess) {
      message.success(changePassWordMessage || 'Nếu email tồn tại, một liên kết đặt lại mật khẩu đã được gửi.')
      // Optional: redirect after success
      // history.push('/login')
    }
    if (error) {
      message.error(error)
    }
  }, [changePassWordSuccess, changePassWordMessage, error])

  const onFinish = values => {
    dispatch(forgotPassword(values.email))
  }

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <h2>Quên Mật Khẩu</h2>
        <p>Nhập email của bạn để nhận liên kết đặt lại mật khẩu.</p>
        <Form name="forgot_password" onFinish={onFinish} layout="vertical">
          <Form.Item
            name="email"
            rules={[
              {
                type: 'email',
                message: 'Dữ liệu nhập không hợp lệ!'
              },
              {
                required: true,
                message: 'Vui lòng nhập email!'
              },
              {
                min: 10,
                message: 'Email tối thiểu 10 kí tự.'
              }
            ]}
          >
            <Input
              prefix={<MailOutlined className="site-form-item-icon" />}
              placeholder="Nhập email của bạn"
              className="custom-input"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading} block className="submit-button">
              Gửi Yêu Cầu
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default ForgotPassword
