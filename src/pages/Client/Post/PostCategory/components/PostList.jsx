import React, { useState, useEffect, useCallback } from 'react'
import { Row, Col, Card, Button, Avatar, Tabs, Typography, Select, Pagination, Tooltip } from 'antd'
import { GiftOutlined, SwapOutlined } from '@ant-design/icons'
import TabPane from 'antd/es/tabs/TabPane'
import styles from '../scss/PostList.module.scss'
import imageNotFound from 'assets/images/others/imagenotfound.webp'
import { useSelector, useDispatch } from 'react-redux'
import { getPostCategory, getPostPtitPagination } from '../../../../../features/client/post/postThunks'
import { resetPage, clearPosts } from '../../../../../features/client/post/postSlice'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/vi'
import withAuth from 'hooks/useAuth'
import { getValidImageUrl } from 'helpers/helper'
import { useNavigate, useParams } from 'react-router-dom'
import { useGiftRequest } from '../../../Request/GiftRequest/useRequestGift'
import ContactInfoModal from '../../../Request/GiftRequest/components/ContactInfoModal'
import { GiftRequestConfirmModal } from '../../../Request/GiftRequest/components/GiftRequestConfirmModal'
import FormExchangeModal from '../../../Request/ExchangeRequest/FormExchange'
import { setExchangeFormModalVisible } from '../../../../../features/client/request/exchangeRequest/exchangeRequestSlice'
import notFoundPost from 'components/feature/post/notFoundPost'
import PostCardRowSkeleton from 'components/common/Skeleton/PostCardRowSkeleton'
import { locationService } from 'services/client/locationService'
import { getAvatarPost } from 'hooks/useAvatar'
import logoptit from 'assets/images/logo/Ptit-penannt.png'
const { Text } = Typography

dayjs.extend(relativeTime)
dayjs.locale('vi')
const PostList = () => {
  const params = useParams()
  const { category_id } = params
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('all')
  const [sortOrder, setSortOrder] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCity, setSelectedCity] = useState(null)
  const [VIETNAMESE_CITIES, SET_VIETNAMESE_CITIES] = useState(null)
  const [expandedTitles, setExpandedTitles] = useState({})
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { posts, ptitPosts, isError, isLoading, total, query } = useSelector(state => state.post)

  // Fetch city data only once
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

  // Optimized useEffect to fetch posts data
  useEffect(() => {
    // Reset state and fetch new data when filter params change
    dispatch(clearPosts())
    dispatch(resetPage())

    // Define fetch parameters
    const params = {
      current: currentPage,
      pageSize: 10,
      category_id: category_id !== 'all' ? category_id : null,
      city: selectedCity,
      type: activeTab === 'all' ? null : activeTab,
      query: query || ''
    }

    // Check if category is PTIT to use the specific API
    if (category_id === 'ptit') {
      dispatch(getPostPtitPagination(params))
    } else {
      // Use the regular API for other categories
      dispatch(getPostCategory(params))
    }
  }, [dispatch, currentPage, category_id, selectedCity, activeTab, query])

  const handleTabChange = key => {
    setActiveTab(key)
    setCurrentPage(1) // Reset to first page when changing tabs
  }

  const handleCityChange = value => {
    setSelectedCity(value)
    setCurrentPage(1) // Reset to first page when changing city
  }

  const handleSortChange = value => {
    setSortOrder(value)
  }

  const handlePageChange = page => {
    setCurrentPage(page)
  }

  // Determine which posts array to use based on category_id
  const postsToUse = category_id === 'ptit' ? ptitPosts : posts

  const filteredPosts = postsToUse.filter(post => {
    if (activeTab === 'all') return true
    return post.type === activeTab
  })

  const sortedPosts = filteredPosts.sort((a, b) => {
    if (sortOrder === 'newest') {
      return dayjs(b.created_at).diff(dayjs(a.created_at))
    } else {
      return dayjs(a.created_at).diff(dayjs(b.created_at))
    }
  })

  const goDetail = id => {
    navigate(`/${id}`)
  }

  const AuthButton = withAuth(Button)
  const { handleGiftRequest, handleInfoSubmit, handleRequestConfirm } = useGiftRequest()
  const { isExchangeFormModalVisible } = useSelector(state => state.exchangeRequest)
  const handleRequest = post => {
    handleGiftRequest(post, post.type)
  }

  const filterProvinces = (input, option) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
  }

  const toggleTitleExpand = postId => {
    setExpandedTitles(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }))
  }

  const renderButton = item => {
    const isMe = item?.user_id?._id === user._id
    if (item?.type === 'gift') {
      return (
        <Tooltip
          title={
            item?.isRequested
              ? `Bạn ơi, chờ ${item.user_id?.name} xác nhận nhé!`
              : isMe
                ? 'Bạn không thể thao tác với sản phẩm của chính bạn'
                : ''
          }
        >
          <AuthButton
            icon={<GiftOutlined />}
            type="primary"
            className={styles.ButtonChat}
            onClick={() => handleRequest(item)}
            disabled={item?.isRequested || isMe}
          >
            {item?.isRequested ? 'Đã yêu cầu' : 'Nhận'}
          </AuthButton>
        </Tooltip>
      )
    } else if (item?.type === 'exchange') {
      return (
        <Tooltip
          title={
            item?.isRequested
              ? `Bạn ơi, chờ ${item.user_id?.name} xác nhận nhé!`
              : isMe
                ? 'Bạn không thể thao tác với sản phẩm của chính bạn'
                : ''
          }
        >
          <AuthButton
            icon={<SwapOutlined />}
            type="default"
            className={styles.ButtonChat}
            onClick={() => handleRequest(item)}
            disabled={item?.isRequested || isMe}
          >
            {item?.isRequested ? 'Đã yêu cầu' : 'Đổi'}
          </AuthButton>
        </Tooltip>
      )
    }
    return null
  }

  const renderTitle = post => {
    if (!post?.title) return <Text strong>Không có tiêu đề</Text>

    const title = post.title
    const isTitleLong = title.length > 50 // Giới hạn 50 ký tự cho tiêu đề
    const isExpanded = expandedTitles[post._id]

    if (!isTitleLong || isExpanded) {
      return (
        <div className={styles.titleContainer}>
          <Text strong onClick={() => goDetail(post?.slug || post?._id)} className={styles.title}>
            {title}
          </Text>
          {isTitleLong && (
            <Button
              type="link"
              size="small"
              onClick={e => {
                e.stopPropagation()
                toggleTitleExpand(post._id)
              }}
              className={styles.showLessButton}
            >
              Thu gọn
            </Button>
          )}
        </div>
      )
    } else {
      return (
        <div className={styles.titleContainer}>
          <Text strong onClick={() => goDetail(post?.slug || post?._id)} className={styles.title}>
            {title.substring(0, 50)}...
          </Text>
          <Button
            type="link"
            size="small"
            onClick={e => {
              e.stopPropagation()
              toggleTitleExpand(post._id)
            }}
            className={styles.expandButton}
          >
            Xem thêm
          </Button>
        </div>
      )
    }
  }

  return (
    <div className={styles.contentWrap}>
      <div className={styles.topContent}>
        <div className={styles.Tabs}>
          <Tabs activeKey={activeTab} tabBarStyle={{ margin: 0 }} onChange={handleTabChange}>
            <TabPane tab="Tất cả" key="all" />
            <TabPane tab="Trao tặng" key="gift" />
            <TabPane tab="Trao đổi" key="exchange" />
          </Tabs>
        </div>
        <div className={styles.filterContainer} style={{ display: 'flex', gap: '10px' }}>
          <Select
            showSearch
            style={{ width: 150 }}
            placeholder="Chọn thành phố"
            value={selectedCity}
            optionFilterProp="children"
            filterOption={filterProvinces}
            onChange={handleCityChange}
            options={VIETNAMESE_CITIES}
            allowClear
          />
          <Select
            value={sortOrder}
            style={{ width: 120 }}
            size="middle"
            onChange={handleSortChange}
            options={[
              { value: 'newest', label: 'Tin mới nhất' },
              { value: 'oldest', label: 'Tin cũ nhất' }
            ]}
          />
        </div>
      </div>
      {isLoading || isError ? (
        <Row gutter={[8, 8]}>
          {[...Array(10)].map((_, index) => (
            <Col xs={24} sm={12} key={index}>
              <PostCardRowSkeleton />
            </Col>
          ))}
        </Row>
      ) : sortedPosts.length > 0 ? (
        <Row gutter={[8, 8]}>
          {sortedPosts.map(item => (
            <Col xs={24} sm={12} key={item?._id || item?.id}>
              <Card
                className={styles.Card}
                hoverable
                cover={
                  <div className={styles.imageWrapper}>
                    <img
                      loading="lazy"
                      alt={item?.title || ''}
                      src={getValidImageUrl(item?.image_url)}
                      onError={e => {
                        e.target.onerror = null
                        e.target.src = imageNotFound
                      }}
                      onClick={() => goDetail(item?._id)}
                    />
                    {item.isPtiterOnly && <img className={styles.logoptit} alt="logo-ptit" src={logoptit} />}
                  </div>
                }
              >
                <div className={styles.Container}>
                  <span className={styles.status}>{item?.type === 'gift' ? 'Trao tặng' : 'Trao đổi'}</span>
                  {renderTitle(item)}

                  <div className={styles.userText}>
                    <Avatar className={styles.avtUser} src={getAvatarPost(item?.user_id)} />
                    <Text className={styles.TextUser}>{item?.user_id?.name}</Text>
                  </div>
                  <div className={styles.TimeRole}>
                    <span className={styles.time}>
                      {dayjs(item?.created_at).isValid() ? dayjs(item?.created_at).fromNow() : 'Không rõ thời gian'}
                    </span>
                    <span> • </span>
                    <span>{item?.city?.split(',')?.slice(-1)[0] || ''}</span>
                  </div>

                  {renderButton(item)}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        notFoundPost()
      )}
      <Pagination
        className={styles.pagination}
        current={currentPage}
        total={total}
        onChange={handlePageChange}
        pageSize={10}
        showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} bài`}
      />
      <ContactInfoModal onSubmit={handleInfoSubmit} />
      <GiftRequestConfirmModal onConfirm={handleRequestConfirm} />
      <FormExchangeModal
        visible={isExchangeFormModalVisible}
        onClose={() => dispatch(setExchangeFormModalVisible(false))}
      />
    </div>
  )
}

export default PostList
