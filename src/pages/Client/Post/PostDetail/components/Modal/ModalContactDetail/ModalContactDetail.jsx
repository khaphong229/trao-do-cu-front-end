import React from 'react'
import { Modal, Avatar, Typography, Divider, Space, Button } from 'antd'
import { PhoneOutlined, CalendarOutlined, UserOutlined, LockOutlined } from '@ant-design/icons'
import styles from '../../../scss/ModalContactDetail.module.scss' // Import file SCSS
import { useSelector } from 'react-redux'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/vi'
import { getAvatarPost } from 'hooks/useAvatar'

const { Title, Text } = Typography
dayjs.extend(relativeTime)
dayjs.locale('vi')

const ModalContactDetail = ({ visible, onClose }) => {
  const { selectedPost } = useSelector(state => state.post)
  const { user } = useSelector(state => state.auth)

  // Check if the current user has exchanged messages with the post author
  // This is a placeholder function - you'll need to implement the actual logic
  const hasExchangedMessages = () => {
    // Return true if messages have been exchanged, false otherwise
    // This should be based on your app's messaging system
    return false // Default to false for now
  }

  return (
    <div>
      <Modal title="Thông tin liên hệ" open={visible} onCancel={onClose} footer={null} width={500}>
        <div className={styles.contactModalContent}>
          {/* Thông tin người đăng bài */}
          <div className={styles.authorSection}>
            <Avatar
              size={64}
              src={getAvatarPost(selectedPost?.user_id)}
              icon={<UserOutlined />}
              className={styles.avatar}
            />
            <div className={styles.userInfo}>
              <Title level={4} style={{ margin: 0 }}>
                {selectedPost?.user_id?.name || 'Người dùng'}
              </Title>
              <Space>
                <CalendarOutlined />
                <Text>
                  <span />
                  {`Đã tham gia ${
                    dayjs(selectedPost?.user_id?.created_at).isValid()
                      ? dayjs(selectedPost?.user_id?.created_at).fromNow()
                      : 'Không rõ thời gian'
                  }`}
                </Text>
              </Space>
            </div>
          </div>

          <Divider />

          {/* Thông tin liên hệ */}
          <div className={styles.contactSection}>
            <Title level={5}>Thông tin liên hệ</Title>

            {hasExchangedMessages() ? (
              // Show contact information if messages have been exchanged
              <div className={styles.contactItem}>
                <PhoneOutlined className={styles.icon} />
                <span className={styles.label}>Số điện thoại:</span>
                <span className={styles.value}>
                  {selectedPost?.user_id?.phone && (
                    <a href={`tel:${selectedPost.user_id.phone}`}>{selectedPost.user_id.phone}</a>
                  )}
                </span>
              </div>
            ) : (
              // Show locked message if no messages have been exchanged
              <div className={styles.lockedContact}>
                <LockOutlined className={styles.lockIcon} />
                <Text type="secondary">
                  Thông tin liên hệ sẽ được hiển thị sau khi bạn trao đổi tin nhắn với người đăng bài.
                </Text>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ModalContactDetail
