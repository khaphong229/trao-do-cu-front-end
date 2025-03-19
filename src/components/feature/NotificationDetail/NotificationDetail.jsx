import React, { useState } from 'react'
import { Modal, Tag, Button, Divider, Typography, Row, Col, Space, Image, Carousel } from 'antd'
import {
  FacebookOutlined,
  PhoneOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  InfoCircleOutlined,
  GiftOutlined,
  SwapOutlined,
  LeftOutlined,
  RightOutlined
} from '@ant-design/icons'
import { setVisibleNotificationDetail } from 'features/client/notification/notificationSlice'
import { useDispatch, useSelector } from 'react-redux'
import { URL_SERVER_IMAGE } from 'config/url_server'
import { useNavigate } from 'react-router-dom'
import styles from './styles.module.scss'

const { Title, Text, Paragraph } = Typography

const NotificationDetail = ({ notification }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isVisibleNotificationDetail } = useSelector(state => state.notification)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { user } = useSelector(state => state.auth)
  const carouselRef = React.useRef()

  const onClose = () => {
    dispatch(setVisibleNotificationDetail(false))
  }

  const goToManagementPost = receiverName => {
    dispatch(setVisibleNotificationDetail(false))
    navigate(receiverName !== user.name ? '/management-post?tab=active' : '/management-post?tab=requested')
  }

  if (!notification) return null

  const { isApproved, type, postTitle, imageUrl, ownerName, receiverName, contact, facebookLink, time } = notification

  const handlePrev = () => {
    carouselRef.current.prev()
  }

  const handleNext = () => {
    carouselRef.current.next()
  }

  const afterChange = current => {
    setCurrentImageIndex(current)
  }

  const getStatusBadge = isApproved => {
    if (isApproved) {
      return (
        <Tag icon={<CheckCircleOutlined />} color="success">
          Đã đồng ý
        </Tag>
      )
    } else {
      return (
        <Tag icon={<ClockCircleOutlined />} color="processing">
          Chờ duyệt
        </Tag>
      )
    }
  }

  const getCategoryBadge = type => {
    if (type === 'receive' || type === 'yêu cầu nhận') {
      return (
        <Tag icon={<GiftOutlined />} color="gold">
          Trao tặng
        </Tag>
      )
    } else {
      return (
        <Tag icon={<SwapOutlined />} color="lime">
          Trao đổi
        </Tag>
      )
    }
  }

  const renderModalFooter = () => {
    return (
      <div className={styles.modalFooter}>
        <Button
          type="primary"
          size="middle"
          onClick={() => goToManagementPost(receiverName)}
          className={styles.managementButton}
        >
          Di chuyển tới quản lý sản phẩm <RightOutlined />
        </Button>
      </div>
    )
  }

  return (
    <Modal
      open={isVisibleNotificationDetail}
      onCancel={onClose}
      footer={renderModalFooter()}
      bodyStyle={{ padding: 0 }}
      width="90%"
      style={{ maxWidth: 700 }}
      centered
      destroyOnClose
      className={styles.notificationModal}
    >
      <Row gutter={[0, 0]} className={styles.modalRow}>
        {/* Phần ảnh sản phẩm - responsive */}
        <Col xs={24} sm={24} md={12} lg={12} xl={10}>
          <div className={styles.imageContainer}>
            {imageUrl && imageUrl.length > 0 ? (
              <>
                <Carousel ref={carouselRef} afterChange={afterChange} dots={false} className={styles.carousel}>
                  {imageUrl.map((img, index) => (
                    <div key={index} className={styles.carouselItem}>
                      <Image
                        alt={`${postTitle}-${index}`}
                        src={`${URL_SERVER_IMAGE}${img}`}
                        className={styles.image}
                        preview={{
                          mask: (
                            <div className={styles.previewMask}>
                              <EyeOutlined className={styles.previewIcon} />
                              Xem ảnh
                            </div>
                          ),
                          getContainer: () => document.body
                        }}
                        fallback="https://via.placeholder.com/400x300?text=Ảnh+lỗi"
                      />
                    </div>
                  ))}
                </Carousel>

                {imageUrl.length > 1 && (
                  <>
                    <Button
                      className={`${styles.carouselButton} ${styles.carouselButtonLeft}`}
                      icon={<LeftOutlined />}
                      onClick={handlePrev}
                      shape="circle"
                    />
                    <Button
                      className={`${styles.carouselButton} ${styles.carouselButtonRight}`}
                      icon={<RightOutlined />}
                      onClick={handleNext}
                      shape="circle"
                    />
                    <div className={styles.imagePagination}>
                      {currentImageIndex + 1}/{imageUrl.length}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className={styles.noImage}>
                <Image
                  alt="No image"
                  src="https://via.placeholder.com/400x300?text=Không+có+ảnh"
                  className={styles.image}
                  preview={false}
                />
              </div>
            )}
            <div className={styles.timeLabel}>{time || 'Không xác định'}</div>
          </div>
        </Col>

        {/* Phần thông tin sản phẩm - responsive */}
        <Col xs={24} sm={24} md={12} lg={12} xl={14}>
          <div className={styles.contentContainer}>
            <div className={styles.statusContainer}>
              <Space size="small">
                {getStatusBadge(isApproved)}
                {getCategoryBadge(type)}
              </Space>
            </div>

            <Title level={3} className={styles.postTitle}>
              {postTitle}
            </Title>

            <Space direction="vertical" size="large" className={styles.infoSection}>
              <div>
                <Row gutter={[16, 16]} align="middle">
                  {isApproved && (
                    <Col xs={24}>
                      <Space align="center">
                        <div>
                          <Text type="secondary">
                            {type === 'receive' || type === 'yêu cầu nhận' ? 'Người tặng' : 'Người đổi'}
                          </Text>
                          <Paragraph strong style={{ marginBottom: 0, fontSize: 16 }}>
                            {ownerName}
                          </Paragraph>
                        </div>
                      </Space>
                    </Col>
                  )}

                  {!isApproved && receiverName && (
                    <Col xs={24}>
                      <Space align="center">
                        <div>
                          <Text type="secondary">Người yêu cầu</Text>
                          <Paragraph strong style={{ marginBottom: 0, fontSize: 16 }}>
                            {receiverName}
                          </Paragraph>
                        </div>
                      </Space>
                    </Col>
                  )}
                </Row>
              </div>

              <Divider className={styles.divider} />

              {isApproved && (
                <div className={styles.contactSection}>
                  <Title level={5} className={styles.contactTitle}>
                    <InfoCircleOutlined className={styles.titleIcon} />
                    Thông tin liên hệ
                  </Title>
                  <Space direction="vertical" size="small" className={styles.contactInfo}>
                    {contact && (
                      <Paragraph className={styles.phoneContainer}>
                        <PhoneOutlined className={styles.phoneIcon} />
                        <a href={`tel:${contact}`}>{contact}</a>
                      </Paragraph>
                    )}
                    <Space size="middle" wrap>
                      {facebookLink && facebookLink.includes('facebook') && (
                        <a href={facebookLink} target="_blank" rel="noopener noreferrer">
                          <Button type="primary" ghost icon={<FacebookOutlined />} size="middle">
                            Xem Facebook
                          </Button>
                        </a>
                      )}
                    </Space>
                  </Space>
                </div>
              )}

              {!isApproved && (
                <div className={styles.pendingNotice}>
                  <Paragraph type="secondary" className={styles.pendingText}>
                    <ClockCircleOutlined className={styles.pendingIcon} />
                    Thông tin liên hệ sẽ được hiển thị sau khi yêu cầu được duyệt
                  </Paragraph>
                </div>
              )}
            </Space>
          </div>
        </Col>
      </Row>
    </Modal>
  )
}

export default NotificationDetail
