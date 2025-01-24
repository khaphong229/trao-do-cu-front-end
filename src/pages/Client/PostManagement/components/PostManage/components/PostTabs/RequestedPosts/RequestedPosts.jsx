import React, { useEffect, useState } from 'react'
import { Table, Avatar, Tag, Image, Typography, Tabs } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import avt from 'assets/images/logo/avtDefault.jpg'
import './styles.scss'
import { getMyRequestedGift } from 'features/client/request/giftRequest/giftRequestThunks'
import { getMyRequestedExchange } from 'features/client/request/exchangeRequest/exchangeRequestThunks'
import { URL_SERVER_IMAGE } from 'config/url_server'
import PostDetailModal from './components/PostDetailModal'
import imgNotFound from 'assets/images/others/imagenotfound.jpg'
import ContactInfoDisplay from './components/ContactInfoDisplay'
const { Text } = Typography

const RequestedPosts = () => {
  const dispatch = useDispatch()
  const { isLoading } = useSelector(state => state.giftRequest)
  const [activeTab, setActiveTab] = useState('all')
  const [selectedPost, setSelectedPost] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)

  const giftRequests = useSelector(state => state.giftRequest.requests)
  const exchangeRequests = useSelector(state => state.exchangeRequest.requests)

  useEffect(() => {
    dispatch(getMyRequestedGift())
    dispatch(getMyRequestedExchange())
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
      render: (_, record) => {
        let typeCheck
        if (record.post_id.status === 'inactive' && record.status === 'accepted') {
          typeCheck = 'acp'
        } else if (record.post_id.status === 'inactive' && record.status !== 'accepted') {
          typeCheck = 'end'
        } else {
          typeCheck = 'pend'
        }
        return (
          <Tag color={typeCheck === 'acp' ? 'success' : typeCheck === 'end' ? 'error' : 'warning'}>
            {typeCheck === 'acp' ? 'Đã nhận' : typeCheck === 'end' ? 'Kết thúc' : 'Chờ duyệt'}
          </Tag>
        )
      }
    },
    {
      title: 'Thông tin liên hệ',
      key: 'contact',
      width: 150,
      render: (_, record) => {
        return <ContactInfoDisplay post={record} showInTable={true} />
      }
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
            <Text type="secondary">{record?.post_id?.user_id?.email || ''}</Text>
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
      label: `Tất cả (${allRequests.length})`,
      children: <Table isLoading={isLoading} {...tableProps} dataSource={allRequests} rowKey={record => record.id} />
    },
    {
      key: 'gifts',
      label: `Quà tặng (${giftRequests.length})`,
      children: <Table isLoading={isLoading} {...tableProps} dataSource={giftRequests} rowKey={record => record.id} />
    },
    {
      key: 'exchanges',
      label: `Trao đổi (${exchangeRequests.length})`,
      children: (
        <Table isLoading={isLoading} {...tableProps} dataSource={exchangeRequests} rowKey={record => record.id} />
      )
    }
  ]

  return (
    <>
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />

      <PostDetailModal isVisible={isModalVisible} onClose={handleModalClose} post={selectedPost} />
    </>
  )
}

export default RequestedPosts
