import React, { useState, useEffect } from 'react'
import { Tabs } from 'antd'
import styles from './PostManage.module.scss'
import CreatePostModal from 'pages/Client/Post/CreatePost/CreatePost'
import { useDispatch, useSelector } from 'react-redux'
import { setCreateModalVisibility } from 'features/client/post/postSlice'
import { getPostGiftPagination } from 'features/client/postManage/postManageThunks'
import { UserInfo } from './components/UserInfor/UserInfor'
import { ActiveListings } from './components/ActiveListing/ActiveListing'
import { ExpiredListings } from './components/ExpiredListing/ExpriedListing'
import RequestedPosts from './components/RequestedPosts'

const { TabPane } = Tabs

export const PostManage = () => {
  const [activeTab, setActiveTab] = useState('active')
  const [activeSubTab, setActiveSubTab] = useState('all')
  const { user } = useSelector(state => state.auth)
  const { posts = [], total, isLoading, isError, errorMessage } = useSelector(state => state.postManage)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(
      getPostGiftPagination({
        current: 1,
        pageSize: 20,
        status: activeTab === 'active' ? 'active' : 'inactive'
      })
    )
  }, [dispatch, activeTab])

  const filteredPosts = React.useMemo(() => {
    if (!Array.isArray(posts)) return []
    return posts.filter(post => {
      if (activeTab === 'active') return post.status === 'active'
      return post.status === 'inactive'
    })
  }, [posts, activeTab])

  const tabItems = [
    {
      key: 'active',
      label: 'Đang hiển thị',
      count: filteredPosts.filter(post => post.status === 'active').length
    },
    {
      key: 'expired',
      label: 'Đã thành công',
      count: filteredPosts.filter(post => post.status === 'inactive').length
    },
    {
      key: 'requested',
      label: 'Đã yêu cầu'
    }
  ]

  return (
    <div className={styles.listingManagement}>
      <UserInfo user={user} onCreatePost={() => dispatch(setCreateModalVisibility(true))} />
      <Tabs activeKey={activeTab} onChange={setActiveTab} className={styles.listingTabs}>
        {tabItems.map(tab => (
          <TabPane
            key={tab.key}
            tab={
              <span className={styles.tabLabel}>
                {tab.label}
                <span className={styles.tabCount}>({tab.count || 0})</span>
              </span>
            }
          >
            {tab.key === 'active' ? (
              <ActiveListings
                posts={filteredPosts}
                activeSubTab={activeSubTab}
                setActiveSubTab={setActiveSubTab}
                isLoading={isLoading}
                isError={isError}
                errorMessage={errorMessage}
              />
            ) : tab.key === 'expired' ? (
              <ExpiredListings
                listings={filteredPosts}
                isLoading={isLoading}
                isError={isError}
                errorMessage={errorMessage}
              />
            ) : (
              <RequestedPosts />
            )}
          </TabPane>
        ))}
      </Tabs>
      <CreatePostModal />
    </div>
  )
}

export default PostManage
