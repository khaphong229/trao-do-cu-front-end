import { Button, Descriptions, Modal } from 'antd'
import React from 'react'
import moment from 'moment'

const PostDetailModal = ({ visible, post, onClose }) => {
  if (!post) return null

  return (
    <Modal
      title="Chi tiết bài viết"
      open={visible} // Change this to match your Ant Design version
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>
      ]}
      width={800}
    >
      <Descriptions bordered column={{ xs: 1, sm: 2, md: 2 }}>
        <Descriptions.Item label="Tiêu đề">{post.title}</Descriptions.Item>
        <Descriptions.Item label="Mô tả">{post.description}</Descriptions.Item>
        <Descriptions.Item label="Địa chỉ">{post.specifiedocation}</Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          <span style={{ color: post.status === 'active' ? 'green' : 'red' }}>
            {post.status === 'active' ? 'Đã duyệt' : 'Chưa duyệt'}
          </span>
        </Descriptions.Item>
        <Descriptions.Item label="Ngày tạo">{moment(post.created_at).format('DD/MM/YYYY HH:mm:ss')}</Descriptions.Item>
      </Descriptions>
    </Modal>
  )
}

export default PostDetailModal
