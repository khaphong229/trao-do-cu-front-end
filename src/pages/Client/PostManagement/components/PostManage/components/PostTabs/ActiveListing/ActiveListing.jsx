import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Tabs, Typography, Badge, Button, Table, Image, Space, Card, Row, Col, Empty, Modal, Spin } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { RegistrationDrawer } from '../../Drawer/RegistrationDrawer/RegistrationDrawer'
import { getPostGiftPagination } from 'features/client/post/postThunks'
import styles from './Scss/ActiveListing.module.scss'
import { ExchangeDrawer } from '../../Drawer/ExchangeDrawer/ExchangeDrawer'
import { getReceiveRequestGift } from 'features/client/request/giftRequest/giftRequestThunks'
import { getExchangeRequest } from 'features/client/request/exchangeRequest/exchangeRequestThunks'
import dayjs from 'dayjs'
import { URL_SERVER_IMAGE } from 'config/url_server'
import PostDetail from '../components/PostDetail/PostDetail'
import { ExpiredListings } from '../ExpiredListing/ExpriedListing'
import { AppstoreOutlined, ClockCircleOutlined, TableOutlined } from '@ant-design/icons'
import { setViewMode } from 'features/client/post/postSlice'

const { TabPane } = Tabs

export const ActiveListings = ({ activeSubTab, setActiveSubTab, refreshKey, isActive, onShowExpired }) => {
  const dispatch = useDispatch()
  const { posts = [], total = 0, isLoading, viewMode } = useSelector(state => state.post)
  const [activePosts, setActivePosts] = useState([]) // Store active posts separately
  const [activeTotal, setActiveTotal] = useState(0) // Store active total separately
  const [selectedListing, setSelectedListing] = useState(null)
  const [visibleDrawer, setVisibleDrawer] = useState(false)
  const [receiveRequests, setReceiveRequests] = useState([])
  const [exchangeRequests, setExchangeRequests] = useState([])
  const [visibleExchangeDrawer, setVisibleExchangeDrawer] = useState(false)
  const [isModalDetail, setIsModalDetail] = useState(false)
  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false)
  const [historyTabRefreshKey, setHistoryTabRefreshKey] = useState(0)
  const [activeTab, setActiveTab] = useState(activeSubTab || 'all') // Đồng bộ với activeSubTab ban đầu
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
  const [isTabLoading, setIsTabLoading] = useState(false) // State for tab loading spinner

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
      status: 'active',
      type: activeTab !== 'all' ? activeTab : undefined // Sử dụng activeTab thay vì activeSubTab
    }),
    [activeTab, paginationRef] // Thay đổi dependency thành activeTab
  )

  // Hàm để lấy số lượng bài đăng cho từng tab
  const fetchTabCounts = useCallback(async () => {
    if (!isActive) return

    try {
      const response = await dispatch(
        getPostGiftPagination({
          current: 1,
          pageSize: 1000, // Lấy đủ để đếm - điều chỉnh theo kích thước dữ liệu thực tế
          status: 'active'
        })
      ).unwrap()

      if (response?.data?.data) {
        const allPosts = response.data.data
        const total = response.data.total || 0

        // Đếm số lượng cho từng loại
        const giftCount = allPosts.filter(post => post.type === 'gift').length
        const exchangeCount = allPosts.filter(post => post.type === 'exchange').length

        setTabCounts({
          all: total,
          gift: giftCount,
          exchange: exchangeCount
        })
      }
    } catch (error) {
      console.error('Error fetching tab counts:', error)
    }
  }, [dispatch, isActive])

  const fetchData = useCallback(async () => {
    if (!isActive) return

    setIsTabLoading(true)
    try {
      const response = await dispatch(getPostGiftPagination(fetchParams)).unwrap()
      if (response?.data?.data) {
        const allPosts = response.data.data
        // Store active posts separately to prevent conflicts with modal
        setActivePosts(allPosts)
        setActiveTotal(response.data.total || 0)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setIsTabLoading(false)
    }
  }, [dispatch, fetchParams, isActive])

  // Chạy một lần khi component mount để lấy số lượng cho tabs
  useEffect(() => {
    if (isActive) {
      fetchTabCounts()
    }
  }, [fetchTabCounts, isActive, refreshKey])

  // Chạy mỗi khi thay đổi tab hoặc refresh
  useEffect(() => {
    fetchData()
  }, [fetchData, refreshKey])

  useEffect(() => {
    setPagination(prev => ({
      ...prev,
      total: activeTotal
    }))
  }, [activeTotal])

  const handleTableChange = pagination => {
    setPagination(prev => ({
      ...prev,
      current: pagination.current,
      pageSize: pagination.pageSize
    }))
  }

  const handleViewRegistrations = async listing => {
    setSelectedListing(listing)
    setRequestPagination({
      current: 1,
      pageSize: 10,
      total: 0
    })
    await getRequests(listing, { current: 1, pageSize: 10, post_id: listing._id })
  }

  const getRequests = async (listing, paginationParams = null) => {
    const params = paginationParams || {
      current: requestPagination.current,
      pageSize: requestPagination.pageSize,
      post_id: selectedListing._id
    }

    try {
      if (listing.type === 'exchange') {
        const response = await dispatch(getExchangeRequest(params)).unwrap()

        const requestsData = response.data?.exchangeRequests || []
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

  const showHistoryModal = () => {
    setHistoryTabRefreshKey(prev => prev + 1)
    setIsHistoryModalVisible(true)
  }

  const handleHistoryModalClose = () => {
    setIsHistoryModalVisible(false)
    // Refresh the active listings after closing the modal
    fetchData()
    fetchTabCounts() // Cập nhật lại số lượng tab khi đóng modal lịch sử
  }

  const handleTabChange = async key => {
    setIsTabLoading(true)
    setActiveTab(key) // Cập nhật activeTab
    setActiveSubTab(key) // Đồng bộ với activeSubTab
    setPagination(prev => ({
      ...prev,
      current: 1
    }))
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
          style={{ width: 100, height: 100, objectFit: 'cover' }}
          preview={false}
        />
      )
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <Space direction="vertical" size="small">
          <Typography.Text strong>{text}</Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: '12px' }} className={styles.descPost}>
            {record.description}
          </Typography.Text>
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
      width: 150,
      render: (_, record) => {
        const typeButton = record.type === 'gift' ? 'primary' : 'dashed'
        return (
          <Button type={typeButton} onClick={() => handleViewRegistrations(record)}>
            {record.type === 'exchange' ? 'Xem yêu cầu đổi' : 'Xem yêu cầu nhận'}
          </Button>
        )
      }
    },
    {
      title: 'Trạng thái duyệt',
      dataIndex: 'isApproved',
      key: 'isApproved',
      width: 150,
      render: isApproved => (
        <Badge
          status={isApproved ? 'success' : 'warning'}
          text={isApproved ? 'Đã duyệt' : 'Chưa duyệt'}
          className={styles.approvalBadge}
        />
      )
    }
  ]

  const subTabItems = [
    { key: 'all', label: `Tất cả ` },
    { key: 'gift', label: `Trao tặng ` },
    { key: 'exchange', label: `Trao đổi ` }
  ]

  const renderCardView = () => (
    <Row gutter={[16, 16]} className={styles.cardGrid}>
      {activePosts.map(item => (
        <Col xs={24} sm={12} md={8} lg={6} key={item._id}>
          <Card hoverable className={styles.itemCard} onClick={e => handlePostDetail(e, item)}>
            <div className={styles.imageContainer}>
              <Image preview={false} src={`${URL_SERVER_IMAGE}${item.image_url[0]}`} alt={item.title} />
              <div className={styles.ribbonWrapper}>
                <Badge.Ribbon
                  text={item.type === 'exchange' ? 'Trao đổi' : 'Trao tặng'}
                  color={item.type === 'exchange' ? 'green' : 'blue'}
                />
              </div>
            </div>
            <div className={styles.cardContent}>
              <Typography.Title level={5} ellipsis={{ rows: 1 }} className={styles.cardTitle}>
                {item.title}
              </Typography.Title>

              {/* Thêm badge trạng thái duyệt */}
              <div className={styles.approvalStatus}>
                <Badge
                  status={item.isApproved ? 'success' : 'warning'}
                  text={item.isApproved ? 'Đã duyệt' : 'Chưa duyệt'}
                />
              </div>

              <div className={styles.cardFooter}>
                <Typography.Text type="secondary" className={styles.dateInfo}>
                  <span className={styles.dateIcon}>
                    <ClockCircleOutlined />
                  </span>
                  {dayjs(item.created_at).format('DD/MM/YYYY')}
                </Typography.Text>

                <Button
                  type={item.type === 'gift' ? 'primary' : 'default'}
                  size="small"
                  className={styles.actionButton}
                  onClick={e => {
                    e.stopPropagation()
                    handleViewRegistrations(item)
                  }}
                >
                  Xem yêu cầu
                </Button>
              </div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  )

  return (
    <>
      <div className={styles.tabHeader}>
        <Tabs
          type="card"
          activeKey={activeTab} // Dùng activeTab thay vì activeSubTab
          onChange={handleTabChange}
          items={subTabItems.map(item => ({
            ...item,
            label: <span>{item.label}</span>
          }))}
        />
        <div className={styles.buttonGroup}>
          <Button type="default" onClick={showHistoryModal}>
            Lịch sử sản phẩm
          </Button>
          <div className={styles.viewToggle}>
            <Button
              type={viewMode === 'table' ? 'primary' : 'default'}
              icon={viewMode === 'table' ? <TableOutlined /> : <AppstoreOutlined />}
              onClick={() => dispatch(setViewMode(viewMode === 'table' ? 'card' : 'table'))}
            />
          </div>
        </div>
      </div>

      <Spin spinning={isTabLoading || isLoading}>
        {viewMode === 'table' ? (
          <Table
            columns={columns}
            dataSource={activePosts}
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

        {activePosts.length === 0 && viewMode === 'card' && (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có dữ liệu" />
        )}
      </Spin>

      {/* Modal lịch sử bài đăng */}
      <Modal
        title="Lịch sử sản phẩm"
        open={isHistoryModalVisible}
        onCancel={handleHistoryModalClose}
        footer={null}
        width={1000}
        style={{ top: 20 }}
        bodyStyle={{ padding: '12px', maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}
      >
        <ExpiredListings
          refreshKey={historyTabRefreshKey}
          isActive={isHistoryModalVisible} // Only active when modal is visible
        />
      </Modal>

      <RegistrationDrawer
        visible={visibleDrawer}
        onClose={() => setVisibleDrawer(false)}
        listing={selectedListing}
        receiveRequests={receiveRequests}
        refetch={getRequests}
        onUpdateSuccess={() => {
          fetchData()
          fetchTabCounts() // Cập nhật lại số lượng khi có thay đổi
        }}
        pagination={requestPagination}
        onPaginationChange={handleRequestPaginationChange}
      />

      <ExchangeDrawer
        visible={visibleExchangeDrawer}
        onClose={() => setVisibleExchangeDrawer(false)}
        listing={selectedListing}
        exchangeRequests={exchangeRequests}
        refetch={getRequests}
        onUpdateSuccess={() => {
          fetchData()
          fetchTabCounts() // Cập nhật lại số lượng khi có thay đổi
        }}
        pagination={requestPagination}
        onPaginationChange={handleRequestPaginationChange}
      />

      <PostDetail isVisible={isModalDetail} onClose={handleClosePostDetail} post={selectedListing} />
    </>
  )
}
