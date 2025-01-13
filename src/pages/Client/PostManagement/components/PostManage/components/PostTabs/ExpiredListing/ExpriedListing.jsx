import React, { useState, useEffect } from 'react'
import { Table, Tabs, Empty, Typography, Button, Badge, Image, Space } from 'antd'
import { useDispatch } from 'react-redux'
import { getReceiveRequestGift } from 'features/client/request/giftRequest/giftRequestThunks'
import { getExchangeRequest } from 'features/client/request/exchangeRequest/exchangeRequestThunks'
import { URL_SERVER_IMAGE } from 'config/url_server'
import { RegistrationDrawer } from '../../Drawer/RegistrationDrawer/RegistrationDrawer'
import { ExchangeDrawer } from '../../Drawer/ExchangeDrawer/ExchangeDrawer'
import dayjs from 'dayjs'
import styles from './Scss/ExpriedListing.module.scss'
import notFoundPost from 'components/feature/post/notFoundPost'
import getPostError from 'components/feature/post/getPostError'

const { TabPane } = Tabs

export const ExpiredListings = ({ listings = [], isLoading, isError, errorMessage }) => {
  const dispatch = useDispatch()
  const [selectedListing, setSelectedListing] = useState(null)
  const [visibleDrawer, setVisibleDrawer] = useState(false)
  const [visibleExchangeDrawer, setVisibleExchangeDrawer] = useState(false)
  const [receiveRequests, setReceiveRequests] = useState([])
  const [exchangeRequests, setExchangeRequests] = useState([])
  const [activeSubTab, setActiveSubTab] = useState('all')
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  })
  const [requestsPagination, setRequestsPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  })

  useEffect(() => {
    if (Array.isArray(listings)) {
      setPagination(prev => ({
        ...prev,
        total: listings.filter(l =>
          activeSubTab === 'all' ? l.status === 'inactive' : l.status === 'inactive' && l.type === activeSubTab
        ).length
      }))
    }
  }, [listings, activeSubTab])

  const getRequests = async (listing, page = 1, pageSize = 10) => {
    try {
      if (listing.type === 'exchange') {
        const response = await dispatch(
          getExchangeRequest({
            current: page,
            pageSize: pageSize
          })
        ).unwrap()

        const requestsData = response.data?.receiveRequests || []
        const filteredRequests = requestsData.filter(request => request.post_id?._id === listing._id)

        setExchangeRequests(filteredRequests)
        setRequestsPagination(prev => ({
          ...prev,
          total: filteredRequests.length,
          current: page,
          pageSize: pageSize
        }))
        setVisibleExchangeDrawer(true)
        setVisibleDrawer(false)
      } else if (listing.type === 'gift') {
        const response = await dispatch(
          getReceiveRequestGift({
            current: page,
            pageSize: pageSize
          })
        ).unwrap()

        const filteredRequests = response.data.filter(request => request.post_id._id === listing._id)
        setReceiveRequests(filteredRequests)
        setRequestsPagination(prev => ({
          ...prev,
          total: filteredRequests.length,
          current: page,
          pageSize: pageSize
        }))
        setVisibleDrawer(true)
        setVisibleExchangeDrawer(false)
      }
    } catch (error) {
      setExchangeRequests([])
      setReceiveRequests([])
    }
  }

  const handleViewDetails = async listing => {
    setSelectedListing(listing)
    await getRequests(listing, 1, requestsPagination.pageSize)
  }

  const handleTableChange = (newPagination, filters, sorter) => {
    setPagination(prev => ({
      ...prev,
      current: newPagination.current,
      pageSize: newPagination.pageSize
    }))
  }

  const handleRequestsTableChange = newPagination => {
    if (selectedListing) {
      getRequests(selectedListing, newPagination.current, newPagination.pageSize)
    }
  }

  const handleTabChange = key => {
    setActiveSubTab(key)
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
        const variantBtn = record.type === 'exchange' ? 'dashed' : 'primary'
        return (
          <Button type={variantBtn} onClick={() => handleViewDetails(record)}>
            {record.type === 'exchange' ? 'Xem người đổi' : 'Xem người nhận'}
          </Button>
        )
      }
    }
  ]

  const subTabItems = [
    {
      key: 'all',
      label: 'Tất cả',
      count: Array.isArray(listings) ? listings.filter(l => l.status === 'inactive').length : 0
    },
    {
      key: 'gift',
      label: 'Trao tặng',
      count: Array.isArray(listings) ? listings.filter(l => l.status === 'inactive' && l.type === 'gift').length : 0
    },
    {
      key: 'exchange',
      label: 'Trao đổi',
      count: Array.isArray(listings) ? listings.filter(l => l.status === 'inactive' && l.type === 'exchange').length : 0
    }
  ]

  const filteredListings =
    activeSubTab === 'all'
      ? Array.isArray(listings)
        ? listings.filter(l => l.status === 'inactive')
        : []
      : Array.isArray(listings)
        ? listings.filter(l => l.status === 'inactive' && l.type === activeSubTab)
        : []

  const paginatedListings = filteredListings.slice(
    (pagination.current - 1) * pagination.pageSize,
    pagination.current * pagination.pageSize
  )

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
                <span className={styles.subTabCount}>({subTab.count})</span>
              </span>
            }
          >
            <Table
              columns={columns}
              dataSource={paginatedListings}
              rowKey="_id"
              pagination={{
                ...pagination,
                showSizeChanger: true,
                showTotal: (total, range) => `${range[0]} - ${range[1]} của ${total} bài đăng`
              }}
              onChange={handleTableChange}
              loading={isLoading}
              scroll={{ x: 800 }}
            />
          </TabPane>
        ))}
      </Tabs>

      <RegistrationDrawer
        visible={visibleDrawer}
        onClose={() => setVisibleDrawer(false)}
        listing={selectedListing}
        receiveRequests={receiveRequests}
        refetch={() =>
          selectedListing && getRequests(selectedListing, requestsPagination.current, requestsPagination.pageSize)
        }
        pagination={requestsPagination}
        onPaginationChange={handleRequestsTableChange}
      />

      <ExchangeDrawer
        visible={visibleExchangeDrawer}
        onClose={() => setVisibleExchangeDrawer(false)}
        listing={selectedListing}
        exchangeRequests={exchangeRequests}
        refetch={() =>
          selectedListing && getRequests(selectedListing, requestsPagination.current, requestsPagination.pageSize)
        }
        pagination={requestsPagination}
        onPaginationChange={handleRequestsTableChange}
      />
    </>
  )
}
