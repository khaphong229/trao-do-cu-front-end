import React from 'react'
import { Modal, Avatar, Typography, Divider, Space } from 'antd'
import { PhoneOutlined, MailOutlined, HomeOutlined, CalendarOutlined } from '@ant-design/icons'
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
  return (
    <div>
      <Modal title="Thông tin liên hệ" open={visible} onCancel={onClose} footer={null} width={500}>
        <div className={styles.contactModalContent}>
          {/* Thông tin người đăng bài */}
          <div className={styles.authorSection}>
            <Avatar size={64} src={getAvatarPost(selectedPost?.user_id)} className={styles.avatar} />
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

            <div className={styles.contactItem}>
              <PhoneOutlined className={styles.icon} />
              <span className={styles.label}>Số điện thoại:</span>
              <span className={styles.value}>{selectedPost?.user_id?.phone}</span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ModalContactDetail
