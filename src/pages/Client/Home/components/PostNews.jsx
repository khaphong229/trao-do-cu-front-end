import React, { useCallback, useEffect, useState } from 'react'
import { Card, Row, Col, Button, Avatar, Tooltip, Badge, Empty, Typography } from 'antd'
import styles from '../scss/PostNews.module.scss'
import { useNavigate } from 'react-router-dom'
import withAuth from 'hooks/useAuth'
import { getPostPagination } from 'features/client/post/postThunks'
import { resetPosts } from 'features/client/post/postSlice'
import { useDispatch, useSelector } from 'react-redux'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/vi'
import avt from 'assets/images/logo/avtDefault.webp'
import imageNotFound from 'assets/images/others/imagenotfound.webp'
import { getValidImageUrl } from 'helpers/helper'
import { useGiftRequest } from 'pages/Client/Request/GiftRequest/useRequestGift'
import { ContactInfoModal } from 'pages/Client/Request/GiftRequest/components/ContactInfoModal'
import { GiftRequestConfirmModal } from 'pages/Client/Request/GiftRequest/components/GiftRequestConfirmModal'
import FormExchangeModal from 'pages/Client/Request/ExchangeRequest/FormExchange/FormExchange'
import { setExchangeFormModalVisible } from 'features/client/request/exchangeRequest/exchangeRequestSlice'
import { URL_SERVER_IMAGE } from 'config/url_server'
import { ArrowDownOutlined, GiftOutlined, SwapOutlined } from '@ant-design/icons'
import PostCardSkeleton from 'components/common/Skeleton/PostCardSkeleton'
import { FaMapMarkerAlt } from 'react-icons/fa'

dayjs.extend(relativeTime)
dayjs.locale('vi')
const { Title, Text, Paragraph } = Typography
const PostNews = () => {
  const [curPage, setCurPage] = useState(1)
  const [isSearchMode, setIsSearchMode] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { isExchangeFormModalVisible } = useSelector(state => state.exchangeRequest)
  const { posts, isError, isLoading, hasMore, query } = useSelector(state => state.post)
  const { user } = useSelector(state => state.auth)
  const { handleGiftRequest, handleInfoSubmit, handleRequestConfirm } = useGiftRequest()

  const fetchPost = useCallback(() => {
    dispatch(
      getPostPagination({
        current: 1,
        pageSize: 8,
        query
      })
    )
  }, [dispatch, query])

  useEffect(() => {
    dispatch(resetPosts())
    fetchPost()
  }, [fetchPost, dispatch])
  useEffect(() => {
    setIsSearchMode(!!query)
  }, [query])

  const handleLoadMore = () => {
    const nextPage = curPage + 1
    setCurPage(nextPage)
    dispatch(
      getPostPagination({
        current: nextPage,
        pageSize: 8,
        query
      })
    )
  }

  const goDetail = _id => {
    navigate(`/post/${_id}/detail`)
  }

  const AuthButton = withAuth(Button)

  const filteredPosts = posts
    ?.filter(post => !query || post.title.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => dayjs(b.created_at).diff(dayjs(a.created_at)))

  const renderActionButton = item => {
    if (!user) {
      return item.type === 'gift' ? (
        <AuthButton
          icon={<GiftOutlined />}
          className={styles.actionButton}
          type="primary"
          onClick={() => handleGiftRequest(item, item.type)}
        >
          Nhận
        </AuthButton>
      ) : (
        <AuthButton
          icon={<SwapOutlined />}
          className={styles.actionButton}
          type="default"
          onClick={() => handleGiftRequest(item, item.type)}
        >
          Đổi
        </AuthButton>
      )
    }

    if (item.isRequested) {
      return (
        <Button className={styles.actionButton} disabled>
          Đã yêu cầu
        </Button>
      )
    }

    const isMe = item?.user_id?._id === user._id

    return (
      <Tooltip title={isMe ? 'Không thể thực hiện thao tác với bài đăng của bạn' : ''}>
        {item.type === 'gift' ? (
          <AuthButton
            icon={<GiftOutlined />}
            className={styles.actionButton}
            type="primary"
            disabled={isMe}
            onClick={() => handleGiftRequest(item, item.type)}
          >
            Nhận
          </AuthButton>
        ) : (
          <AuthButton
            icon={<SwapOutlined />}
            className={styles.actionButton}
            type="default"
            disabled={isMe}
            onClick={() => handleGiftRequest(item, item.type)}
          >
            Đổi
          </AuthButton>
        )}
      </Tooltip>
    )
  }
  return (
    <>
      <div className={styles.postWrap}>
        <Title level={5} className={styles.postTitle}>
          {isSearchMode ? 'Kết quả tìm kiếm' : 'Bài đăng mới nhất'}
        </Title>

        {(isLoading || isError) && (
          <Row gutter={[16, 0]} className={styles.itemsGrid}>
            {[...Array(8)].map((_, index) => (
              <Col key={index} xs={24} sm={12} md={8} lg={6}>
                <PostCardSkeleton />
              </Col>
            ))}
          </Row>
        )}

        {filteredPosts && filteredPosts.length > 0 ? (
          <Row gutter={[16, 0]} className={styles.itemsGrid}>
            {filteredPosts.map(item => (
              <Col key={item._id} xs={24} sm={12} md={8} lg={6}>
                <Badge.Ribbon
                  text={item.type === 'gift' ? 'Trao tặng' : 'Trao đổi'}
                  color={item.type === 'gift' ? 'red' : 'blue'}
                >
                  <Card
                    hoverable
                    className={styles.itemCard}
                    cover={
                      <div className={styles.imageWrapper} onClick={() => goDetail(item._id)}>
                        <img
                          loading="lazy"
                          alt={item.title}
                          src={getValidImageUrl(item.image_url) || '/placeholder.svg'}
                          onError={e => {
                            e.target.onerror = null
                            e.target.src = imageNotFound
                          }}
                        />
                      </div>
                    }
                    actions={[renderActionButton(item)]}
                  >
                    <Card.Meta
                      title={
                        <Tooltip title={item.title}>
                          <Text className={styles.itemTitle} onClick={() => goDetail(item._id)}>
                            {item.title}
                          </Text>
                        </Tooltip>
                      }
                      description={
                        <Paragraph className={styles.itemDesc} ellipsis={{ rows: 2 }}>
                          {item?.description || ''}
                        </Paragraph>
                      }
                    />

                    <div className={styles.locationRow}>
                      <div className={styles.userGroup}>
                        <Avatar
                          size="small"
                          className={styles.avtUser}
                          src={item?.user_id?.avatar ? `${URL_SERVER_IMAGE}${item.user_id.avatar}` : avt}
                        />
                        <Text type="secondary" className={styles.time}>
                          {dayjs(item.created_at).isValid() ? dayjs(item.created_at).fromNow() : 'Không rõ thời gian'}
                        </Text>
                      </div>
                      {item?.city && (item.city.includes('Thành phố') || item.city.includes('Tỉnh')) ? (
                        <Text type="secondary" className={styles.location}>
                          <FaMapMarkerAlt style={{ marginRight: 4, fontSize: '14px' }} />
                          {item.city.split('Thành phố')[1] || item.city.split('Tỉnh')[1]}
                        </Text>
                      ) : (
                        item?.city && (
                          <Text type="secondary" className={styles.location}>
                            {item.city.split('Thành phố')[1] || item.city.split('Tỉnh')[1]}
                          </Text>
                        )
                      )}
                    </div>
                  </Card>
                </Badge.Ribbon>
              </Col>
            ))}
          </Row>
        ) : (
          !isLoading && <Empty description="Không tìm thấy bài đăng nào" className={styles.emptyState} />
        )}

        {hasMore && !isSearchMode && (
          <div className={styles.buttonWrapper}>
            <Button
              icon={<ArrowDownOutlined />}
              onClick={handleLoadMore}
              loading={isLoading}
              type="link"
              className={styles.textMore}
            />
          </div>
        )}

        <ContactInfoModal onSubmit={handleInfoSubmit} />
        <GiftRequestConfirmModal onConfirm={handleRequestConfirm} />
        <FormExchangeModal
          visible={isExchangeFormModalVisible}
          onClose={() => dispatch(setExchangeFormModalVisible(false))}
        />
      </div>
    </>
  )
}

export default PostNews
