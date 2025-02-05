import React from 'react'
import { Modal, Tag, Descriptions, Image, Card, Typography } from 'antd'
import { HomeOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { URL_SERVER_IMAGE } from 'config/url_server'
import avt from 'assets/images/logo/avtDefault.webp'
import styles from './PostDetail.module.scss'

const { Title, Text } = Typography

const PostDetail = ({ isVisible, onClose, post }) => {
  if (!post) return null

  return (
    <Modal
      open={isVisible}
      onCancel={onClose}
      footer={null}
      width={800}
      className="post-detail-modal"
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Title level={4} style={{ margin: 0 }}>
            Chi tiết bài đăng
          </Title>
          <Tag color={post.status === 'active' ? 'processing' : 'success'}>
            {post.status === 'active' ? 'Đang hiển thị' : 'Đã thành công'}
          </Tag>
        </div>
      }
    >
      <div style={{ display: 'flex', gap: '24px' }} className={styles.detailContainer}>
        <div style={{ flex: '1', maxWidth: '400px' }}>
          <Card title="Hình ảnh sản phẩm" bordered={false}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                gap: '16px'
              }}
            >
              {post.image_url.map((image, index) => (
                <Image
                  key={index}
                  src={`${URL_SERVER_IMAGE}${image}`}
                  alt={`Post image ${index + 1}`}
                  fallback={avt}
                  style={{
                    width: '100%',
                    height: '100px',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                />
              ))}
            </div>
          </Card>
        </div>

        <div style={{ flex: '1.5' }}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HomeOutlined />
                <span>Thông tin bài đăng</span>
              </div>
            }
            bordered={false}
            style={{ marginBottom: '16px' }}
          >
            <Descriptions column={1} labelStyle={{ fontWeight: '500' }}>
              <Descriptions.Item label="Tiêu đề">
                <Text strong>{post.title}</Text>
              </Descriptions.Item>
              {post.description && <Descriptions.Item label="Mô tả">{post.description}</Descriptions.Item>}
              <Descriptions.Item label="Địa chỉ">{post.specificLocation}</Descriptions.Item>
              <Descriptions.Item label="Thành phố">{post.city}</Descriptions.Item>
              <Descriptions.Item label="Loại">
                <Tag color={post.type === 'gift' ? 'blue' : 'green'}>
                  {post.type === 'gift' ? 'Trao tặng' : 'Trao đổi'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ClockCircleOutlined />
                    <span>Thời gian đăng</span>
                  </div>
                }
              >
                {new Date(post.created_at).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </div>
      </div>
    </Modal>
  )
}

export default PostDetail
