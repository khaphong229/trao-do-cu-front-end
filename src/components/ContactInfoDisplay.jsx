import React from 'react'
import { Typography, Space } from 'antd'
import { PhoneOutlined, EnvironmentOutlined, UserOutlined } from '@ant-design/icons'

const { Text } = Typography

const ContactInfoDisplay = ({ post, showInTable = false }) => {
  // Check if contact info is available after request is accepted
  const showContact = post.status === 'accepted' && post.post_id.status === 'inactive'

  // Format phone number properly - prevent character splitting
  const formatPhoneNumber = phone => {
    if (!phone) return 'Không có'
    // If phone is already formatted well or is masked with 'x', don't process further
    if (phone.includes('x') || phone.includes('-')) return phone

    // Simple formatting for Vietnamese numbers (10 digits)
    if (phone.replace(/\D/g, '').length === 10) {
      return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')
    }
    return phone
  }

  // For table view in desktop layout
  if (showInTable) {
    return (
      <div className="contact-info-display">
        {showContact ? (
          <Space direction="vertical" size={4}>
            <div className="contact-item">
              <PhoneOutlined className="icon" />
              <Text>{formatPhoneNumber(post.post_id.contact)}</Text>
            </div>
            <div className="contact-item">
              <EnvironmentOutlined className="icon" />
              <Text>{post.post_id.specificLocation || 'Không có địa chỉ'}</Text>
            </div>
            {post.post_id.user_id?.name && (
              <div className="contact-item">
                <UserOutlined className="icon" />
                <Text>{post.post_id.user_id.name}</Text>
              </div>
            )}
          </Space>
        ) : (
          <Text type="secondary" className="contact-status pending">
            Chờ đồng ý
          </Text>
        )}
      </div>
    )
  }

  // For card view
  return (
    <div className="contact-info-container">
      {showContact ? (
        <>
          <Text className="contact-status accepted">Đã nhận</Text>
          <div className="contact-row">
            <Text className="contact-label">Số điện thoại:</Text>
            <Text className="contact-value">{formatPhoneNumber(post.post_id.contact)}</Text>
          </div>
          <div className="contact-row">
            <Text className="contact-label">Địa chỉ liên hệ:</Text>
            <Text className="contact-value">{post.post_id.specificLocation || 'Không có'}</Text>
          </div>
        </>
      ) : (
        <Text className="contact-status pending">{post.post_id.status === 'inactive' ? 'Kết thúc' : 'Chờ đồng ý'}</Text>
      )}
    </div>
  )
}

export default ContactInfoDisplay
