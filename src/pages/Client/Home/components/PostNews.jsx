import React, { useCallback, useEffect, useState } from 'react'
import { Card, Row, Col, Button, Avatar, Tooltip, Badge, Typography, Select, Empty } from 'antd'
import styles from '../scss/PostNews.module.scss'
import { useNavigate } from 'react-router-dom'
import withAuth from 'hooks/useAuth'
import { getPostPagination } from 'features/client/post/postThunks'
import { resetPosts, setCityFilter } from 'features/client/post/postSlice'
import { useDispatch, useSelector } from 'react-redux'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/vi'
import imageNotFound from 'assets/images/others/imagenotfound.webp'
import { getValidImageUrl } from 'helpers/helper'
import { useGiftRequest } from 'pages/Client/Request/GiftRequest/useRequestGift'
import { ContactInfoModal } from 'pages/Client/Request/GiftRequest/components/ContactInfoModal'
import { GiftRequestConfirmModal } from 'pages/Client/Request/GiftRequest/components/GiftRequestConfirmModal'
import FormExchangeModal from 'pages/Client/Request/ExchangeRequest/FormExchange/FormExchange'
import { setExchangeFormModalVisible } from 'features/client/request/exchangeRequest/exchangeRequestSlice'
import { ArrowDownOutlined, GiftOutlined, SwapOutlined } from '@ant-design/icons'
import PostCardSkeleton from 'components/common/Skeleton/PostCardSkeleton'
import { FaMapMarkerAlt } from 'react-icons/fa'
import { locationService } from 'services/client/locationService'
import { getAvatarPostNews } from 'hooks/useAvatar'

dayjs.extend(relativeTime)
dayjs.locale('vi')
const { Title, Text, Paragraph } = Typography
const PostNews = () => {
  const [curPage, setCurPage] = useState(1)
  const [isSearchMode, setIsSearchMode] = useState(false)
  const [selectedCity, setSelectedCity] = useState(null)
  const [VIETNAMESE_CITIES, SET_VIETNAMESE_CITIES] = useState(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { isExchangeFormModalVisible } = useSelector(state => state.exchangeRequest)
  const { posts, isError, isLoading, hasMore, query, cityFilter } = useSelector(state => state.post)
  const { user } = useSelector(state => state.auth)
  const { handleGiftRequest, handleInfoSubmit, handleRequestConfirm } = useGiftRequest()

  const pageSizeContanst = 8

  const fetchCity = useCallback(async () => {
    const cachedCities = localStorage.getItem('vietnameseCities')

    if (cachedCities) {
      SET_VIETNAMESE_CITIES(JSON.parse(cachedCities))
    } else {
      try {
        const data = await locationService.getCity()
        if (data.data.status === 200) {
          SET_VIETNAMESE_CITIES(data.data.data)
          localStorage.setItem('vietnameseCities', JSON.stringify(data.data.data))
        }
      } catch (error) {
        if (error.response?.data?.status === 404) {
          throw error
        }
      }
    }
  }, [])

  useEffect(() => {
    fetchCity()
  }, [fetchCity])

  const fetchPost = useCallback(() => {
    dispatch(
      getPostPagination({
        current: 1,
        pageSize: pageSizeContanst,
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
        pageSize: pageSizeContanst,
        query
      })
    )
  }

  const goDetail = _id => {
    navigate(`/post/${_id}/detail`)
  }

  const AuthButton = withAuth(Button)

  const filteredPosts = posts?.filter(
    post =>
      post.isApproved && // Only show approved posts
      !post.isPtiterOnly && // Add this condition to exclude PTIT posts
      (!query || post.title.toLowerCase().includes(query.toLowerCase())) &&
      (!cityFilter || post.city === cityFilter)
  )

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
        <Tooltip title={`Bạn ơi, chờ ${item.user_id?.name} xác nhận nhé!`}>
          <Button className={styles.actionButton} disabled>
            Đã yêu cầu
          </Button>
        </Tooltip>
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

  const handleCityChange = value => {
    setSelectedCity(value)
    dispatch(setCityFilter(value))
  }
  const filterProvinces = (input, option) => {
    return option.label.toLowerCase().includes(input.toLowerCase())
  }
  return (
    <>
      <div className={styles.postWrap}>
        <div className={styles.postHeader}>
          <Title level={5} className={styles.postTitle}>
            {isSearchMode ? 'Kết quả tìm kiếm' : 'Sản phẩm dành cho bạn'}
          </Title>
          <div>
            <Select
              showSearch
              style={{ width: 180 }}
              placeholder="Chọn thành phố"
              value={selectedCity}
              optionFilterProp="children"
              filterOption={filterProvinces}
              onChange={handleCityChange}
              options={VIETNAMESE_CITIES}
              allowClear
            />
          </div>
        </div>

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
                          <Paragraph
                            className={styles.itemTitle}
                            onClick={() => goDetail(item._id)}
                            ellipsis={{ rows: 2 }}
                          >
                            {item.title}
                          </Paragraph>
                        </Tooltip>
                      }
                    />

                    <div className={styles.locationRow}>
                      <div className={styles.userGroup}>
                        <Avatar size="small" className={styles.avtUser} src={getAvatarPostNews(item?.user_id)} />
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
        {/* )} */}

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
