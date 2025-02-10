import React, { useEffect, useState } from 'react'
import { Modal, Form, Input, Select, DatePicker, Button, Row, Col, message, Upload } from 'antd'
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  GlobalOutlined,
  InboxOutlined
} from '@ant-design/icons'
import moment from 'moment'
import { useDispatch } from 'react-redux'
import { createUser, updateUser } from '../../../../../features/admin/user/userThunks'

const { Option } = Select
const { Dragger } = Upload

const UserFormModal = ({ visible, isEditing, initialUser, onClose }) => {
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const [avatarFile, setAvatarFile] = useState(null)

  useEffect(() => {
    if (visible && initialUser) {
      form.setFieldsValue({
        ...initialUser,
        birth_date: initialUser.birth_date ? moment(initialUser.birth_date) : null
      })
    } else if (!visible) {
      form.resetFields()
      setAvatarFile(null)
    }
  }, [visible, initialUser, form])

  const handleSubmit = values => {
    const submitData = {
      ...values,
      birth_date: values.birth_date ? values.birth_date.format('YYYY-MM-DD') : null,
      avatar: avatarFile
    }

    if (isEditing) {
      dispatch(
        updateUser({
          userId: initialUser._id,
          userData: submitData
        })
      )
        .then(() => {
          message.success('Cập nhật người dùng thành công')
          onClose()
        })
        .catch(() => message.error('Cập nhật người dùng thất bại'))
    } else {
      dispatch(createUser(submitData))
        .then(() => {
          message.success('Thêm người dùng thành công')
          onClose()
        })
        .catch(() => message.error('Thêm người dùng thất bại'))
    }
  }

  const handleAvatarUpload = info => {
    const { status } = info.file
    if (status === 'done') {
      setAvatarFile(info.file.originFileObj)
      message.success(`${info.file.name} file uploaded successfully.`)
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`)
    }
  }

  return (
    <Modal
      title={isEditing ? 'Chỉnh sửa người dùng' : 'Thêm người dùng'}
      open={visible}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="name"
              label="Tên tài khoản"
              rules={[{ required: true, message: 'Vui lòng nhập tên tài khoản' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Nhập tên tài khoản" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập email' },
                { type: 'email', message: 'Email không hợp lệ' }
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Nhập email" />
            </Form.Item>
          </Col>
        </Row>

        {/* Avatar Upload */}
        <Form.Item name="avatar" label="Ảnh đại diện">
          <Dragger name="avatar" multiple={false} onChange={handleAvatarUpload} accept="image/*">
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Nhấp hoặc kéo thả ảnh đại diện vào đây</p>
            <p className="ant-upload-hint">Hỗ trợ tải lên một file ảnh duy nhất</p>
          </Dragger>
        </Form.Item>

        {!isEditing && (
          <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}>
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>
        )}

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
            >
              <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="birth_date" label="Ngày sinh">
              <DatePicker style={{ width: '100%' }} prefix={<CalendarOutlined />} placeholder="Chọn ngày sinh" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item name="gender" label="Giới tính">
              <Select placeholder="Chọn giới tính">
                <Option value="male">Nam</Option>
                <Option value="female">Nữ</Option>
                <Option value="other">Khác</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="product_preferences" label="Sở thích sản phẩm" mode="multiple">
              <Select mode="multiple" placeholder="Chọn các loại sản phẩm yêu thích">
                <Option value="clothing">Quần áo</Option>
                <Option value="electronics">Điện tử</Option>
                <Option value="books">Sách</Option>
                <Option value="sports">Thiết bị thể thao</Option>
                <Option value="beauty">Mỹ phẩm</Option>
                <Option value="home_decor">Đồ gia dụng</Option>
                <Option value="toys">Đồ chơi</Option>
                <Option value="jewelry">Trang sức</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="social_media" label="Mạng xã hội">
          <Input prefix={<GlobalOutlined />} placeholder="Nhập đường dẫn mạng xã hội" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            {isEditing ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default UserFormModal
