import React from 'react'
import { Form, Input, Checkbox, Button, Divider, message } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { registerUser } from 'features/auth/authThunks'

const Register = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const onFinish = async values => {
    const dataRegister = {
      name: values.name,
      email: values.email,
      password: values.password
    }
    try {
      const response = await dispatch(registerUser(dataRegister)).unwrap()
      const { status, message: msg } = response
      if (status === 201) {
        message.success(msg)
        navigate('/login')
      }
    } catch (error) {
      if (error.status === 400) {
        Object.values(error.detail).forEach(val => {
          message.error(val)
        })
      }
    }
  }

  return (
    <div className="authWrap">
      <h2 className="authHeading">Đăng ký</h2>
      <Form className="authForm" form={form} name="register" layout="vertical" onFinish={onFinish} scrollToFirstError>
        <Form.Item
          name="name"
          label="Tên tài khoản"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập tên tài khoản!'
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              type: 'email',
              message: 'Dữ liệu nhập không hợp lệ!'
            },
            {
              required: true,
              message: 'Vui lòng nhập email!'
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập mật khẩu!'
            }
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="Xác nhận mật khẩu"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Vui lòng xác nhận lại mật khẩu!'
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
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="agreement"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) => (value ? Promise.resolve() : Promise.reject('Vui lòng chấp nhận điều khoản'))
            }
          ]}
        >
          <Checkbox>
            Xác nhận{' '}
            <Link to="/" className="registerAgreement">
              điều khoản
            </Link>
          </Checkbox>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="authFormButton">
            Đăng ký
          </Button>
          <Divider plain>hoặc</Divider>
          <Button type="default" className="authFormButton">
            <Link to="/login">Đăng nhập</Link>
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Register
