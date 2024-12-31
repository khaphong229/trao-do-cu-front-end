import React, { useEffect, useState } from 'react'
import { Tabs, Empty, Spin, message } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { ActiveListings } from '../ActiveListing/ActiveListing'
import { ExpiredListings } from '../ExpiredListing/ExpriedListing'
import { getPostGiftPagination } from 'redux/slices/postManageThunks'
import styles from './Scss/ListingTabs.module.scss'

const { TabPane } = Tabs

const ListingTabs = ({
  activeTab,
  setActiveTab,
  activeSubTab,
  setActiveSubTab,
  setSelectedListing,
  setVisibleDrawer
}) => {
  const dispatch = useDispatch()
  const { posts, loading, error } = useSelector(state => state.postManage)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        await dispatch(
          getPostGiftPagination({
            current: currentPage,
            pageSize: pageSize,
            status: activeTab === 'active' ? 'ACTIVE' : 'INACTIVE',
            type: activeSubTab !== 'all' ? activeSubTab.toUpperCase() : undefined
          })
        ).unwrap()
      } catch (err) {
        message.error('Failed to fetch posts')
      }
    }
    fetchPosts()
  }, [dispatch, activeTab, activeSubTab, currentPage, pageSize])

  const getFilteredListings = (type, status) => {
    if (!posts) return []
    return posts.filter(post => {
      const statusMatch = status === 'active' ? post.status === 'ACTIVE' : post.status === 'INACTIVE'
      const typeMatch = type === 'all' ? true : post.type?.toLowerCase() === type
      return statusMatch && typeMatch
    })
  }

  const tabItems = [
    { key: 'active', label: 'TIN ĐÃ ĐĂNG', count: getFilteredListings('all', 'active').length },
    { key: 'expired', label: 'NHỮNG TIN ĐÃ HẾT HẠN', count: getFilteredListings('all', 'inactive').length }
  ]

  const subTabItems = [
    { key: 'all', label: 'TẤT CẢ', count: getFilteredListings('all', 'active').length },
    { key: 'gift', label: 'TẶNG', count: getFilteredListings('gift', 'active').length },
    { key: 'exchange', label: 'TRAO ĐỔI', count: getFilteredListings('exchange', 'active').length }
  ]

  if (error) {
    return <Empty description="Error loading posts" />
  }

  return (
    <Spin spinning={loading}>
      <Tabs activeKey={activeTab} onChange={setActiveTab} className={styles.listingTabs}>
        {tabItems.map(tab => (
          <TabPane
            key={tab.key}
            tab={
              <span className={styles.tabLabel}>
                {tab.label}
                <span className={styles.tabCount}>({tab.count})</span>
              </span>
            }
          >
            {tab.key === 'active' ? (
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
                    <ActiveListings
                      listings={getFilteredListings(subTab.key, 'active')}
                      setSelectedListing={setSelectedListing}
                      setVisibleDrawer={setVisibleDrawer}
                      onPageChange={setCurrentPage}
                      onPageSizeChange={setPageSize}
                      currentPage={currentPage}
                      pageSize={pageSize}
                    />
                  </TabPane>
                ))}
              </Tabs>
            ) : (
              <ExpiredListings
                listings={getFilteredListings('all', 'inactive')}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
                currentPage={currentPage}
                pageSize={pageSize}
              />
            )}
          </TabPane>
        ))}
      </Tabs>
    </Spin>
  )
}

export { ListingTabs }
