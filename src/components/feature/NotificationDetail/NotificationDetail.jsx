import React from 'react'
import { Modal, Avatar, Tag, Button, Divider, Typography, Row, Col, Space, Image } from 'antd'
import {
  UserOutlined,
  FacebookOutlined,
  PhoneOutlined,
  MessageOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  InfoCircleOutlined
} from '@ant-design/icons'
import { setVisibleNotificationDetail } from 'features/client/notification/notificationSlice'
import { useDispatch, useSelector } from 'react-redux'
import { URL_SERVER_IMAGE } from 'config/url_server'

const { Title, Text, Paragraph } = Typography

// Component chính hiển thị modal thông tin sản phẩm
const NotificationDetail = ({ notification }) => {
  const dispatch = useDispatch()
  const { isVisibleNotificationDetail } = useSelector(state => state.notification) // Use useSelector to get the state

  const onClose = () => {
    dispatch(setVisibleNotificationDetail(false))
  }

  if (!notification) return null

  const { isApproved, category, postTitle, imageUrl, ownerName, receiverName, contact, facebookLink } = notification

  const getStatusBadge = isApproved => {
    if (isApproved) {
      return (
        <Tag icon={<CheckCircleOutlined />} color="success">
          Đồng ý
        </Tag>
      )
    } else {
      return (
        <Tag icon={<ClockCircleOutlined />} color="warning">
          Chờ duyệt
        </Tag>
      )
    }
  }

  const getCategoryBadge = category => {
    if (category === 'gift') {
      return <Tag color="magenta">Tặng</Tag>
    } else {
      return <Tag color="blue">Đổi</Tag>
    }
  }

  return (
    <Modal
      open={isVisibleNotificationDetail}
      onCancel={onClose}
      footer={null}
      width="90%"
      style={{ maxWidth: 1000 }}
      bodyStyle={{ padding: 0 }}
      centered
      destroyOnClose
    >
      <Row gutter={[0, 0]}>
        {/* Phần ảnh sản phẩm - responsive */}
        <Col xs={24} sm={24} md={12} lg={12} xl={10}>
          <div style={{ height: '100%', minHeight: 250 }}>
            <Image
              alt={postTitle}
              src={imageUrl ? `${URL_SERVER_IMAGE}${imageUrl}` : 'https://via.placeholder.com/300'}
              style={{
                objectFit: 'cover',
                width: '100%',
                height: '100%'
              }}
              preview={{
                mask: (
                  <div>
                    <EyeOutlined />
                    <span style={{ marginLeft: 8 }}>Xem ảnh lớn</span>
                  </div>
                )
              }}
            />
          </div>
        </Col>

        {/* Phần thông tin sản phẩm - responsive */}
        <Col xs={24} sm={24} md={12} lg={12} xl={14}>
          <div style={{ padding: '10px 14px' }}>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Space>
                {getStatusBadge(isApproved)}
                {getCategoryBadge(category)}
              </Space>
            </div>

            <Title level={3} style={{ marginTop: 0, marginBottom: 16 }}>
              {postTitle}
            </Title>

            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div className="product-info-section">
                <Row gutter={[16, 16]} align="middle">
                  <Col xs={24} sm={24} md={24}>
                    <Space align="center">
                      <Avatar icon={<UserOutlined />} size="large" />
                      <div>
                        <Text type="secondary">{category === 'gift' ? 'Người tặng' : 'Người đổi'}</Text>
                        <Paragraph strong style={{ marginBottom: 0, fontSize: 16 }}>
                          {ownerName}
                        </Paragraph>
                      </div>
                    </Space>
                  </Col>

                  {receiverName && (
                    <Col xs={24} sm={24} md={24}>
                      <Space align="center">
                        <Avatar icon={<UserOutlined />} size="large" />
                        <div>
                          <Text type="secondary">Người nhận</Text>
                          <Paragraph strong style={{ marginBottom: 0, fontSize: 16 }}>
                            {receiverName}
                          </Paragraph>
                        </div>
                      </Space>
                    </Col>
                  )}
                </Row>
              </div>

              <Divider style={{ margin: '16px 0' }} />

              <div className="contact-info-section">
                <Title level={5} style={{ display: 'flex', alignItems: 'center' }}>
                  <InfoCircleOutlined style={{ marginRight: 8 }} />
                  Thông tin liên hệ
                </Title>
                <Space direction="vertical" size="small" style={{ width: '100%', marginTop: 8 }}>
                  {contact && (
                    <Paragraph style={{ marginBottom: 8, fontSize: 15 }}>
                      <PhoneOutlined style={{ marginRight: 8 }} />
                      {contact}
                    </Paragraph>
                  )}
                  <Space size="middle" wrap>
                    {facebookLink && (
                      <a href={facebookLink} target="_blank" rel="noopener noreferrer">
                        <Button type="primary" ghost icon={<FacebookOutlined />}>
                          Xem Facebook
                        </Button>
                      </a>
                    )}
                    <Button type="primary" icon={<MessageOutlined />}>
                      Liên hệ ngay
                    </Button>
                  </Space>
                </Space>
              </div>
            </Space>
          </div>
        </Col>
      </Row>
    </Modal>
  )
}
export default NotificationDetail
