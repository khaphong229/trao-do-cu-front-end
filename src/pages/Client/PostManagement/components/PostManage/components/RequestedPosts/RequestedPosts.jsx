import React, { useEffect, useState } from 'react'
import { Tabs, Avatar, Tag } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import avt from 'assets/images/logo/avtDefault.jpg'
import './styles.scss'
import { getMyRequestedGift } from 'features/client/request/giftRequest/giftRequestThunks'
import { getMyRequestedExchange } from 'features/client/request/exchangeRequest/exchangeRequestThunks'
import { URL_SERVER_IMAGE } from 'config/url_server'
import PostDetailModal from './components/PostDetailModal'

const { TabPane } = Tabs

const RequestedPosts = () => {
  const dispatch = useDispatch()
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

  const handlePostClick = post => {
    setSelectedPost(post)
    setIsModalVisible(true)
  }

  const handleModalClose = () => {
    setIsModalVisible(false)
    setSelectedPost(null)
  }

  const renderPostCard = item => (
    <div className="post-card" key={item._id} onClick={() => handlePostClick(item)}>
      <div className="post-image">
        <img src={item?.post_id?.image_url[0] ? `${URL_SERVER_IMAGE}${item.post_id.image_url[0]}` : avt} alt="Post" />
      </div>
      <div className="post-content">
        <div className="post-header">
          <Avatar src={item?.post_id?.user?.avatar || avt} />
          <div className="post-info">
            <h3>{item?.post_id?.title}</h3>
            <Tag color={item.status === 'accepted' ? 'green' : 'blue'}>
              {item.status === 'accepted' ? 'Đã nhận' : 'Chờ duyệt'}
            </Tag>
          </div>
        </div>
        <p className="post-description">{item?.post_id?.description}</p>
        <p className="post-location">Địa chỉ: {item?.post_id?.specificLocation || 'Không rõ địa chỉ'}</p>
      </div>
    </div>
  )

  return (
    <div className="request-list">
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Tất cả" key="all">
          <div className="posts-grid">{allRequests.map(renderPostCard)}</div>
        </TabPane>
        <TabPane tab="Trao tặng" key="gift">
          <div className="posts-grid">{giftRequests.map(renderPostCard)}</div>
        </TabPane>
        <TabPane tab="Trao đổi" key="exchange">
          <div className="posts-grid">{exchangeRequests.map(renderPostCard)}</div>
        </TabPane>
      </Tabs>

      <PostDetailModal isVisible={isModalVisible} onClose={handleModalClose} post={selectedPost} />
    </div>
  )
}

export default RequestedPosts
