import React, { useEffect, useState } from 'react'
import { Table, Avatar, Tag, Image, Typography, Tabs, Card, Row, Col, Space, Empty } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import avt from 'assets/images/logo/avtDefault.webp'
import './styles.scss'
import { getMyRequestedGift } from 'features/client/request/giftRequest/giftRequestThunks'
import { getMyRequestedExchange } from 'features/client/request/exchangeRequest/exchangeRequestThunks'
import { URL_SERVER_IMAGE } from 'config/url_server'
import PostDetailModal from './components/PostDetailModal'
import imgNotFound from 'assets/images/others/imagenotfound.webp'
import ContactInfoDisplay from './components/ContactInfoDisplay'

const { Text } = Typography

const RequestedPosts = () => {
  const dispatch = useDispatch()
  const { isLoading } = useSelector(state => state.giftRequest)
  const [activeTab, setActiveTab] = useState('all')
  const [selectedPost, setSelectedPost] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const viewMode = useSelector(state => state.post.viewMode) // Get viewMode from Redux state

  const giftRequests = useSelector(state => state.giftRequest.requests)
  const exchangeRequests = useSelector(state => state.exchangeRequest.requests)

  useEffect(() => {
    dispatch(getMyRequestedGift(null))
    dispatch(getMyRequestedExchange(null))
  }, [dispatch])

  const allRequests = [...giftRequests, ...exchangeRequests].sort((a, b) =>
    a.status === 'accepted' ? -1 : b.status === 'accepted' ? 1 : 0
  )

  const handlePostClick = (post, e) => {
    if (e?.target?.closest('.ant-image') || e?.target?.closest('.ant-btn') || e?.target?.closest('a')) {
      return
    }
    setSelectedPost(post)
    setIsModalVisible(true)
  }

  const handleModalClose = () => {
    setIsModalVisible(false)
    setSelectedPost(null)
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
      title: 'Tiêu đề',
      dataIndex: ['post_id', 'title'],
      key: 'title',
      width: 200,
      render: text => <Text strong>{text}</Text>
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: 120,
      render: (_, record) => getStatusTag(record.post_id.status, record.status)
    },
    {
      title: 'Thông tin liên hệ',
      key: 'contact',
      width: 150,
      render: (_, record) => <ContactInfoDisplay post={record} showInTable={true} />
    },
    {
      title: 'Chủ bài đăng',
      key: 'owner',
      width: 300,
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
      title: 'Ảnh bài viết',
      key: 'postImage',
      width: 120,
      render: (_, record) => (
        <Image
          src={record?.post_id?.image_url[0] ? `${URL_SERVER_IMAGE}${record.post_id.image_url[0]}` : imgNotFound}
          alt="Post image"
          style={{ width: 100, height: 100, objectFit: 'cover' }}
          fallback={avt}
          preview={{
            mask: null
          }}
        />
      )
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
      title: 'Mô tả',
      dataIndex: ['post_id', 'description'],
      key: 'description',
      ellipsis: true,
      width: 200
    },
    {
      title: 'Địa chỉ',
      key: 'address',
      width: 200,
      render: (_, record) => <Text>{record?.post_id?.specificLocation || 'Không rõ địa chỉ'}</Text>
    }
  ]

  const renderCardView = requests => (
    <Row gutter={[16, 16]} className="card-grid">
      {requests.map(request => (
        <Col xs={24} sm={12} md={8} lg={6} key={request.id}>
          <Card
            hoverable
            className="item-card"
            onClick={e => handlePostClick(request, e)}
            cover={
              <div className="image-wrapper">
                <Image
                  src={
                    request?.post_id?.image_url[0] ? `${URL_SERVER_IMAGE}${request.post_id.image_url[0]}` : imgNotFound
                  }
                  alt={request.post_id.title}
                  style={{ height: 200, objectFit: 'cover' }}
                  fallback={avt}
                />
              </div>
            }
          >
            <Card.Meta
              title={request.post_id.title}
              description={
                <Space direction="vertical" size="small">
                  {getStatusTag(request.post_id.status, request.status)}
                  <Tag color={request.post_id.type === 'exchange' ? 'green' : 'blue'}>
                    {request.post_id.type === 'gift' ? 'Trao tặng' : 'Trao đổi'}
                  </Tag>
                  <Text className="desc-post" ellipsis={{ rows: 2 }}>
                    {request.post_id.description}
                  </Text>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Avatar
                      src={
                        request?.post_id?.user_id?.avatar ? `${URL_SERVER_IMAGE}${request.post_id.user_id.avatar}` : avt
                      }
                      size={24}
                    />
                    <Text strong>{request?.post_id?.user_id?.name || 'Không xác định'}</Text>
                  </div>
                  <ContactInfoDisplay post={request} showInTable={false} />
                </Space>
              }
            />
          </Card>
        </Col>
      ))}
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
    })
  }

  const tabItems = [
    {
      key: 'all',
      label: `Tất cả`,
      children:
        viewMode === 'table' ? (
          <Table loading={isLoading} {...tableProps} dataSource={allRequests} rowKey={record => record.id} />
        ) : (
          renderCardView(allRequests)
        )
    },
    {
      key: 'gifts',
      label: `Trao tặng`,
      children:
        viewMode === 'table' ? (
          <Table loading={isLoading} {...tableProps} dataSource={giftRequests} rowKey={record => record.id} />
        ) : (
          renderCardView(giftRequests)
        )
    },
    {
      key: 'exchanges',
      label: `Trao đổi`,
      children:
        viewMode === 'table' ? (
          <Table loading={isLoading} {...tableProps} dataSource={exchangeRequests} rowKey={record => record.id} />
        ) : (
          renderCardView(exchangeRequests)
        )
    }
  ]

  return (
    <>
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
      {allRequests.length === 0 &&
        giftRequests.length === 0 &&
        exchangeRequests.length === 0 &&
        viewMode === 'card' && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có dữ liệu" />}
      <PostDetailModal isVisible={isModalVisible} onClose={handleModalClose} post={selectedPost} />
    </>
  )
}

export default RequestedPosts
