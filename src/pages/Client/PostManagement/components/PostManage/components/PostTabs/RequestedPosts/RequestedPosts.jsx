import React, { useEffect, useState } from 'react'
import { Table, Avatar, Tag, Image, Typography, Tabs, Card, Row, Col, Empty, Badge, Button, Spin } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { TableOutlined, AppstoreOutlined, QrcodeOutlined } from '@ant-design/icons'
import avt from 'assets/images/logo/avtDefault.webp'
import './styles.scss'
import { getMyRequestedGift } from 'features/client/request/giftRequest/giftRequestThunks'
import { getMyRequestedExchange } from 'features/client/request/exchangeRequest/exchangeRequestThunks'
import { URL_SERVER_IMAGE } from 'config/url_server'
import PostDetailModal from './components/PostDetailModal'
import imgNotFound from 'assets/images/others/imagenotfound.webp'
import ContactInfoDisplay from './components/ContactInfoDisplay'
import { getAvatarPost } from 'hooks/useAvatar'
import QRImageModal from 'components/QrModal'
import { setViewMode } from 'features/client/post/postSlice'

const { Text } = Typography

const RequestedPosts = () => {
  const dispatch = useDispatch()
  const { isLoading } = useSelector(state => state.giftRequest)
  const [activeTab, setActiveTab] = useState('all')
  const [selectedPost, setSelectedPost] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isOpenQrModal, setOpenQrModal] = useState(false)
  const [qrCode, setQrCode] = useState('')
  const viewMode = useSelector(state => state.post.viewMode)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10
  })
  const [isTabLoading, setIsTabLoading] = useState(false)

  const giftRequests = useSelector(state => state.giftRequest.requests)
  const exchangeRequests = useSelector(state => state.exchangeRequest.requests)

  useEffect(() => {
    dispatch(getMyRequestedGift(null))
    dispatch(getMyRequestedExchange(null))
  }, [dispatch])

  const handleOpenQr = post => {
    setQrCode(post.qrCode)
    setOpenQrModal(true)
  }
  const handleCancelQR = () => {
    setOpenQrModal(false)
  }

  const allRequests = [...giftRequests, ...exchangeRequests].sort((a, b) =>
    a.status === 'accepted' ? -1 : b.status === 'accepted' ? 1 : 0
  )

  const getActivePosts = () => {
    switch (activeTab) {
      case 'gifts':
        return giftRequests
      case 'exchanges':
        return exchangeRequests
      default:
        return allRequests
    }
  }

  const activePosts = getActivePosts()

  const handlePostClick = (post, e) => {
    if (e?.target?.closest('.ant-btn') || e?.target?.closest('a')) {
      return
    }
    setSelectedPost(post)
    setIsModalVisible(true)
  }

  const handleModalClose = () => {
    setIsModalVisible(false)
    setSelectedPost(null)
  }

  const handleTableChange = (pagination, filters, sorter) => {
    setPagination(pagination)
  }

  const handlePostDetail = (e, record) => {
    handlePostClick(record, e)
  }

  const getStatusTag = (postStatus, requestStatus) => {
    let typeCheck
    if (postStatus === 'inactive' && requestStatus === 'accepted') {
      typeCheck = 'acp'
    } else if (postStatus === 'inactive' && requestStatus !== 'accepted') {
      typeCheck = 'end'
    } else {
      typeCheck = 'pend'
    }
    return (
      <Tag color={typeCheck === 'acp' ? 'success' : typeCheck === 'end' ? 'error' : 'warning'}>
        {typeCheck === 'acp' ? 'Đã nhận' : typeCheck === 'end' ? 'Kết thúc' : 'Chờ đồng ý'}
      </Tag>
    )
  }

  const columns = [
    {
      title: 'Ảnh bài viết',
      key: 'postImage',
      width: 120,
      render: (_, record) => (
        <Image
          src={record?.post_id?.image_url[0] ? `${URL_SERVER_IMAGE}${record.post_id.image_url[0]}` : imgNotFound}
          alt="Post image"
          style={{ width: 100, height: 100, objectFit: 'cover' }}
          fallback={avt}
          preview={false}
          onClick={e => handlePostClick(record, e)}
        />
      )
    },
    {
      title: 'Sản phẩm',
      dataIndex: ['post_id', 'title'],
      key: 'title',
      width: 150,
      fixed: 'left',
      render: text => <Text strong>{text}</Text>
    },
    {
      title: 'Người trao đồ',
      key: 'owner',
      width: 200,
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Avatar
            src={record?.post_id?.user_id?.avatar ? `${URL_SERVER_IMAGE}${record.post_id.user_id.avatar}` : avt}
            size={40}
          />
          <div>
            <Text strong>{record?.post_id?.user_id?.name || 'Không xác định'}</Text>
            <br />
            <Text type="secondary">
              {record?.post_id?.user_id?.email ? `xxxx${record?.post_id?.user_id?.email.slice(-12)}` : ''}
            </Text>
          </div>
        </div>
      )
    },
    {
      title: 'Thông tin liên hệ',
      key: 'contact',
      width: 150,
      render: (_, record) => <ContactInfoDisplay post={record} showInTable={true} />
    },

    {
      title: 'Địa chỉ',
      key: 'address',
      width: 200,
      render: (_, record) => <Text>{record?.post_id?.city || 'Không rõ địa chỉ'}</Text>
    },
    {
      title: 'Loại',
      key: 'type',
      width: 100,
      render: (_, record) => (
        <Tag color={record?.post_id?.type === 'exchange' ? 'green' : 'blue'}>
          {record?.post_id?.type === 'gift' ? 'Trao tặng' : 'Trao đổi'}
        </Tag>
      )
    },

    {
      title: 'Trạng thái',
      key: 'status',
      width: 120,
      render: (_, record) => getStatusTag(record.post_id.status, record.status)
    }
  ]

  const renderCardView = (requests = activePosts) => (
    <Row gutter={[16, 16]} className="card-grid">
      {requests.length > 0 ? (
        requests.map(request => (
          <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={30} key={request.id}>
            <Card
              hoverable
              className="item-card"
              onClick={e => handlePostClick(request, e)}
              cover={
                <div className="image-wrapper">
                  <Image
                    src={
                      request?.post_id?.image_url[0]
                        ? `${URL_SERVER_IMAGE}${request.post_id.image_url[0]}`
                        : imgNotFound
                    }
                    alt={request.post_id?.title}
                    fallback={avt}
                    preview={false}
                  />
                  <Badge.Ribbon
                    text={request.post_id.type === 'exchange' ? 'Trao đổi' : 'Trao tặng'}
                    color={request.post_id.type === 'exchange' ? 'green' : 'blue'}
                    className="post-type-ribbon"
                  />
                </div>
              }
              bodyStyle={{ padding: '12px', height: 'auto' }}
            >
              <div className="card-content">
                <Typography.Title level={5} ellipsis className="card-title">
                  {request.post_id.title}
                </Typography.Title>

                <div className="group-button-ok">
                  <div className="status-tags">{getStatusTag(request.post_id.status, request.status)}</div>
                  {request.post_id.status === 'inactive' && request.status === 'accepted' && (
                    <Button className="button-qr" icon={<QrcodeOutlined />} onClick={() => handleOpenQr(request)} />
                  )}
                </div>

                <div className="card-footer">
                  <div className="user-info">
                    <Avatar src={getAvatarPost(request?.post_id?.user_id)} size={20} />
                    <Typography.Text className="user-name" ellipsis>
                      {request?.post_id?.user_id?.name || 'Không xác định'}
                    </Typography.Text>
                  </div>
                </div>

                <ContactInfoDisplay post={request} showInTable={false} />
              </div>
            </Card>
          </Col>
        ))
      ) : (
        <Col span={24}>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có dữ liệu" />
        </Col>
      )}
    </Row>
  )

  const tableProps = {
    columns,
    scroll: { x: 1200 },
    pagination: {
      pageSize: 10,
      showSizeChanger: true,
      showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} bài đăng`
    },
    onRow: record => ({
      onClick: e => handlePostClick(record, e),
      style: { cursor: 'pointer' }
    }),
    rowKey: record => record.id
  }

  const tabItems = [
    {
      key: 'all',
      label: `Tất cả`,
      children: null // Trống để điều khiển nội dung từ component chính
    },
    {
      key: 'gifts',
      label: `Trao tặng`,
      children: null // Trống để điều khiển nội dung từ component chính
    },
    {
      key: 'exchanges',
      label: `Trao đổi`,
      children: null // Trống để điều khiển nội dung từ component chính
    }
  ]

  const handleTabChange = key => {
    setIsTabLoading(true)
    setActiveTab(key)

    setTimeout(() => {
      setIsTabLoading(false)
    }, 500)
  }

  return (
    <div className="requested-posts-container">
      <QRImageModal
        isOpen={isOpenQrModal}
        handleOpenQr={handleOpenQr}
        handleCancelQR={handleCancelQR}
        qrImageUrl={qrCode}
      />
      <div className="view-toggle-wrapper">
        <Tabs
          type="card"
          activeKey={activeTab}
          onChange={handleTabChange}
          items={tabItems.map(item => ({
            ...item,
            label: (
              <Spin spinning={isTabLoading && activeTab === item.key}>
                {item.icon} {item.label}
              </Spin>
            )
          }))}
        />
        <div className="view-toggle">
          <Button
            type={viewMode === 'table' ? 'primary' : 'default'}
            icon={viewMode === 'table' ? <TableOutlined /> : <AppstoreOutlined />}
            onClick={() => dispatch(setViewMode(viewMode === 'table' ? 'card' : 'table'))}
          />
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
      </Spin>

      <PostDetailModal isVisible={isModalVisible} onClose={handleModalClose} post={selectedPost} />
    </div>
  )
}

export default RequestedPosts
