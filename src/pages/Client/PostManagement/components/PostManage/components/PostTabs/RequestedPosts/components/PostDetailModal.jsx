import { Modal, Avatar, Tag, Descriptions, Image, Card, Typography } from 'antd'
import { UserOutlined, PhoneOutlined, HomeOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { URL_SERVER_IMAGE } from 'config/url_server'
import avt from 'assets/images/logo/avtDefault.webp'
import imgNotFound from 'assets/images/others/imagenotfound.webp'
import '../styles.scss'
import ContactInfoDisplay from './ContactInfoDisplay'
import { getAvatarPost } from 'hooks/useAvatar'

const { Title, Text } = Typography

const PostDetailModal = ({ isVisible, onClose, post }) => {
  if (!post) return null
  let typeCheck
  if (post.post_id.status === 'inactive' && post.status === 'accepted') {
    typeCheck = 'acp'
  } else if (post.post_id.status === 'inactive' && post.status !== 'accepted') {
    typeCheck = 'end'
  } else {
    typeCheck = 'pend'
  }
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
          <Tag color={typeCheck === 'acp' ? 'success' : typeCheck === 'end' ? 'error' : 'warning'}>
            {typeCheck === 'acp' ? 'Đã nhận' : typeCheck === 'end' ? 'Kết thúc' : 'Chờ duyệt'}
          </Tag>
        </div>
      }
    >
      <div style={{ display: 'flex', gap: '24px' }} className="DetailPostContainer">
        <div style={{ flex: '1', maxWidth: '400px' }}>
          <Card title="Hình ảnh sản phẩm" bordered={false}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: '16px'
              }}
            >
              {post.post_id.image_url.map((image, index) => (
                <Image
                  key={index}
                  src={image ? `${URL_SERVER_IMAGE}${image}` : imgNotFound}
                  alt={`Post image ${index + 1}`}
                  fallback={avt}
                  style={{
                    width: '100%',
                    height: '150px',
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
                <UserOutlined />
                <span>Thông tin chủ bài đăng</span>
              </div>
            }
            bordered={false}
            style={{ marginBottom: '16px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Avatar src={getAvatarPost(post.post_id.user_id)} size={40} />
              <div>
                <Title level={4} style={{ margin: 0 }}>
                  {post.post_id.user_id?.name || 'Không xác định'}
                </Title>
                <Text type="secondary">
                  {post.post_id.user_id?.email ? `xxxx${post?.post_id?.user_id?.email.slice(-12)}` : ''}
                </Text>
              </div>
            </div>
          </Card>

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
                <Text strong>{post.post_id.title}</Text>
              </Descriptions.Item>
              {post.post_id.description && (
                <Descriptions.Item label="Mô tả">{post.post_id.description}</Descriptions.Item>
              )}
              <Descriptions.Item label="Địa chỉ">{post.post_id.specificLocation}</Descriptions.Item>
              <Descriptions.Item label="Thành phố">{post.post_id.city}</Descriptions.Item>
              <Descriptions.Item label="Loại">
                <Tag color={post.post_id.type === 'gift' ? 'blue' : 'green'}>
                  {post.post_id.type === 'gift' ? 'Trao tặng' : 'Trao đổi'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ClockCircleOutlined />
                    <span>Thời gian yêu cầu</span>
                  </div>
                }
              >
                {new Date(post.requestAt).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PhoneOutlined />
                <span>Thông tin liên hệ</span>
              </div>
            }
            bordered={false}
          >
            <ContactInfoDisplay post={post} showInTable={false} />
          </Card>
        </div>
      </div>
    </Modal>
  )
}

export default PostDetailModal
