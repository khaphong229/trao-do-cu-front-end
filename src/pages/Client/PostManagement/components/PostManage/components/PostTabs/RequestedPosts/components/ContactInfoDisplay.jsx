import React from 'react'
import { Descriptions } from 'antd'
import { FacebookOutlined } from '@ant-design/icons'

const ContactInfoDisplay = ({ post, showInTable = false }) => {
  const isAccepted = post.status === 'accepted'
  const phone = post?.post_id?.user_id?.phone
  const facebook = post?.post_id?.user_id?.social_media?.[0]

  if (showInTable) {
    return (
      <>
        <span>{isAccepted ? `SĐT: ${phone}` : phone ? `SĐT: ${phone.slice(0, 3)}xxxxxxx` : ''}</span>
        {facebook && (
          <>
            <br />
            <span>
              <FacebookOutlined />{' '}
              <a
                href={facebook}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: isAccepted ? '#1890ff' : '#ccc',
                  pointerEvents: isAccepted ? 'auto' : 'none',
                  cursor: isAccepted ? 'pointer' : 'default'
                }}
              >
                Facebook
              </a>
            </span>
          </>
        )}
      </>
    )
  }

  return (
    <Descriptions column={1} labelStyle={{ fontWeight: '500' }}>
      {phone && (
        <Descriptions.Item label="Số điện thoại">
          {isAccepted ? phone : `${phone.slice(0, 3)}xxxxxxx`}
        </Descriptions.Item>
      )}
      {facebook && (
        <Descriptions.Item
          label={
            <span>
              <FacebookOutlined /> Facebook
            </span>
          }
        >
          <a
            href={facebook}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: isAccepted ? '#1890ff' : '#ccc',
              pointerEvents: isAccepted ? 'auto' : 'none',
              cursor: isAccepted ? 'pointer' : 'default'
            }}
          >
            Liên kết Facebook
          </a>
        </Descriptions.Item>
      )}
      <Descriptions.Item label="Địa chỉ liên hệ">
        {isAccepted ? post.post_id.specificLocation : '***'}
      </Descriptions.Item>
    </Descriptions>
  )
}

export default ContactInfoDisplay
