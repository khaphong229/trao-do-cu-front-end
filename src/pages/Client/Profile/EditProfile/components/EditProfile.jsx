import React, { useEffect, useState } from 'react'
import { Tabs, Input, Button, Card, Typography, Select, Checkbox, Layout, message } from 'antd'
import { FacebookOutlined, GoogleOutlined, AppleOutlined } from '@ant-design/icons'
import styles from '../scss/EditProfile.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { changePassWord, updateUserProfile } from '../../../../../features/auth/authThunks'
import { Content } from 'antd/es/layout/layout'

const { Title } = Typography
const { TabPane } = Tabs

const EditProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [savePassword, setSavePassword] = useState(false)

  const dispatch = useDispatch()
  const {
    user: userData,
    isLoading,
    error,
    changePassWordSuccess,
    changePassWordMessage
  } = useSelector(state => state.auth)

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || '',
        gender: userData.gender || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    }
  }, [userData])

  const handleInputChange = e => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = value => {
    setFormData(prev => ({ ...prev, gender: value }))
  }

  const handleUpdateMe = () => {
    dispatch(updateUserProfile(formData))
    console.log('FormData:', formData)
  }

  const handleChangePassword = e => {
    const { id, value } = e.target
    const fieldName =
      id === 'current-password' ? 'currentPassword' : id === 'new-password' ? 'newPassword' : 'confirmPassword'
    setFormData(prev => ({ ...prev, [fieldName]: value }))
  }

  const handleSubmitPassword = e => {
    e.preventDefault()
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      console.error('Vui lòng nhập đầy đủ thông tin!')
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      console.error('Mật khẩu mới và xác nhận mật khẩu không khớp!')
      return
    }

    dispatch(changePassWord({ currentPassword: formData.currentPassword, newPassword: formData.newPassword }))
      .unwrap()
      .then(() => {
        // Hiển thị thông báo thành công
        message.success('Đổi mật khẩu thành công!')
      })
      .catch(err => {
        // Hiển thị thông báo lỗi nếu có
        message.error(err.message || 'Đã xảy ra lỗi khi đổi mật khẩu!')
      })
    console.log('Payload gửi đi:', { password: formData.currentPassword, new_password: formData.newPassword })
  }

  return (
    <div className={styles['personal-info-wrapper']}>
      <Tabs defaultActiveKey="personal">
        <TabPane tab="Thông tin cá nhân" key="personal">
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
              <label htmlFor="email">Email</label>
              <Input id="email" value={formData.email} readOnly />
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
            <div className={styles['form-actions1']}>
              <Button type="primary" block style={{ width: '100px' }} onClick={handleUpdateMe}>
                Thay đổi
              </Button>
            </div>
          </Card>
        </TabPane>

        <TabPane tab="Cài đặt tài khoản" key="security">
          <Layout className={styles['form-design-layout']}>
            <Content className={styles['form-design-content']}>
              <div className={styles['form-design-header']}>
                <h2>Thay đổi mật khẩu</h2>
              </div>

              <form onSubmit={handleSubmitPassword} className={styles['form-design']}>
                <div className={styles['form-item']}>
                  <label htmlFor="current-password">Mật khẩu hiện tại</label>
                  <Input.Password
                    id="current-password"
                    placeholder="Nhập mật khẩu hiện tại"
                    value={formData.currentPassword}
                    onChange={handleChangePassword}
                  />
                </div>

                <div className={styles['form-item']}>
                  <label htmlFor="new-password">Mật khẩu mới</label>
                  <Input.Password
                    id="new-password"
                    placeholder="Nhập mật khẩu mới"
                    value={formData.newPassword}
                    onChange={handleChangePassword}
                  />
                </div>

                <div className={styles['form-item']}>
                  <label htmlFor="confirm-password">Xác nhận mật khẩu mới</label>
                  <Input.Password
                    id="confirm-password"
                    placeholder="Xác nhận mật khẩu mới"
                    value={formData.confirmPassword}
                    onChange={handleChangePassword}
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
        </TabPane>

        <TabPane tab="Liên kết mạng xã hội" key="linksocialmedia">
          <Card className={styles['social-links-card']}>
            <div className={styles['card-header']}>
              <h2 className={styles['card-title']}>Liên kết mạng xã hội</h2>
              <p className={styles['description']}>
                Những thông tin dưới đây chỉ mang tính xác thực. Người dùng khác sẽ không thể thấy thông tin này.
              </p>
            </div>
            <Button
              type="primary"
              icon={<FacebookOutlined />}
              className={styles['link-button']}
              size="large"
              shape="round"
              block
            >
              Liên kết với Facebook
            </Button>
            <Button
              type="primary"
              icon={<GoogleOutlined />}
              className={styles['link-button']}
              size="large"
              shape="round"
              block
            >
              Đăng nhập với Google
            </Button>
            <Button
              type="primary"
              icon={<AppleOutlined />}
              className={styles['link-button']}
              size="large"
              shape="round"
              block
            >
              Liên kết với Apple ID
            </Button>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  )
}

export default EditProfile
