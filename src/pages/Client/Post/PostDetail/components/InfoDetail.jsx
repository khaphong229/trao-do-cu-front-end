import React, { useEffect, useState } from 'react'
import { Button, Row, Col, Image, Typography, Divider, Avatar, Tooltip, Rate } from 'antd'
import { ClockCircleOutlined, EnvironmentOutlined, UserOutlined } from '@ant-design/icons'
import styles from './../scss/PostInfoDetail.module.scss'
import CreatePostModal from '../../CreatePost/CreatePost'
import withAuth from 'hooks/useAuth'
import { useDispatch, useSelector } from 'react-redux'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/vi'
import { useGiftRequest } from 'pages/Client/Request/GiftRequest/useRequestGift'
import ContactInfoModal from 'pages/Client/Request/GiftRequest/components/ContactInfoModal'
import { GiftRequestConfirmModal } from 'pages/Client/Request/GiftRequest/components/GiftRequestConfirmModal'
import FormExchangeModal from 'pages/Client/Request/ExchangeRequest/FormExchange/FormExchange'
import { setExchangeFormModalVisible } from 'features/client/request/exchangeRequest/exchangeRequestSlice'
import { getValidImageUrl } from 'helpers/helper'
import imageNotFound from 'assets/images/others/imagenotfound.webp'
import PostDetailSkeleton from 'components/common/Skeleton/PostDetailSkeleton'
import { updatePostRequestStatus } from 'features/client/post/postSlice'
import useInteraction from 'hooks/useInteraction'
import { getAvatarPost } from 'hooks/useAvatar'
import ModalContactDetail from './Modal/ModalContactDetail/ModalContactDetail'
import { getPostRating } from 'features/client/postRating/postRatingThunks'

const { Title, Text } = Typography

dayjs.extend(relativeTime)
dayjs.locale('vi')

const PostInfoDetail = () => {
  const { selectedPost } = useSelector(state => state.post)
  const { user } = useSelector(state => state.auth)
  const { postRating, total: totalRatings } = useSelector(state => state.postRating)
  const [contactModalVisible, setContactModalVisible] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [mainImage, setMainImage] = useState(null)
  const [expandTitle, setExpandTitle] = useState(false)
  const thumbnails = Array.isArray(selectedPost?.image_url) ? selectedPost.image_url : []
  const { isExchangeFormModalVisible } = useSelector(state => state.exchangeRequest)
  const AuthButton = withAuth(Button)
  const dispatch = useDispatch()

  const { batchClick } = useInteraction()
  const {
    handleGiftRequest: originalHandleGiftRequest,
    handleInfoSubmit,
    handleRequestConfirm: originalHandleRequestConfirm
  } = useGiftRequest()

  useEffect(() => {
    if (selectedPost && selectedPost.category_id) {
      batchClick(selectedPost.category_id || '')
    }
  }, [selectedPost, batchClick])

  // Fetch post ratings when component mounts
  useEffect(() => {
    dispatch(getPostRating())
  }, [dispatch])

  // Set a default rating of 5 stars
  const defaultRating = 5

  const handleRequestConfirm = async values => {
    try {
      await originalHandleRequestConfirm(values)
      // Update the request status in post state after successful request
      dispatch(
        updatePostRequestStatus({
          postId: selectedPost._id
        })
      )
    } catch (error) {
      // Error handling is already done in the original function
    }
  }

  if (!selectedPost) {
    return <PostDetailSkeleton />
  }

  const handleRequest = item => {
    if (!selectedPost.isRequested) {
      originalHandleGiftRequest(item, item.type)
    }
  }

  const renderActionButton = selectedPost => {
    if (!user) {
      return (
        <AuthButton
          onClick={() => handleRequest(selectedPost)}
          type="primary"
          size="large"
          className={styles.ButtonChat}
        >
          {selectedPost.type === 'gift' ? 'Nhận' : 'Đổi'}
        </AuthButton>
      )
    }

    if (selectedPost.isRequested) {
      return (
        <Button type="primary" size="large" className={styles.ButtonChat} disabled>
          Đã yêu cầu
        </Button>
      )
    }

    const isMe = selectedPost?.user_id?._id === user._id ? true : false
    return (
      <Tooltip title={isMe && 'Không thể thực hiện thao tác với bài đăng của bạn'}>
        <AuthButton
          disabled={isMe}
          onClick={() => handleRequest(selectedPost)}
          type="primary"
          size="large"
          className={styles.ButtonChat}
        >
          {selectedPost.type === 'gift' ? 'Nhận' : 'Đổi'}
        </AuthButton>
      </Tooltip>
    )
  }
  // Hiển thị modal khi click vào nút
  const showContactModal = () => {
    setContactModalVisible(true)
  }

  // Đóng modal
  const handleCloseModal = () => {
    setContactModalVisible(false)
  }

  // Xử lý hiển thị tiêu đề với chức năng xem thêm
  const renderTitle = () => {
    const title = selectedPost.title || 'Không có tiêu đề'
    const isTitleLong = title.length > 50 // Giới hạn 50 ký tự cho tiêu đề

    return (
      <div className={styles.titleContainer}>
        {expandTitle || !isTitleLong ? (
          <Title level={4} className={styles.postTitle}>
            {title}
            {isTitleLong && (
              <Button type="link" size="small" onClick={() => setExpandTitle(false)} className={styles.showLessButton}>
                Thu gọn
              </Button>
            )}
          </Title>
        ) : (
          <Title level={4} className={styles.postTitle}>
            {title.substring(0, 50)}...
            <Button type="link" size="small" onClick={() => setExpandTitle(true)} className={styles.expandButton}>
              Xem thêm
            </Button>
          </Title>
        )}
      </div>
    )
  }

  return (
    <div className={styles.ContentWrap}>
      <Row gutter={32}>
        <Col xs={24} md={12}>
          <Image
            src={getValidImageUrl(thumbnails)}
            alt="post main"
            width="100%"
            height={400}
            style={{ cursor: 'pointer', objectFit: 'cover' }}
            onError={e => {
              e.target.onerror = null
              e.target.src = imageNotFound
            }}
          />
          <Row gutter={16} style={{ marginTop: '20px' }}>
            {thumbnails.map((imageUrl, index) => (
              <Col key={index} span={6}>
                <Image
                  src={getValidImageUrl(imageUrl)}
                  onError={e => {
                    e.target.onError = null
                    e.target.src = imageNotFound
                  }}
                  alt={`image ${index + 1}`}
                  width="100%"
                  height={100}
                  style={{
                    border: mainImage === imageUrl ? '2px solid #1890ff' : '',
                    cursor: 'pointer',
                    objectFit: 'cover'
                  }}
                  onClick={() => setMainImage(imageUrl)}
                />
              </Col>
            ))}
          </Row>
        </Col>

        <Col xs={24} md={12}>
          <Title level={3} className={styles.statusText}>
            {selectedPost.type === 'gift' ? 'Trao tặng' : 'Trao đổi'}
          </Title>
          {renderTitle()}
          <div>
            <Text className={styles.textAdress}>
              <EnvironmentOutlined />{' '}
              {/* {selectedPost?.specificLocation
                ? selectedPost.specificLocation.startsWith(',')
                  ? selectedPost.specificLocation.slice(1)
                  : selectedPost.specificLocation
                : 'Không rõ địa điểm'} */}
              {selectedPost?.city ? selectedPost?.city : 'Không rõ địa điểm'}
            </Text>
            <Text className={styles.textAdress}>
              <ClockCircleOutlined />{' '}
              {dayjs(selectedPost?.created_at).isValid()
                ? dayjs(selectedPost?.created_at).fromNow()
                : 'Không rõ thời gian'}
            </Text>
          </div>

          <Row className={styles.rowGive} gutter={15}>
            <Col span={12}>
              <Button type="default" size="large" className={styles.ButtonNumber} onClick={showContactModal}>
                Thông tin liên hệ
              </Button>
            </Col>
            <Col span={12}>{renderActionButton(selectedPost)}</Col>
          </Row>
          <ModalContactDetail visible={contactModalVisible} onClose={handleCloseModal} />

          <Divider />
          <div className={styles.SellerInfo}>
            <div className={styles.InfoName}>
              <Avatar className={styles.avtUser} src={getAvatarPost(selectedPost?.user_id)} icon={<UserOutlined />} />
              <div>
                <Text className={styles.TextName}>{selectedPost?.user_id?.name || 'Người dùng'}</Text>
                <Text className={styles.TextStatus}>
                  <span className={styles.Status} />
                  {`Đã tham gia ${
                    dayjs(selectedPost?.user_id?.created_at).isValid()
                      ? dayjs(selectedPost?.user_id?.created_at).fromNow()
                      : 'Không rõ thời gian'
                  }`}
                </Text>
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div className={styles.ratingContainer}>
                <Rate disabled defaultValue={defaultRating} value={defaultRating} />
                <Text className={styles.Evaluate}>{totalRatings || 0} đánh giá</Text>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      <ContactInfoModal onSubmit={handleInfoSubmit} />
      <GiftRequestConfirmModal onConfirm={handleRequestConfirm} />
      <FormExchangeModal
        visible={isExchangeFormModalVisible}
        onClose={() => dispatch(setExchangeFormModalVisible(false))}
      />
      <CreatePostModal visible={isModalVisible} onClose={() => setIsModalVisible(false)} />
    </div>
  )
}

export default PostInfoDetail
