import { Button, Card, Badge, Tooltip, Image, Upload, message } from 'antd'
import {
  ShareAltOutlined,
  EditOutlined,
  MessageOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  EnvironmentOutlined,
  FacebookOutlined,
  TwitterOutlined,
  MailOutlined,
  CameraOutlined
} from '@ant-design/icons'
import Avatar from 'assets/images/logo/avtDefault.jpg'
import styles from '../scss/ProfileUser.module.scss'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import dayjs from 'dayjs'
import { uploadAvatar } from 'features/upload/uploadThunks'
import { useEffect, useState } from 'react'
import { getCurrentUser, updateUserProfile } from 'features/auth/authThunks'

import { URL_SERVER_IMAGE } from 'config/url_server'

const ProfilePage = () => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const [uploading, setUploading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState('')

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
      message.error(error.message || 'Đã xảy ra lỗi khi upload ảnh')
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
                src={user?.avatar ? `${URL_SERVER_IMAGE}${user.avatar}` : Avatar}
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
              <h1>{user?.name ? user.name : 'Tài khoản'}</h1>
              {/* <p className="text-muted">Chưa có đánh giá</p> */}
              {/* <div className={styles.followers}>
                Người theo dõi: <strong>0</strong> • Đang theo dõi: <strong>0</strong>
              </div> */}
            </div>
            <div className={styles['button-group']}>
              <Button type="primary" icon={<ShareAltOutlined />} disabled>
                Chia sẻ trang của bạn
              </Button>
              <Button icon={<EditOutlined />}>
                <Link to="/edit-profile">Chỉnh sửa thông tin cá nhân</Link>
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
                  dayjs(user.created_at).isValid() ? dayjs(user.created_at).fromNow() : 'Không rõ thời gian'
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
                {`Địa chỉ: ${user?.address ? user.address : 'Chưa cung cấp'}`}
              </Badge>
            </Tooltip>
          </div>
        </Card>
        {/* 
        <Card className={styles.card}>
+
        </Card> */}
      </div>
    </main>
  )
}
export default ProfilePage
