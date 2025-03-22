import { Button, Descriptions, Modal, Image, Tag, Typography } from 'antd'
import React from 'react'
import moment from 'moment'
import { URL_SERVER_IMAGE } from '../../../../../config/url_server'

const { Text, Paragraph } = Typography

const PostDetailModal = ({ open, post, onClose }) => {
  if (!post) return null

  const getImageUrl = imageUrlArr => {
    if (!imageUrlArr || imageUrlArr.length === 0) {
      return null
    }

    // Lấy URL đầu tiên từ mảng image_url
    const imageUrl = imageUrlArr[0]

    // Kiểm tra nếu URL đã bắt đầu bằng http hoặc https
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl
    }

    // Sử dụng URL_SERVER_IMAGE để xây dựng đường dẫn đầy đủ
    return `${URL_SERVER_IMAGE}${imageUrl}`
  }

  return (
    <Modal
      title="Chi tiết bài viết"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>
      ]}
      width={800}
    >
      <Descriptions bordered column={{ xs: 1, sm: 1, md: 2 }} layout="vertical">
        <Descriptions.Item label="Ảnh bài đăng" span={2}>
          {post.image_url && post.image_url.length > 0 ? (
            <Image
              src={getImageUrl(post.image_url)}
              alt={post.title}
              style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }}
            />
          ) : (
            <Text type="secondary">Không có ảnh</Text>
          )}
        </Descriptions.Item>

        <Descriptions.Item label="Tiêu đề" span={2}>
          <Text strong>{post.title || 'Không có tiêu đề'}</Text>
        </Descriptions.Item>

        <Descriptions.Item label="Địa chỉ">{post.specificLocation || 'Không có địa chỉ'}</Descriptions.Item>

        <Descriptions.Item label="Thể loại">{post.category_id?.name || 'Không có thể loại'}</Descriptions.Item>

        <Descriptions.Item label="Giao dịch">
          {post.type === 'exchange' ? 'Trao đổi' : post.type === 'gift' ? 'Trao tặng' : 'Không có giao dịch'}
        </Descriptions.Item>

        <Descriptions.Item label="Mã sản phẩm">{post.itemCode || 'Không có mã sản phẩm'}</Descriptions.Item>

        <Descriptions.Item label="Sản phẩm góc PTIT">
          <Tag color={post.isPtiterOnly ? '#1890ff' : '#ff4d4f'}>{post.isPtiterOnly ? 'True' : 'False'}</Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Trạng thái">
          <Tag color={post.isApproved ? 'green' : 'orange'}>{post.isApproved ? 'Đã duyệt' : 'Đang chờ duyệt'}</Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Ngày đăng">
          {post.created_at ? moment(post.created_at).format('DD/MM/YYYY HH:mm:ss') : 'N/A'}
        </Descriptions.Item>

        <Descriptions.Item label="Nội dung" span={2}>
          <Paragraph ellipsis={{ rows: 3, expandable: true, symbol: 'Xem thêm' }}>
            {post.content || 'Không có nội dung'}
          </Paragraph>
        </Descriptions.Item>

        <Descriptions.Item label="Người đăng">
          {post.user_id?.name || post.userId?.name || 'Không có thông tin'}
        </Descriptions.Item>

        <Descriptions.Item label="Lý do duyệt/từ chối">{post.reason || 'Không có lý do'}</Descriptions.Item>

        {post.price !== undefined && (
          <Descriptions.Item label="Giá">{post.price.toLocaleString()} VNĐ</Descriptions.Item>
        )}
      </Descriptions>
    </Modal>
  )
}

export default PostDetailModal
