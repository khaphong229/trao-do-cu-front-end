import React from 'react'
import { Space, Button, Tooltip } from 'antd'
import { FacebookOutlined, PhoneOutlined, EnvironmentOutlined, LockOutlined } from '@ant-design/icons'

const ContactInfoDisplay = ({ post, showInTable = false }) => {
  const isAccepted = post.status === 'accepted'
  const phone = post?.post_id?.user_id?.phone
  const facebook = post?.post_id?.user_id?.social_media?.[0]
  const location = post?.post_id?.specificLocation

  // For table view - compact display
  if (showInTable) {
    return (
      <Space direction="vertical" size={4} className="contact-info-compact">
        {phone && (
          <div className="contact-item">
            <PhoneOutlined style={{ marginRight: 8, color: isAccepted ? '#1890ff' : '#bfbfbf' }} />
            {isAccepted ? (
              <span className="contact-value">{phone}</span>
            ) : (
              <Tooltip title="Hiển thị khi được chấp nhận">
                <span className="contact-value masked">{phone.slice(0, 3)}xxxxxxx</span>
              </Tooltip>
            )}
          </div>
        )}

        {facebook && (
          <div className="contact-item">
            <FacebookOutlined style={{ marginRight: 8, color: '#1890ff' }} />
            {isAccepted ? (
              <a
                href={facebook}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="facebook-link"
              >
                Facebook
              </a>
            ) : (
              <Tooltip title="Hiển thị khi được chấp nhận">
                <span className="contact-value masked">Facebook</span>
              </Tooltip>
            )}
          </div>
        )}

        {location && (
          <div className="contact-item">
            <EnvironmentOutlined style={{ marginRight: 8, color: isAccepted ? '#52c41a' : '#bfbfbf' }} />
            {isAccepted ? (
              <span className="contact-value">{location}</span>
            ) : (
              <Tooltip title="Hiển thị khi được chấp nhận">
                <span className="contact-value masked">***</span>
              </Tooltip>
            )}
          </div>
        )}
      </Space>
    )
  }

  // For card view - prettier display with status indication
  return (
    <div className="contact-info-card">
      {!isAccepted && (
        <div className="contact-locked">
          <LockOutlined /> Chấp nhận để xem thông tin liên hệ
        </div>
      )}

      {isAccepted && (
        <Space direction="vertical" size={8} className="contact-accepted">
          {phone && (
            <Button
              type="link"
              icon={<PhoneOutlined />}
              href={`tel:${phone}`}
              className="contact-button phone"
              onClick={e => e.stopPropagation()}
            >
              {phone}
            </Button>
          )}

          {facebook && (
            <Button
              type="link"
              icon={<FacebookOutlined />}
              href={facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-button facebook"
              onClick={e => e.stopPropagation()}
            >
              Facebook
            </Button>
          )}

          {location && (
            <div className="location-info">
              <EnvironmentOutlined style={{ marginRight: 8, color: '#52c41a' }} />
              <span>{location}</span>
            </div>
          )}
        </Space>
      )}
    </div>
  )
}

export default ContactInfoDisplay
