import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Table, Tabs, Typography, Button, Badge, Image, Space, Popconfirm, message, Row, Col, Card, Empty } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { getReceiveRequestGift } from 'features/client/request/giftRequest/giftRequestThunks'
import { getExchangeRequest } from 'features/client/request/exchangeRequest/exchangeRequestThunks'
import { getPostGiftPagination, rePost } from 'features/client/post/postThunks'
import { URL_SERVER_IMAGE } from 'config/url_server'
import { RegistrationDrawer } from '../../Drawer/RegistrationDrawer/RegistrationDrawer'
import { ExchangeDrawer } from '../../Drawer/ExchangeDrawer/ExchangeDrawer'
import dayjs from 'dayjs'
import styles from './Scss/ExpriedListing.module.scss'
import getPostError from 'components/feature/post/getPostError'
import PostDetail from '../components/PostDetail/PostDetail'
import { Repeat2 } from 'lucide-react'

const { TabPane } = Tabs

export const ExpiredListings = ({ activeSubTab, setActiveSubTab, refreshKey, isActive }) => {
  const dispatch = useDispatch()
  const { posts = [], total = 0, isLoading, isError, viewMode } = useSelector(state => state.post)
  const [selectedListing, setSelectedListing] = useState(null)
  const [visibleDrawer, setVisibleDrawer] = useState(false)
  const [visibleExchangeDrawer, setVisibleExchangeDrawer] = useState(false)
  const [receiveRequests, setReceiveRequests] = useState([])
  const [exchangeRequests, setExchangeRequests] = useState([])
  const [isModalDetail, setIsModalDetail] = useState(false)
  const [tabCounts, setTabCounts] = useState({
    all: 0,
    gift: 0,
    exchange: 0
  })
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  })
  const [requestPagination, setRequestPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  })

  const paginationRef = useMemo(
    () => ({
      current: pagination.current,
      pageSize: pagination.pageSize
    }),
    [pagination.current, pagination.pageSize]
  )

  const fetchParams = useMemo(
    () => ({
      current: paginationRef.current,
      pageSize: paginationRef.pageSize,
      status: 'inactive',
      type: activeSubTab !== 'all' ? activeSubTab : undefined
    }),
    [activeSubTab, paginationRef]
  )

  const fetchData = useCallback(async () => {
    if (!isActive) return

    try {
      const response = await dispatch(getPostGiftPagination(fetchParams)).unwrap()
      if (response?.data?.data) {
        const allPosts = response.data.data
        setTabCounts({
          all: response.data.total || 0,
          gift: allPosts.filter(post => post.type === 'gift').length,
          exchange: allPosts.filter(post => post.type === 'exchange').length
        })
      }
    } catch (error) {
      // console.error('Error fetching posts:', error)
      throw error
    }
  }, [dispatch, fetchParams, isActive])

  useEffect(() => {
    setPagination(prev => ({
      ...prev,
      total
    }))
  }, [total])

  useEffect(() => {
    fetchData()
  }, [fetchData, refreshKey])

  const getRequests = useCallback(
    async (listing, paginationParams = null) => {
      const params = paginationParams || {
        current: requestPagination.current,
        pageSize: requestPagination.pageSize,
        post_id: listing?._id
      }

      try {
        if (listing.type === 'exchange') {
          const response = await dispatch(getExchangeRequest(params)).unwrap()
          const requestsData = response.data?.receiveRequests || []
          const filteredRequests = requestsData.filter(request => request.post_id?._id === listing._id)
          setExchangeRequests(filteredRequests)
          setVisibleExchangeDrawer(true)
          setVisibleDrawer(false)
          setRequestPagination(prev => ({
            ...prev,
            total: response.total || filteredRequests.length
          }))
        } else if (listing.type === 'gift') {
          const response = await dispatch(getReceiveRequestGift(params)).unwrap()
          const filteredRequests = response.data.filter(request => request.post_id._id === listing._id)
          setReceiveRequests(filteredRequests)
          setVisibleDrawer(true)
          setVisibleExchangeDrawer(false)
          setRequestPagination(prev => ({
            ...prev,
            total: response.total || filteredRequests.length
          }))
        }
      } catch (error) {
        setExchangeRequests([])
        setReceiveRequests([])
      }
    },
    [dispatch, requestPagination]
  )

  const handleViewRegistrations = async listing => {
    setSelectedListing(listing)
    setRequestPagination({
      current: 1,
      pageSize: 10,
      total: 0
    })
    await getRequests(listing, { current: 1, pageSize: 10, post_id: listing._id })
  }

  const handleTableChange = pagination => {
    setPagination(prev => ({
      ...prev,
      current: pagination.current,
      pageSize: pagination.pageSize
    }))
  }

  const handleRequestPaginationChange = async pagination => {
    setRequestPagination(prev => ({
      ...prev,
      current: pagination.current,
      pageSize: pagination.pageSize
    }))

    if (selectedListing) {
      await getRequests(selectedListing, {
        current: pagination.current,
        pageSize: pagination.pageSize,
        post_id: selectedListing._id
      })
    }
  }

  const handleTabChange = key => {
    setActiveSubTab(key)
    setPagination(prev => ({
      ...prev,
      current: 1
    }))
  }

  const handlePostDetail = (e, post) => {
    if (e?.target?.closest('.ant-image') || e?.target?.closest('.ant-btn')) {
      return
    }
    setSelectedListing(post)
    setIsModalDetail(true)
  }

  const handleClosePostDetail = () => {
    setIsModalDetail(false)
    setSelectedListing(null)
  }

  const handleRepost = async post_id => {
    try {
      const res = await dispatch(rePost({ postId: post_id })).unwrap()
      const { status, message: msg } = res
      if (status === 201) {
        message.success(msg)
        fetchData()
      }
    } catch (error) {
      if (error.status === 404) {
        message.error(error?.message)
      }
    }
  }

  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'image_url',
      key: 'image',
      width: 120,
      render: images => (
        <Image
          src={`${URL_SERVER_IMAGE}${images[0]}`}
          alt="Sản phẩm"
          width={100}
          height={100}
          style={{ objectFit: 'cover' }}
          fallback="/default-product-image.png"
        />
      )
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: text => (
        <Space direction="vertical" size="small">
          <Typography.Text strong>{text}</Typography.Text>
        </Space>
      )
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: type => {
        const statusOK = type === 'exchange' ? 'success' : 'processing'
        const text = type === 'exchange' ? 'Trao đổi' : 'Trao tặng'
        return <Badge status={statusOK} text={text} />
      }
    },
    {
      title: 'Thời gian đăng',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 150,
      render: created_at => dayjs(created_at).format('DD/MM/YYYY HH:mm')
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 250,
      render: (_, record) => {
        const typeButton = record.type === 'gift' ? 'primary' : 'dashed'
        return (
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between' }}>
            <Button type={typeButton} onClick={() => handleViewRegistrations(record)}>
              {record.type === 'exchange' ? 'Xem người đổi' : 'Xem người nhận'}
            </Button>
            <Popconfirm
              onConfirm={() => handleRepost(record?._id)}
              placement="topRight"
              title={'Bạn chắc chắn muốn đăng lại bài này?'}
              okText="OK"
              cancelText="Hủy"
            >
              <Button>Đăng lại</Button>
            </Popconfirm>
          </div>
        )
      }
    }
  ]

  const renderCardView = () => (
    <Row gutter={[16, 16]} className={styles.cardGrid}>
      {posts.map(item => (
        <Col xs={24} sm={12} md={8} lg={6} key={item._id}>
          <Card
            hoverable
            className={styles.itemCard}
            cover={
              <div className={styles.imageWrapper}>
                <Image
                  src={`${URL_SERVER_IMAGE}${item.image_url[0]}`}
                  alt={item.title}
                  style={{ height: 200, objectFit: 'cover' }}
                />
              </div>
            }
            actions={[
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <Button
                  type={item.type === 'gift' ? 'primary' : 'dashed'}
                  onClick={() => handleViewRegistrations(item)}
                >
                  {item.type === 'exchange' ? 'Xem người đổi' : 'Xem người nhận'}
                </Button>
                <Popconfirm
                  onConfirm={() => handleRepost(item?._id)}
                  placement="topRight"
                  title={'Bạn chắc chắn muốn đăng lại bài này?'}
                  okText="OK"
                  cancelText="Hủy"
                >
                  <Button>
                    <Repeat2 />
                  </Button>
                </Popconfirm>
              </div>
            ]}
          >
            <Card.Meta
              title={<span onClick={() => handlePostDetail(null, item)}>{item.title}</span>}
              description={
                <Space direction="vertical" size="small">
                  <Badge
                    status={item.type === 'exchange' ? 'success' : 'processing'}
                    text={item.type === 'exchange' ? 'Trao đổi' : 'Trao tặng'}
                  />
                  <Typography.Text type="secondary">
                    {dayjs(item.created_at).format('DD/MM/YYYY HH:mm')}
                  </Typography.Text>
                </Space>
              }
            />
          </Card>
        </Col>
      ))}
    </Row>
  )

  const subTabItems = [
    { key: 'all', label: 'Tất cả', count: tabCounts.all },
    { key: 'gift', label: 'Trao tặng', count: tabCounts.gift },
    { key: 'exchange', label: 'Trao đổi', count: tabCounts.exchange }
  ]

  if (isError) {
    getPostError()
  }

  return (
    <>
      <Tabs activeKey={activeSubTab} onChange={handleTabChange} className={styles.subTabs}>
        {subTabItems.map(subTab => (
          <TabPane
            key={subTab.key}
            tab={
              <span className={styles.subTabLabel}>
                {subTab.label}
                {/* <span className={styles.subTabCount}>({subTab.count})</span> */}
              </span>
            }
          >
            {viewMode === 'table' ? (
              <Table
                columns={columns}
                dataSource={posts}
                rowKey="_id"
                pagination={{
                  ...pagination,
                  showSizeChanger: true,
                  showTotal: (total, range) => `${range[0]} - ${range[1]} của ${total} bài đăng`
                }}
                onChange={handleTableChange}
                loading={isLoading}
                scroll={{ x: 800 }}
                onRow={record => ({
                  onClick: e => handlePostDetail(e, record),
                  style: { cursor: 'pointer' }
                })}
              />
            ) : (
              renderCardView()
            )}
          </TabPane>
        ))}
      </Tabs>

      {posts.length === 0 && viewMode === 'card' && (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có dữ liệu" />
      )}

      <RegistrationDrawer
        visible={visibleDrawer}
        onClose={() => setVisibleDrawer(false)}
        listing={selectedListing}
        receiveRequests={receiveRequests}
        refetch={getRequests}
        onUpdateSuccess={fetchData}
        pagination={requestPagination}
        onPaginationChange={handleRequestPaginationChange}
      />

      <ExchangeDrawer
        visible={visibleExchangeDrawer}
        onClose={() => setVisibleExchangeDrawer(false)}
        listing={selectedListing}
        exchangeRequests={exchangeRequests}
        refetch={getRequests}
        onUpdateSuccess={fetchData}
        pagination={requestPagination}
        onPaginationChange={handleRequestPaginationChange}
      />

      <PostDetail isVisible={isModalDetail} onClose={handleClosePostDetail} post={selectedListing} />
    </>
  )
}
