import React, { useState, useEffect } from 'react'
import { Row, Col, Card, Button, Avatar, Tabs, Typography, Select, Pagination } from 'antd'
import TabPane from 'antd/es/tabs/TabPane'
import styles from '../scss/PostList.module.scss'
import imageNotFound from 'assets/images/others/imagenotfound.jpg'
import { useSelector, useDispatch } from 'react-redux'
import { getPostPagination } from '../../../../../features/client/post/postThunks'
import { resetPage, clearPosts } from '../../../../../features/client/post/postSlice'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/vi'
import withAuth from 'hooks/useAuth'
import { getValidImageUrl } from 'helpers/helper'
import avt from 'assets/images/logo/avtDefault.jpg'
import { useNavigate, useParams } from 'react-router-dom'
import { useGiftRequest } from '../../../Request/GiftRequest/useRequestGift'
import ContactInfoModal from '../../../Request/GiftRequest/components/ContactInfoModal'
import { GiftRequestConfirmModal } from '../../../Request/GiftRequest/components/GiftRequestConfirmModal'
import FormExchangeModal from '../../../Request/ExchangeRequest/FormExchange'
import { setExchangeFormModalVisible } from '../../../../../features/client/request/exchangeRequest/exchangeRequestSlice'
import { usePostStatus } from 'hooks/usePostStatus'
import getPostError from 'components/feature/post/getPostError'
import notFoundPost from 'components/feature/post/notFoundPost'
import PostCardRowSkeleton from 'components/common/Skeleton/PostCardRowSkeleton'
import { VIETNAMESE_CITIES } from 'constants/cityVN'
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

  const dispatch = useDispatch()
  const { posts, isError, isLoading, total } = useSelector(state => state.post)

  useEffect(() => {
    dispatch(clearPosts())
    dispatch(resetPage())
    dispatch(
      getPostPagination({
        current: currentPage,
        pageSize: 10,
        category_id: category_id !== 'all' ? category_id : null,
        city: selectedCity
      })
    )
  }, [dispatch, currentPage, category_id, selectedCity])

  const { user } = useSelector(state => state.auth)
  const { postsWithStatus, isChecking } = usePostStatus(posts, user?._id)

  const handleTabChange = key => {
    setActiveTab(key)
    dispatch(
      getPostPagination({
        current: 1,
        pageSize: 10,
        category_id: category_id ? category_id : null,
        type: key === 'all' ? null : key,
        city: selectedCity
      })
    )
  }

  const handleCityChange = value => {
    setSelectedCity(value)
    setCurrentPage(1)
  }

  const handleSortChange = value => {
    setSortOrder(value)
  }

  const handlePageChange = page => {
    setCurrentPage(page)
  }

  const filteredPosts = postsWithStatus.filter(post => {
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
    navigate(`/post/${id}/detail`)
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

  return (
    <div className={styles.contentWrap}>
      <div className={styles.topContent}>
        <div className={styles.Tabs}>
          <Tabs defaultActiveKey="all" tabBarStyle={{ margin: 0 }} onChange={handleTabChange}>
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
            defaultValue="newest"
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
      {isLoading || isChecking ? (
        <Row gutter={[8, 8]}>
          {[...Array(4)].map((_, index) => (
            <Col xs={24} sm={12} key={index}>
              <PostCardRowSkeleton />
            </Col>
          ))}
        </Row>
      ) : isError ? (
        getPostError()
      ) : sortedPosts.length > 0 ? (
        <Row gutter={[8, 8]}>
          {sortedPosts.map(item => (
            <Col xs={24} sm={12} key={item.id}>
              <Card
                className={styles.Card}
                hoverable
                cover={
                  <div className={styles.imageWrapper}>
                    <img
                      alt={item.title}
                      src={getValidImageUrl(item.image_url)}
                      onError={e => {
                        e.target.onerror = null
                        e.target.src = imageNotFound
                      }}
                      onClick={() => goDetail(item._id)}
                    />
                  </div>
                }
              >
                <div className={styles.Container}>
                  <Text strong onClick={() => goDetail(item._id)}>
                    {item.title}
                  </Text>
                  <span className={styles.status}>{item.type === 'gift' ? 'Trao tặng' : 'Trao đổi'}</span>
                  <div className={styles.TimeRole}>
                    <span className={styles.time}>
                      {dayjs(item.created_at).isValid() ? dayjs(item.created_at).fromNow() : 'Không rõ thời gian'}
                    </span>
                    <span> • </span>
                    <span>{item.city.split(',').slice(-1)[0]}</span>
                  </div>
                  <div className={styles.User}>
                    <div>
                      <Avatar className={styles.avtUser} src={item.avatar || avt} />
                      <Text className={styles.TextUser}>{item?.user_id?.name}</Text>
                    </div>
                    {item.type === 'gift' ? (
                      <AuthButton
                        color="primary"
                        variant="filled"
                        size="middle"
                        className={styles.ButtonChat}
                        onClick={() => handleRequest(item)}
                        disabled={item.isRequested}
                      >
                        {item.isRequested ? 'Đã yêu cầu' : 'Nhận'}
                      </AuthButton>
                    ) : (
                      <AuthButton
                        type="primary"
                        size="middle"
                        className={styles.ButtonChat}
                        onClick={() => handleRequest(item)}
                        disabled={item.isRequested}
                      >
                        {item.isRequested ? 'Đã yêu cầu' : 'Đổi'}
                      </AuthButton>
                    )}
                  </div>
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
