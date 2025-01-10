import React, { useState, useEffect, useCallback } from 'react'
import { Tabs, Empty, Typography, Badge, Button, Table, Image, Space } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { RegistrationDrawer } from '../../Drawer/RegistrationDrawer/RegistrationDrawer'
import { getPostGiftPagination } from 'features/client/post/postThunks'

import styles from './Scss/ActiveListing.module.scss'
import { ExchangeDrawer } from '../../Drawer/ExchangeDrawer/ExchangeDrawer'
import { getReceiveRequestGift } from 'features/client/request/giftRequest/giftRequestThunks'
import { getExchangeRequest } from 'features/client/request/exchangeRequest/exchangeRequestThunks'
import dayjs from 'dayjs'
import { URL_SERVER_IMAGE } from 'config/url_server'

const { TabPane } = Tabs

export const ActiveListings = ({ activeSubTab, setActiveSubTab, setCurrentPage, setPageSize }) => {
  const dispatch = useDispatch()
  const { posts = [], isLoading } = useSelector(state => state.post)
  const [selectedListing, setSelectedListing] = useState(null)
  const [visibleDrawer, setVisibleDrawer] = useState(false)
  const [receiveRequests, setReceiveRequests] = useState([])
  const [exchangeRequests, setExchangeRequests] = useState([])
  const [visibleExchangeDrawer, setVisibleExchangeDrawer] = useState(false)

  const fetchPosts = useCallback(() => {
    dispatch(getPostGiftPagination({ current: 1, pageSize: 1000, status: 'active' }))
  }, [dispatch])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const handleViewRegistrations = async listing => {
    setSelectedListing(listing)
    await getRequests(listing)
  }

  const getRequests = async listing => {
    try {
      if (listing.type === 'exchange') {
        const response = await dispatch(getExchangeRequest()).unwrap()

        const requestsData = response.data?.receiveRequests || []

        const filteredRequests = requestsData.filter(request => request.post_id?._id === listing._id)

        setExchangeRequests(filteredRequests)
        setVisibleExchangeDrawer(true)
        setVisibleDrawer(false)
      } else if (listing.type === 'gift') {
        const response = await dispatch(getReceiveRequestGift()).unwrap()

        const filteredRequests = response.data.filter(request => request.post_id._id === listing._id)
        setReceiveRequests(filteredRequests)
        setVisibleDrawer(true)
        setVisibleExchangeDrawer(false)
      }
    } catch (error) {
      setExchangeRequests([])
      setReceiveRequests([])
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
          <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
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
            {record.type === 'exchange' ? 'Xem người đổi' : 'Xem người nhận'}
          </Button>
        )
      }
    }
  ]

  const subTabItems = [
    { key: 'all', label: 'Tất cả', count: Array.isArray(posts) ? posts.filter(l => l.status === 'active').length : 0 },
    {
      key: 'gift',
      label: 'Trao tặng',
      count: Array.isArray(posts) ? posts.filter(l => l.status === 'active' && l.type === 'gift').length : 0
    },
    {
      key: 'exchange',
      label: 'Trao đổi',
      count: Array.isArray(posts) ? posts.filter(l => l.status === 'active' && l.type === 'exchange').length : 0
    }
  ]

  const filteredListings =
    activeSubTab === 'all'
      ? Array.isArray(posts)
        ? posts.filter(l => l.status === 'active')
        : []
      : Array.isArray(posts)
        ? posts.filter(l => l.status === 'active' && l.type === activeSubTab)
        : []

  return (
    <>
      <Tabs activeKey={activeSubTab} onChange={setActiveSubTab} className={styles.subTabs}>
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
            {isLoading ? (
              <Empty
                style={{ textAlign: 'center' }}
                imageStyle={{ height: 200 }}
                description={<Typography.Text>Đang tải...</Typography.Text>}
              />
            ) : (
              <Table
                columns={columns}
                dataSource={filteredListings}
                rowKey="_id"
                pagination={false}
                scroll={{ x: 800 }}
              />
            )}
          </TabPane>
        ))}
      </Tabs>

      <RegistrationDrawer
        visible={visibleDrawer}
        onClose={() => setVisibleDrawer(false)}
        listing={selectedListing}
        receiveRequests={receiveRequests}
        refetch={() => selectedListing && getRequests(selectedListing)}
        onUpdateSuccess={fetchPosts}
      />

      <ExchangeDrawer
        visible={visibleExchangeDrawer}
        onClose={() => setVisibleExchangeDrawer(false)}
        listing={selectedListing}
        exchangeRequests={exchangeRequests}
        refetch={() => selectedListing && getRequests(selectedListing)}
        onUpdateSuccess={fetchPosts}
      />
    </>
  )
}
