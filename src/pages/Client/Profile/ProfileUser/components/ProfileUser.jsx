import { Button, Card, Tabs, Badge, Tooltip, Image, Upload, message, Checkbox, Input, Select } from 'antd'
import { ClockCircleOutlined, EnvironmentOutlined, CameraOutlined, PlusOutlined } from '@ant-design/icons'
import Avatar from 'assets/images/logo/avtDefault.webp'
import styles from '../scss/ProfileUser.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import dayjs from 'dayjs'
import { uploadAvatar } from 'features/upload/uploadThunks'
import { useEffect, useState } from 'react'
import { changePassWord, getCurrentUser, updateUserProfile } from 'features/auth/authThunks'
import Title from 'antd/es/skeleton/Title'
import { useAvatar } from 'hooks/useAvatar'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Location from 'pages/Client/Post/CreatePost/components/Modal/Location'
const { TabPane } = Tabs

const ProfilePage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const activeTab = searchParams.get('tab') || 'personal'
  const dispatch = useDispatch()
  const { avatar } = useAvatar()

  const {
    user: userData,
    isLoading,
    error,
    changePassWordSuccess,
    changePassWordMessage
  } = useSelector(state => state.auth)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: '',
    phone: '',
    address: [],
    social_media: {
      facebook: '',
      zalo: '',
      instagram: ''
    },
    isPtiter: false,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    avatar: ''
  })
  const [savePassword, setSavePassword] = useState(false)

  // Sửa lại hàm getDefaultAddress để kiểm tra nếu list là một mảng
  const getDefaultAddress = list => {
    if (!list) return ''
    if (!Array.isArray(list)) return String(list)
    const defaultAddress = list.find(item => item.isDefault === true)
    return defaultAddress?.address || 'Chưa cung cấp'
  }

  const validateFacebookURL = url => {
    // Allow empty string
    if (!url) return true

    // Regular expression for Facebook URL validation
    const facebookUrlRegex = /^(https?:\/\/)?(www\.)?facebook\.com\/[a-zA-Z0-9.]+\/?$/

    return facebookUrlRegex.test(url)
  }

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: getDefaultAddress(userData.address),
        gender: userData.gender || '',
        isPtiter: userData.isPtiter || false,
        social_media: {
          facebook: userData?.social_media?.facebook,
          zalo: '',
          instagram: ''
        },
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        avatar: userData?.avatar
      })
    }
  }, [userData])

  const handleInputChange = e => {
    const { id, value } = e.target

    if (id === 'facebook') {
      setFormData(prev => ({
        ...prev,
        social_media: {
          ...prev.social_media,
          facebook: value
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [id]: value }))
    }
  }

  const handleSelectChange = value => {
    setFormData(prev => ({ ...prev, gender: value }))
  }

  const handleCheckboxChange = e => {
    setFormData(prev => ({ ...prev, isPtiter: e.target.checked }))
  }

  const handleUpdateMe = async () => {
    try {
      // Validate Facebook URL before updating
      if (formData.social_media.facebook && !validateFacebookURL(formData.social_media.facebook)) {
        message.error('Vui lòng nhập URL Facebook hợp lệ')
        return
      }

      // Existing validation for required fields
      const requiredFields = {
        name: 'Họ và tên',
        phone: 'Số điện thoại',
        gender: 'Giới tính'
      }

      const missingFields = []
      for (const [field, label] of Object.entries(requiredFields)) {
        if (!formData[field]) {
          missingFields.push(label)
        }
      }

      // if (!hasPhone && !hasFacebook) {
      //   message.error('Vui lòng cung cấp ít nhất một trong hai thông tin: Số điện thoại hoặc Facebook')
      //   return
      // }

      delete formData.address
      const response = await dispatch(updateUserProfile(formData)).unwrap()

      if (response.status === 201) {
        message.success(response.message)
      }
    } catch (error) {
      if (error.detail) {
        // Handle specific API validation errors
        Object.entries(error.detail).forEach(([field, errorMessage]) => {
          message.error(`Lỗi ${field}: ${errorMessage}`)
        })
      } else {
        message.error(error.message || 'Có lỗi xảy ra khi cập nhật thông tin')
      }
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
        // Sử dụng setTimeout để hiển thị message trước khi reload
        setTimeout(() => {
          navigate(0)
        }, 1500)
      })
      .catch(err => {
        message.error(err.message || 'Đã xảy ra lỗi khi đổi mật khẩu!')
      })
  }

  const handleCustomUpload = async options => {
    const { file, onSuccess, onError } = options
    try {
      setUploading(true)

      const uploadResponse = await dispatch(uploadAvatar(file)).unwrap()

      if (uploadResponse.success && uploadResponse.files?.[0]) {
        const newAvatarUrl = uploadResponse.files[0].filepath
        // Cập nhật profile với avatar mới
        const response = await dispatch(
          updateUserProfile({
            avatar: newAvatarUrl,
            // Thêm các thông tin hiện tại của user để tránh mất dữ liệu
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            gender: formData.gender,
            isPtiter: formData.isPtiter,
            social_media: formData.social_media
          })
        ).unwrap()

        if (response.status === 201) {
          message.success('Upload ảnh thành công')
          // Cập nhật lại thông tin user sau khi upload thành công
          await dispatch(getCurrentUser(false))
          onSuccess(uploadResponse)
        } else {
          message.error('Upload ảnh thất bại')
        }
      } else {
        throw new Error('Upload response không hợp lệ')
      }
    } catch (error) {
      Object.values(error.detail || {}).forEach(err => {
        message.error(err)
      })
      onError(error)
    } finally {
      setUploading(false)
    }
  }

  const handleTabChange = activeKey => {
    // Update URL when tab changes
    navigate(`/profile?tab=${activeKey}`)
  }

  return (
    <main className={styles['profile-page']}>
      <div className={styles.container}>
        <Card className={styles.card}>
          <div className={styles['profile-header']}>
            <div className={styles['avatar-container']}>
              <Image
                src={avatar}
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
            </div>
            {/* <div className={styles['button-group']}>
              <Button type="primary" icon={<ShareAltOutlined />} disabled>
                Chia sẻ trang của bạn
              </Button>
            </div> */}
          </div>
        </Card>

        <Card className={styles.card}>
          <div className={styles['badges-section']}>
            {/* <Tooltip title="Phản hồi chat">
              <Badge className={styles.badge}>
                <MessageOutlined /> Chưa có thông tin
              </Badge>
            </Tooltip> */}

            <Tooltip title="Thời gian tham gia">
              <Badge className={styles.badge}>
                <ClockCircleOutlined />{' '}
                {`Đã tham gia: ${
                  dayjs(userData?.created_at).isValid() ? dayjs(userData.created_at).fromNow() : 'Không rõ thời gian'
                }`}
              </Badge>
            </Tooltip>

            {/* <Tooltip title="Xác thực">
              <Badge className={styles.badge}>
                <CheckCircleOutlined />
                Thông tin xác thực:{' '}
                <div className={styles.icons}>
                  <FacebookOutlined style={{ color: '#1877f2' }} />
                  <TwitterOutlined style={{ color: '#1da1f2' }} />
                  <MailOutlined style={{ color: '#f56a00' }} />
                </div>
              </Badge>
            </Tooltip> */}

            <Tooltip title="Địa chỉ">
              <Badge className={styles.badge}>
                <EnvironmentOutlined />
                {`Địa chỉ: ${userData?.address ? getDefaultAddress(userData.address) : 'Chưa cung cấp'}`}
              </Badge>
            </Tooltip>
          </div>
        </Card>
        <div className={styles['personal-info-wrapper']}>
          <Tabs activeKey={activeTab} onChange={handleTabChange}>
            <TabPane tab="Thông tin cá nhân" key="personal">
              <Title level={3}>Hồ sơ cá nhân</Title>
              <div className={styles['form-group']}>
                <Checkbox id="isPtiter" checked={formData.isPtiter} onChange={handleCheckboxChange}>
                  Là sinh viên PTIT
                </Checkbox>
              </div>
              <div className={styles['form-group']}>
                <label htmlFor="name">Họ và tên</label>
                <Input id="name" value={formData.name} onChange={handleInputChange} />
              </div>
              <div className={styles['form-group']}>
                <label htmlFor="email">Email</label>
                <Input id="email" value={formData.email} readOnly />
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
                <label htmlFor="facebook">Facebook</label>
                <Input
                  id="facebook"
                  value={formData.social_media.facebook}
                  onChange={handleInputChange}
                  status={
                    formData.social_media.facebook && !validateFacebookURL(formData.social_media.facebook)
                      ? 'error'
                      : ''
                  }
                />
                {formData.social_media.facebook && !validateFacebookURL(formData.social_media.facebook) && (
                  <div style={{ color: 'red', marginTop: '5px' }}>
                    Vui lòng nhập URL Facebook hợp lệ (ví dụ: https://www.facebook.com/username)
                  </div>
                )}
              </div>
              <div className={styles['form-group']}>
                <label htmlFor="address">Địa chỉ mặc định</label>
                <div
                  style={{
                    display: 'flex',
                    gap: 10
                  }}
                >
                  <Input
                    id="address"
                    placeholder="Nhập địa chỉ"
                    value={formData.address ? getDefaultAddress(formData.address) : ''}
                    onChange={handleInputChange}
                  />
                  <Button
                    className={styles['button-add']}
                    icon={<PlusOutlined />}
                    onClick={() => navigate('/profile?tab=location')}
                  />
                </div>
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
              {/* <div className={styles['form-group']}>
                <label htmlFor="dob">Ngày, tháng, năm sinh</label>
                <Input id="dob" type="date" />
              </div> */}

              <div className={styles['form-actions1']}>
                <Button type="primary" block style={{ width: '100px', marginLeft: 'auto' }} onClick={handleUpdateMe}>
                  Thay đổi
                </Button>
              </div>
            </TabPane>

            <TabPane tab="Danh sách địa chỉ" key="location">
              <Location isInProfile={true} />
            </TabPane>

            {!userData?.isGoogle && (
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
                          required
                          status={!formData.currentPassword && error ? 'error' : ''}
                        />
                        {!formData.currentPassword && error && (
                          <div className={styles['error-message']}>Vui lòng nhập mật khẩu hiện tại</div>
                        )}
                      </div>

                      <div className={styles['form-item']}>
                        <label htmlFor="new-password">Mật khẩu mới</label>
                        <Input.Password
                          id="new-password"
                          placeholder="Nhập mật khẩu mới"
                          value={formData.newPassword}
                          onChange={handleChangePassword}
                          required
                          status={
                            (!formData.newPassword || (formData.newPassword && formData.newPassword.length < 6)) &&
                            error
                              ? 'error'
                              : ''
                          }
                        />
                        {!formData.newPassword && error && (
                          <div className={styles['error-message']}>Vui lòng nhập mật khẩu mới</div>
                        )}
                        {formData.newPassword && formData.newPassword.length < 8 && (
                          <div className={styles['error-message']}>Mật khẩu phải có ít nhất 6 ký tự</div>
                        )}
                      </div>

                      <div className={styles['form-item']}>
                        <label htmlFor="confirm-password">Xác nhận mật khẩu mới</label>
                        <Input.Password
                          id="confirm-password"
                          placeholder="Xác nhận mật khẩu mới"
                          value={formData.confirmPassword}
                          onChange={handleChangePassword}
                          required
                          status={
                            (formData.newPassword !== formData.confirmPassword || !formData.confirmPassword) && error
                              ? 'error'
                              : ''
                          }
                        />
                        {!formData.confirmPassword && error && (
                          <div className={styles['error-message']}>Vui lòng xác nhận mật khẩu mới</div>
                        )}
                        {formData.newPassword !== formData.confirmPassword && formData.confirmPassword && (
                          <div className={styles['error-message']}>Mật khẩu xác nhận không khớp với mật khẩu mới</div>
                        )}
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
            )}
          </Tabs>
        </div>
      </div>
    </main>
  )
}

export default ProfilePage
