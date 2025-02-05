import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Tabs, Typography, Badge, Button, Table, Image, Space } from 'antd'
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
import { UnorderedListOutlined } from '@ant-design/icons'

const { TabPane } = Tabs

export const ActiveListings = ({ activeSubTab, setActiveSubTab, refreshKey, isActive }) => {
  const dispatch = useDispatch()
  const { posts = [], total = 0, isLoading } = useSelector(state => state.post)
  const [selectedListing, setSelectedListing] = useState(null)
  const [visibleDrawer, setVisibleDrawer] = useState(false)
  const [receiveRequests, setReceiveRequests] = useState([])
  const [exchangeRequests, setExchangeRequests] = useState([])
  const [visibleExchangeDrawer, setVisibleExchangeDrawer] = useState(false)
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

  const fetchParams = useMemo(
    () => ({
      current: pagination.current,
      pageSize: pagination.pageSize,
      status: 'active',
      type: activeSubTab !== 'all' ? activeSubTab : undefined
    }),
    [activeSubTab, pagination]
  )

  const fetchPosts = useCallback(() => {
    dispatch(getPostGiftPagination(fetchParams)).then(response => {
      if (response?.payload?.data?.data) {
        const allPosts = response.payload.data.data
        setTabCounts({
          all: response.payload.data.total || 0,
          gift: allPosts.filter(post => post.type === 'gift').length,
          exchange: allPosts.filter(post => post.type === 'exchange').length
        })
      }
    })
  }, [dispatch, fetchParams])

  useEffect(() => {
    if (isActive) {
      fetchPosts()
    }
  }, [fetchPosts, isActive, refreshKey])

  useEffect(() => {
    setPagination(prev => ({
      ...prev,
      total: total
    }))
  }, [total])

  const handleTableChange = (pagination, filters, sorter) => {
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
    }
  ]

  const subTabItems = [
    { key: 'all', label: 'Tất cả', count: tabCounts.all },
    {
      key: 'gift',
      label: 'Trao tặng',
      count: tabCounts.gift
    },
    {
      key: 'exchange',
      label: 'Trao đổi',
      count: tabCounts.exchange
    }
  ]

  const handleTabChange = key => {
    setActiveSubTab(key)
    setPagination(prev => ({
      ...prev,
      current: 1
    }))
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
                <span className={styles.subTabCount}>({subTab.count})</span>
              </span>
            }
          >
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
          </TabPane>
        ))}
      </Tabs>

      <RegistrationDrawer
        visible={visibleDrawer}
        onClose={() => setVisibleDrawer(false)}
        listing={selectedListing}
        receiveRequests={receiveRequests}
        refetch={getRequests}
        onUpdateSuccess={fetchPosts}
        pagination={requestPagination}
        onPaginationChange={handleRequestPaginationChange}
      />

      <ExchangeDrawer
        visible={visibleExchangeDrawer}
        onClose={() => setVisibleExchangeDrawer(false)}
        listing={selectedListing}
        exchangeRequests={exchangeRequests}
        refetch={getRequests}
        onUpdateSuccess={fetchPosts}
        pagination={requestPagination}
        onPaginationChange={handleRequestPaginationChange}
      />

      <PostDetail isVisible={isModalDetail} onClose={handleClosePostDetail} post={selectedListing} />
    </>
  )
}
