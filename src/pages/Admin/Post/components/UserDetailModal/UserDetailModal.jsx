import React from 'react'
import { Modal, Descriptions, Button } from 'antd'
import moment from 'moment'

const UserDetailModal = ({ visible, user, onClose }) => {
  if (!user) return null

  const genderMap = {
    male: 'Nam',
    female: 'Nữ',
    other: 'Khác'
  }

  const statusMap = {
    active: 'Hoạt động',
    inactive: 'Ngừng hoạt động'
  }

  const customerCareMap = {
    standard: 'Chuẩn',
    vip: 'VIP',
    premium: 'Premium'
  }

  return (
    <Modal
      title="Chi tiết người dùng"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>
      ]}
      width={800}
    >
      <Descriptions
        bordered
        column={{
          xs: 1,
          sm: 2,
          md: 2
        }}
      >
        <Descriptions.Item label="Tên tài khoản">{user.name}</Descriptions.Item>
        <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
        <Descriptions.Item label="Số điện thoại">{user.phone}</Descriptions.Item>
        <Descriptions.Item label="Ngày sinh">
          {user.birth_date ? moment(user.birth_date).format('DD/MM/YYYY') : 'Chưa cung cấp'}
        </Descriptions.Item>
        <Descriptions.Item label="Giới tính">{genderMap[user.gender] || 'Chưa xác định'}</Descriptions.Item>
        <Descriptions.Item label="Trạng thái">{statusMap[user.status] || 'Chưa xác định'}</Descriptions.Item>
        <Descriptions.Item label="Chăm sóc khách hàng">
          {customerCareMap[user.category_care] || 'Chưa xác định'}
        </Descriptions.Item>
        <Descriptions.Item label="Mạng xã hội">{user.social_media || 'Chưa cung cấp'}</Descriptions.Item>
        <Descriptions.Item label="Ngày tạo" span={2}>
          {moment(user.createdAt).format('DD/MM/YYYY HH:mm:ss')}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  )
}

export default UserDetailModal
