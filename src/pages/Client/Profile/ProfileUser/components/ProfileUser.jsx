import { Button, Card, Tabs, Badge, Tooltip, Image, Upload, message, Checkbox, Input, Select } from 'antd'
import {
  ShareAltOutlined,
  MessageOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  EnvironmentOutlined,
  FacebookOutlined,
  TwitterOutlined,
  MailOutlined,
  CameraOutlined,
  GoogleOutlined,
  AppleOutlined
} from '@ant-design/icons'
import Avatar from 'assets/images/logo/avtDefault.webp'
import styles from '../scss/ProfileUser.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import dayjs from 'dayjs'
import { uploadAvatar } from 'features/upload/uploadThunks'
import { useEffect, useState } from 'react'
import { changePassWord, getCurrentUser, updateUserProfile } from 'features/auth/authThunks'

import { URL_SERVER_IMAGE } from 'config/url_server'
import Title from 'antd/es/skeleton/Title'

const { TabPane } = Tabs

const ProfilePage = () => {
  const dispatch = useDispatch()
  const {
    user: userData,
    isLoading,
    error,
    changePassWordSuccess,
    changePassWordMessage
  } = useSelector(state => state.auth)
  const [uploading, setUploading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [savePassword, setSavePassword] = useState(false)
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

  const handleUpdateMe = async () => {
    try {
      const response = await dispatch(updateUserProfile(formData)).unwrap()
      if (response.status === 201) {
        message.success(response.message)
      }
    } catch (error) {
      message.error('Cập nhật thông tin thất bại')
    }
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
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      return
    }

    dispatch(changePassWord({ currentPassword: formData.currentPassword, newPassword: formData.newPassword }))
      .unwrap()
      .then(() => {
        message.success('Đổi mật khẩu thành công!')
      })
      .catch(err => {
        message.error(err.message || 'Đã xảy ra lỗi khi đổi mật khẩu!')
      })
  }

  useEffect(() => {
    if (avatarUrl) {
      const img = new Image()
      img.src = avatarUrl
      img.onload = () => {
        setAvatarUrl(prevUrl => prevUrl)
      }
    }
  }, [avatarUrl])

  const handleCustomUpload = async options => {
    const { file, onSuccess, onError } = options
    try {
      setUploading(true)

      const uploadResponse = await dispatch(uploadAvatar(file)).unwrap()

      if (uploadResponse.success && uploadResponse.files?.[0]) {
        const newAvatarUrl = uploadResponse.files[0].filepath
        const response = await dispatch(
          updateUserProfile({
            avatar: newAvatarUrl
          })
        ).unwrap()
        if (response.status === 201) {
          message.success('Upload ảnh thành công')
          dispatch(getCurrentUser(false))
          onSuccess(uploadResponse)
        } else {
          message.error('Upload ảnh thất bại')
        }
      } else {
        throw new Error('Upload response không hợp lệ')
      }
    } catch (error) {
      // message.error(error.message === 'Bad Request' && 'Đã xảy ra lỗi khi upload ảnh')
      Object.values(error.detail).forEach(err => {
        message.error(err)
      })
      onError(error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <main className={styles['profile-page']}>
      <div className={styles.container}>
        <Card className={styles.card}>
          <div className={styles['profile-header']}>
            <div className={styles['avatar-container']}>
              <Image
                src={
                  userData?.avatar
                    ? userData?.isGoogle
                      ? userData.avatar
                      : `${URL_SERVER_IMAGE}${userData.avatar}`
                    : Avatar
                }
                alt="Ảnh đại diện"
                className={styles.avatar}
                preview={false}
                onError={e => {
                  e.target.src = Avatar
                }}
              />
              <Upload
                name="avatar"
                showUploadList={false}
                accept="image/*"
                customRequest={handleCustomUpload}
                className={styles['avatar-upload']}
              >
                <Button
                  icon={<CameraOutlined />}
                  loading={uploading}
                  className={styles['upload-button']}
                  type="primary"
                  shape="circle"
                />
              </Upload>
            </div>
            <div className={styles['profile-info']}>
              <h1>{userData?.name ? userData.name : 'Tài khoản'}</h1>
              {/* <p className="text-muted">Chưa có đánh giá</p> */}
              {/* <div className={styles.followers}>
                Người theo dõi: <strong>0</strong> • Đang theo dõi: <strong>0</strong>
              </div> */}
            </div>
            <div className={styles['button-group']}>
              <Button type="primary" icon={<ShareAltOutlined />} disabled>
                Chia sẻ trang của bạn
              </Button>
            </div>
          </div>
        </Card>

        <Card className={styles.card}>
          <div className={styles['badges-section']}>
            <Tooltip title="Phản hồi chat">
              <Badge className={styles.badge}>
                <MessageOutlined /> Chưa có thông tin
              </Badge>
            </Tooltip>

            <Tooltip title="Thời gian tham gia">
              <Badge className={styles.badge}>
                <ClockCircleOutlined />{' '}
                {`Đã tham gia: ${
                  dayjs(userData.created_at).isValid() ? dayjs(userData.created_at).fromNow() : 'Không rõ thời gian'
                }`}
              </Badge>
            </Tooltip>

            <Tooltip title="Xác thực">
              <Badge className={styles.badge}>
                <CheckCircleOutlined />
                Thông tin xác thực:{' '}
                <div className={styles.icons}>
                  <FacebookOutlined style={{ color: '#1877f2' }} />
                  <TwitterOutlined style={{ color: '#1da1f2' }} />
                  <MailOutlined style={{ color: '#f56a00' }} />
                </div>
              </Badge>
            </Tooltip>

            <Tooltip title="Địa chỉ">
              <Badge className={styles.badge}>
                <EnvironmentOutlined />
                {`Địa chỉ: ${userData?.address ? userData.address : 'Chưa cung cấp'}`}
              </Badge>
            </Tooltip>
          </div>
        </Card>
        <div className={styles['personal-info-wrapper']}>
          <Tabs defaultActiveKey="personal">
            <TabPane tab="Thông tin cá nhân" key="personal">
              {/* <Card className={styles.card}> */}
              <Title level={3}>Hồ sơ cá nhân</Title>
              <div className={styles['form-group']}>
                <label htmlFor="fullname">Họ và tên</label>
                <Input id="fullname" value={formData.name} onChange={handleInputChange} />
              </div>
              <div className={styles['form-group']}>
                <label htmlFor="phone">Số điện thoại</label>
                <Input
                  id="phone"
                  placeholder="Nhập số điện thoại"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
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
              {/* </Card> */}
            </TabPane>

            {!userData?.isGoogle && (
              <>
                <TabPane tab="Thay đổi mật khẩu" key="security">
                  <div className={styles['form-design-layout']}>
                    <div className={styles['form-design-content']}>
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
                    </div>
                  </div>
                </TabPane>
              </>
            )}

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
      </div>
    </main>
  )
}
export default ProfilePage
