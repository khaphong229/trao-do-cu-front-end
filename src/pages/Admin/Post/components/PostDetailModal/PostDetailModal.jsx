import { Button, Descriptions, Modal, Form, Card, Image, Typography } from 'antd'
import React from 'react'
import moment from 'moment'
import { URL_SERVER_IMAGE } from '../../../../../config/url_server' // Import URL_SERVER_IMAGE

const { Title, Text } = Typography

const PostDetailModal = ({ open, post, onClose }) => {
  if (!post) return null

  const getImageUrl = imageUrlArr => {
    if (!imageUrlArr || imageUrlArr.length === 0) {
      return 'default_image_url' // Sử dụng ảnh mặc định nếu không có ảnh
    }

    const imageUrl = imageUrlArr[0]

    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl
    }

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
      <Card>
        <Form layout="vertical">
          <Form.Item label="Ảnh bài đăng">
            <Image
              src={getImageUrl(post.image_url)}
              alt="Bài đăng"
              width={200} // Điều chỉnh kích thước ảnh nhỏ lại
              height={200}
              style={{ borderRadius: 8, objectFit: 'cover' }} // Thêm border-radius và object-fit
            />
          </Form.Item>
          <Form.Item label="Tiêu đề">
            <Title level={4}>{post.title}</Title>
          </Form.Item>
          <Form.Item label="Địa chỉ">
            <Text strong>{post.specificLocation}</Text>
          </Form.Item>
          <Form.Item label="Ngày đăng">
            <Text>{moment(post.created_at).format('DD/MM/YYYY HH:mm')}</Text>
          </Form.Item>
          <Form.Item label="Thể loại">
            <Text>{post.category_id?.name || 'Không có thể loại'}</Text>
          </Form.Item>
          <Form.Item label="Trạng thái">
            <Text style={{ color: post.isApproved ? 'green' : 'red' }}>
              {post.isApproved ? 'Đã duyệt' : 'Chưa duyệt'}
            </Text>
          </Form.Item>
        </Form>
      </Card>
    </Modal>
  )
}

export default PostDetailModal
