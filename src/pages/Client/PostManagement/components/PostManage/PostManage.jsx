import React, { useState, useEffect } from 'react'
import { Button, Tabs } from 'antd'
import { ArrowLeftOutlined, TableOutlined, AppstoreOutlined } from '@ant-design/icons'
import styles from './PostManage.module.scss'
import CreatePostModal from 'pages/Client/Post/CreatePost/CreatePost'
import { useDispatch, useSelector } from 'react-redux'
import { setCreateModalVisibility, setViewMode } from 'features/client/post/postSlice'
import { UserInfo } from './components/UserInfor/UserInfor'
import { ActiveListings } from './components/PostTabs/ActiveListing/ActiveListing'
import RequestedPosts from './components/PostTabs/RequestedPosts'
import { ExpiredListings } from './components/PostTabs/ExpiredListing/ExpriedListing'

const { TabPane } = Tabs

export const PostManage = ({ tabType }) => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { viewMode } = useSelector(state => state.post)

  const [activeTab, setActiveTab] = useState(tabType)
  const [activeSubTab, setActiveSubTab] = useState('all')
  const [tabRefreshKey, setTabRefreshKey] = useState(0)
  const [showingExpired, setShowingExpired] = useState(false)

  useEffect(() => {
    setActiveTab(tabType)
    setShowingExpired(false)
  }, [tabType])

  const handleTabChange = newTab => {
    if (newTab !== activeTab) {
      setActiveTab(newTab)
      setActiveSubTab('all')
      setTabRefreshKey(prev => prev + 1)
      setShowingExpired(false)
    }
  }

  const handleShowExpiredListings = () => {
    setShowingExpired(true)
    setActiveSubTab('all')
    setTabRefreshKey(prev => prev + 1)
  }

  const handleBackToActive = () => {
    setShowingExpired(false)
    setActiveSubTab('all')
    setTabRefreshKey(prev => prev + 1)
  }

  const tabItems = [
    { key: 'active', label: 'Sản phẩm trao đi' },
    { key: 'requested', label: 'Sản phẩm đang chờ duyệt' }
  ]

  const renderTabContent = () => {
    if (showingExpired && activeTab === 'active') {
      return (
        <div>
          <ExpiredListings
            activeSubTab={activeSubTab}
            setActiveSubTab={setActiveSubTab}
            refreshKey={tabRefreshKey}
            isActive={true}
          />
        </div>
      )
    }

    switch (activeTab) {
      case 'active':
        return (
          <ActiveListings
            activeSubTab={activeSubTab}
            setActiveSubTab={setActiveSubTab}
            refreshKey={tabRefreshKey}
            isActive={true}
            onShowExpired={handleShowExpiredListings}
          />
        )
      case 'requested':
        return <RequestedPosts />
      default:
        return null
    }
  }

  return (
    <div className={styles.listingManagement}>
      <UserInfo user={user} onCreatePost={() => dispatch(setCreateModalVisibility(true))} />

      <div className={styles.tabsContainer}>
        <div className={styles.tabsWrapper}>
          <div className={styles.tabHeader}>
            <Tabs activeKey={activeTab} onChange={handleTabChange} className={styles.listingTabs}>
              {tabItems.map(tab => (
                <TabPane key={tab.key} tab={<span className={styles.tabLabel}>{tab.label}</span>} />
              ))}
            </Tabs>

            <div className={styles.actions}>
              {showingExpired && (
                <Button
                  onClick={handleBackToActive}
                  type="primary"
                  icon={<ArrowLeftOutlined />}
                  size="large"
                  className={styles.backButton}
                />
              )}
              <Button
                type={viewMode === 'table' ? 'primary' : 'default'}
                icon={viewMode === 'table' ? <TableOutlined /> : <AppstoreOutlined />}
                onClick={() => dispatch(setViewMode(viewMode === 'table' ? 'card' : 'table'))}
              />
            </div>
          </div>

          <div className={styles.contentTabs}>{renderTabContent()}</div>
        </div>
      </div>

      <CreatePostModal />
    </div>
  )
}

export default PostManage
