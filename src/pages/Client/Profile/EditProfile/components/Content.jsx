import React, { useEffect, useState } from 'react'
import { Input, Button, Card, Typography, Select, Checkbox, Layout } from 'antd'
import { FacebookOutlined, GoogleOutlined, AppleOutlined } from '@ant-design/icons'
import styles from '../scss/EditProfile.module.scss'
import TextArea from 'antd/es/input/TextArea'
import { changePassWord, updateUserProfile } from '../../../../../features/auth/authThunks'
import { useDispatch, useSelector } from 'react-redux'
const { Title } = Typography
const { Content } = Layout

const ContentComponent = ({ activeTab }) => {
  const dispatch = useDispatch()
  const {
    user: userData,
    isLoading,
    error,
    changePassWordSuccess,
    changePassWordMessage
  } = useSelector(state => state.auth)

  const [savePassword, setSavePassword] = useState(false)
  const [formData, setFormData] = useState({
    name: userData?.name || '', // Hiển thị mặc định
    email: userData?.email || '', // Hiển thị mặc định
    gender: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Cập nhật formData khi Redux store thay đổi
  useEffect(() => {
    if (userData) {
      setFormData(prev => ({
        ...prev,
        name: userData.name || '',
        email: userData.email || '',
        address: userData.address || '',
        phone: userData.phone || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }))
    }
  }, [userData])

  const handleInputChange = e => {
    const { id, value } = e.target
    setFormData({ ...formData, [id]: value })
  }

  const handleSelectChange = value => {
    setFormData({ ...formData, gender: value })
  }

  const handleUpdateMe = () => {
    dispatch(updateUserProfile(formData))
    console.log('FormData:', formData)
  }
  const handleChange = e => {
    const { id, value } = e.target
    // Convert từ kebab-case sang camelCase
    const fieldName =
      id === 'current-password' ? 'currentPassword' : id === 'new-password' ? 'newPassword' : 'confirmPassword'

    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }))
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      console.error('Vui lòng nhập đầy đủ thông tin!')
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      console.error('Mật khẩu mới và xác nhận mật khẩu không khớp!')
      return
    }

    dispatch(
      changePassWord({
        currentPassword: formData.currentPassword, // Mật khẩu cũ
        newPassword: formData.newPassword // Mật khẩu mới
      })
    )
    console.log('Payload gửi đi:', {
      password: formData.currentPassword,
      new_password: formData.newPassword
    })
  }

  return (
    <div className={styles.content}>
      {/* Hồ sơ cá nhân */}
      {activeTab === 'personal' && (
        <>
          <Card className={styles.card}>
            <Title level={3}>Hồ sơ cá nhân</Title>
            <div className={styles['form-group']}>
              <label htmlFor="fullname">Họ và tên</label>
              <Input id="fullname" value={formData.name} onChange={handleInputChange} />
            </div>
            <div className={styles['form-group']}>
              <label htmlFor="phone">Số điện thoại</label>
              <Input id="phone" placeholder="Nhập số điện thoại" value={formData.phone} onChange={handleInputChange} />
            </div>
            <div className={styles['form-group']}>
              <label htmlFor="address">Địa chỉ</label>
              <Input id="address" placeholder="Nhập địa chỉ" value={formData.address} onChange={handleInputChange} />
            </div>
            <div className={styles['form-group']}>
              <label htmlFor="bio">Giới thiệu</label>
              <TextArea id="bio" rows={4} placeholder="Giới thiệu bản thân" />
            </div>
            <div className={styles['form-group']}>
              <label htmlFor="nickname">Tên gọi nhớ</label>
              <Input id="nickname" placeholder="Nhập tên gọi nhớ" />
            </div>
          </Card>

          <Card className={styles.card}>
            <Title level={3}>Thông tin bảo mật</Title>
            <div className={styles['form-group']}>
              <label htmlFor="email">Email</label>
              <Input id="email" defaultValue={formData.email} readOnly />
            </div>
            <div className={styles['form-group']}>
              <label htmlFor="gender">Giới tính</label>
              <Select
                id="gender"
                defaultValue="Nam"
                style={{ width: '100%' }}
                onChange={handleSelectChange}
                value={formData.gender}
              >
                <Select.Option value="Nam">Nam</Select.Option>
                <Select.Option value="Nữ">Nữ</Select.Option>
                <Select.Option value="Khác">Khác</Select.Option>
              </Select>
            </div>
            <div className={styles['form-group']}>
              <label htmlFor="dob">Ngày, tháng, năm sinh</label>
              <Input id="dob" type="date" />
            </div>
            <Button type="primary" block style={{ width: '100px' }} onClick={handleUpdateMe}>
              Thay đổi
            </Button>
          </Card>
        </>
      )}

      {/* Thông tin bảo mật */}
      {activeTab === 'security' && (
        <Layout className={styles['form-design-layout']}>
          <Content className={styles['form-design-content']}>
            <div className={styles['form-design-header']}>
              <h2>Thay đổi mật khẩu</h2>
            </div>

            <form onSubmit={handleSubmit} className={styles['form-design-form']}>
              <div className={styles['form-item']}>
                <label htmlFor="current-password">Mật khẩu hiện tại</label>
                <Input.Password
                  id="current-password"
                  placeholder="Nhập mật khẩu hiện tại"
                  value={formData.currentPassword}
                  onChange={handleChange}
                />
              </div>

              <div className={styles['form-item']}>
                <label htmlFor="new-password">Mật khẩu mới</label>
                <Input.Password
                  id="new-password"
                  placeholder="Nhập mật khẩu mới"
                  value={formData.newPassword}
                  onChange={handleChange}
                />
              </div>

              <div className={styles['form-item']}>
                <label htmlFor="confirm-password">Xác nhận mật khẩu mới</label>
                <Input.Password
                  id="confirm-password"
                  placeholder="Xác nhận mật khẩu mới"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>

              <div className={styles['form-actions']}>
                <Checkbox checked={savePassword} onChange={e => setSavePassword(e.target.checked)}>
                  Lưu mật khẩu mới
                </Checkbox>
                <Button type="primary" htmlType="submit" loading={isLoading}>
                  ĐỔI MẬT KHẨU
                </Button>
              </div>

              {error && (
                <div className={styles['error']}>
                  {error.message}
                  {error.detail?.password && <p>{error.detail.password}</p>}
                  {error.detail?.new_password && <p>{error.detail.new_password}</p>}
                </div>
              )}

              {changePassWordSuccess && <div className={styles['success']}>{changePassWordMessage}</div>}
            </form>
          </Content>
        </Layout>
      )}
      {activeTab === 'linksocialmedia' && (
        <Card className={styles['social-links-card']}>
          <div className={styles['card-header']}>
            <h2 className={styles['card-title']}>Liên kết mạng xã hội</h2>
            <p className={styles['description']}>
              Những thông tin dưới đây chỉ mang tính xác thực. Người dùng khác sẽ không thể thấy thông tin này.
            </p>
          </div>
          <div className={styles['link-buttons']}>
            <Button
              type="primary"
              icon={<FacebookOutlined />}
              className={styles['link-button facebook']}
              size="large"
              shape="round"
              block
            >
              Liên kết với Facebook
            </Button>
            <Button
              type="primary"
              icon={<GoogleOutlined />}
              className={styles['link-button google']}
              size="large"
              shape="round"
              block
            >
              Đăng nhập với Google
            </Button>
            <Button
              type="primary"
              icon={<AppleOutlined />}
              className={styles['link-button apple']}
              size="large"
              shape="round"
              block
            >
              Liên kết với Apple ID
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}

export default ContentComponent
