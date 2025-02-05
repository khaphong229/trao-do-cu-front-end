import React, { useState } from 'react'
import { Tabs } from 'antd'
import styles from './PostManage.module.scss'
import CreatePostModal from 'pages/Client/Post/CreatePost/CreatePost'
import { useDispatch, useSelector } from 'react-redux'
import { setCreateModalVisibility } from 'features/client/post/postSlice'
import { UserInfo } from './components/UserInfor/UserInfor'
import { ActiveListings } from './components/PostTabs/ActiveListing/ActiveListing'
import { ExpiredListings } from './components/PostTabs/ExpiredListing/ExpriedListing'
import RequestedPosts from './components/PostTabs/RequestedPosts'
import { UnorderedListOutlined } from '@ant-design/icons'

const { TabPane } = Tabs

export const PostManage = ({ tabType }) => {
  const dispatch = useDispatch()

  const { user } = useSelector(state => state.auth)
  const [activeTab, setActiveTab] = useState(tabType)
  const [activeSubTab, setActiveSubTab] = useState('all')
  const [tabRefreshKey, setTabRefreshKey] = useState(0)

  const handleTabChange = newTab => {
    if (newTab !== activeTab) {
      setActiveTab(newTab)
      setActiveSubTab('all')
      setTabRefreshKey(prev => prev + 1)
    }
  }

  const tabItems = [
    { key: 'active', label: 'Đang hiển thị' },
    { key: 'expired', label: 'Đã thành công' },
    { key: 'requested', label: 'Đã yêu cầu' }
  ]

  return (
    <div className={styles.listingManagement}>
      <UserInfo user={user} onCreatePost={() => dispatch(setCreateModalVisibility(true))} />
      <Tabs activeKey={activeTab} onChange={handleTabChange} className={styles.listingTabs}>
        {tabItems.map(tab => (
          <TabPane key={tab.key} tab={<span className={styles.tabLabel}>{tab.label}</span>}>
            {tab.key === 'active' && (
              <ActiveListings
                activeSubTab={activeSubTab}
                setActiveSubTab={setActiveSubTab}
                refreshKey={tabRefreshKey}
                isActive={activeTab === 'active'}
              />
            )}
            {tab.key === 'expired' && (
              <ExpiredListings
                activeSubTab={activeSubTab}
                setActiveSubTab={setActiveSubTab}
                refreshKey={tabRefreshKey}
                isActive={activeTab === 'expired'}
              />
            )}
            {tab.key === 'requested' && <RequestedPosts />}
          </TabPane>
        ))}
      </Tabs>
      <CreatePostModal />
    </div>
  )
}

export default PostManage
