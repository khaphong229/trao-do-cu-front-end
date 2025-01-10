import React from 'react'
import { Modal, Avatar, Tag, Descriptions, Image } from 'antd'
import { URL_SERVER_IMAGE } from 'config/url_server'
import avt from 'assets/images/logo/avtDefault.jpg'
import '../styles.scss'

const PostDetailModal = ({ isVisible, onClose, post }) => {
  if (!post) return null

  return (
    <Modal open={isVisible} onCancel={onClose} footer={null} width={800} className="post-detail-modal">
      <div className="post-detail-content">
        <div className="post-images">
          {post.post_id.image_url.map((image, index) => (
            <Image
              key={index}
              src={`${URL_SERVER_IMAGE}${image}`}
              alt={`Post image ${index + 1}`}
              fallback={avt}
              className="post-image"
              style={{
                height: '200px'
              }}
            />
          ))}
        </div>

        <div className="post-info">
          <div className="post-header">
            <Avatar src={`${URL_SERVER_IMAGE}${post.user_req_id?.avatar}` || avt} size={64} />
            <div className="user-info">
              <h2>{post.user_req_id?.name}</h2>
              <Tag color={post.status === 'accepted' ? 'green' : 'blue'}>
                {post.status === 'accepted' ? 'Đã nhận' : 'Chờ duyệt'}
              </Tag>
            </div>
          </div>

          <Descriptions column={1} className="post-details">
            <Descriptions.Item label="Tiêu đề">{post.post_id.title}</Descriptions.Item>
            {post.post_id.description && (
              <Descriptions.Item label="Mô tả">{post.post_id.description}</Descriptions.Item>
            )}
            <Descriptions.Item label="Địa chỉ">{post.post_id.specificLocation}</Descriptions.Item>
            <Descriptions.Item label="Thành phố">{post.post_id.city}</Descriptions.Item>
            <Descriptions.Item label="Loại">
              {post.post_id.type === 'gift' ? 'Trao tặng' : 'Trao đổi'}
            </Descriptions.Item>
            <Descriptions.Item label="Thời gian yêu cầu">
              {new Date(post.requestAt).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Descriptions.Item>
          </Descriptions>

          {post.contact_phone && (
            <div className="contact-info">
              <h3>Thông tin liên hệ</h3>
              <p>Số điện thoại: {post.contact_phone}</p>
              {post.contact_social_media?.facebook && (
                <p>
                  Facebook:{' '}
                  <a href={post.contact_social_media.facebook} target="_blank" rel="noopener noreferrer">
                    Liên kết Facebook
                  </a>
                </p>
              )}
              <p>Địa chỉ liên hệ: {post.contact_address}</p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}

export default PostDetailModal
