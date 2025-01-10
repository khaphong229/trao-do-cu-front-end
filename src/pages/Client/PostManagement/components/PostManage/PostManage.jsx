import React, { useState, useEffect } from 'react'
import { Tabs } from 'antd'
import styles from './PostManage.module.scss'
import CreatePostModal from 'pages/Client/Post/CreatePost/CreatePost'
import { useDispatch, useSelector } from 'react-redux'
import { setCreateModalVisibility } from 'features/client/post/postSlice'
import { getPostGiftPagination } from 'features/client/post/postThunks'
import { UserInfo } from './components/UserInfor/UserInfor'
import { ActiveListings } from './components/PostTabs/ActiveListing/ActiveListing'
import { ExpiredListings } from './components/PostTabs/ExpiredListing/ExpriedListing'
import RequestedPosts from './components/PostTabs/RequestedPosts'

const { TabPane } = Tabs

export const PostManage = () => {
  const [activeTab, setActiveTab] = useState('active')
  const [activeSubTab, setActiveSubTab] = useState('all')
  const { user } = useSelector(state => state.auth)
  const { posts = [], isLoading, isError, errorMessage } = useSelector(state => state.post)
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
      label: 'Đang hiển thị'
    },
    {
      key: 'expired',
      label: 'Đã thành công'
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
          <TabPane key={tab.key} tab={<span className={styles.tabLabel}>{tab.label}</span>}>
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
