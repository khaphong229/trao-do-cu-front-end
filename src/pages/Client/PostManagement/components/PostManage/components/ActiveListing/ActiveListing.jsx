import React, { useState, useEffect, useCallback } from 'react'
import { Tabs, Empty, Typography } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { ListingCard } from '../Listing/ListingCard'
import { RegistrationDrawer } from '../RegistrationDrawer/RegistrationDrawer'
import { getPostGiftPagination } from 'features/client/post/postThunks'

import styles from './Scss/ActiveListing.module.scss'
import { ExchangeDrawer } from '../ExchangeDrawer/ExchangeDrawer'
import { getReceiveRequestGift } from 'features/client/request/giftRequest/giftRequestThunks'
import { getExchangeRequest } from 'features/client/request/exchangeRequest/exchangeRequestThunks'
import notFoundPost from 'components/feature/post/notFoundPost'

const { TabPane } = Tabs

export const ActiveListings = ({ activeSubTab, setActiveSubTab, setCurrentPage, setPageSize }) => {
  const dispatch = useDispatch()
  const { posts = [], isLoading } = useSelector(state => state.post)
  const [selectedListing, setSelectedListing] = useState(null)
  const [visibleDrawer, setVisibleDrawer] = useState(false)
  const [receiveRequests, setReceiveRequests] = useState([])
  const [exchangeRequests, setExchangeRequests] = useState([])
  const [visibleExchangeDrawer, setVisibleExchangeDrawer] = useState(false)

  const fetchPosts = useCallback(() => {
    dispatch(getPostGiftPagination({ current: 1, pageSize: 1000, status: 'active' }))
  }, [dispatch])

  useEffect(() => {
    fetchPosts()
  }, [dispatch, fetchPosts])

  const subTabItems = [
    { key: 'all', label: 'Tất cả', count: Array.isArray(posts) ? posts.filter(l => l.status === 'active').length : 0 },
    {
      key: 'gift',
      label: 'Trao tặng',
      count: Array.isArray(posts) ? posts.filter(l => l.status === 'active' && l.type === 'gift').length : 0
    },
    {
      key: 'exchange',
      label: 'Trao đổi',
      count: Array.isArray(posts) ? posts.filter(l => l.status === 'active' && l.type === 'exchange').length : 0
    }
  ]

  const filteredListings =
    activeSubTab === 'all'
      ? Array.isArray(posts)
        ? posts.filter(l => l.status === 'active')
        : []
      : Array.isArray(posts)
        ? posts.filter(l => l.status === 'active' && l.type === activeSubTab)
        : []

  const handleViewRegistrations = async listing => {
    setSelectedListing(listing)
    await getRequests(listing)
  }

  const getRequests = async listing => {
    try {
      if (listing.type === 'exchange') {
        const response = await dispatch(getExchangeRequest()).unwrap()

        const requestsData = response.data?.receiveRequests || []

        const filteredRequests = requestsData.filter(request => request.post_id?._id === listing._id)

        setExchangeRequests(filteredRequests)
        setVisibleExchangeDrawer(true)
        setVisibleDrawer(false)
      } else if (listing.type === 'gift') {
        const response = await dispatch(getReceiveRequestGift()).unwrap()

        const filteredRequests = response.data.filter(request => request.post_id._id === listing._id)
        setReceiveRequests(filteredRequests)
        setVisibleDrawer(true)
        setVisibleExchangeDrawer(false)
      }
    } catch (error) {
      setExchangeRequests([])
      setReceiveRequests([])
    }
  }

  return (
    <>
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
            {isLoading ? (
              <Empty
                style={{ textAlign: 'center' }}
                imageStyle={{ height: 200 }}
                description={<Typography.Text>Đang tải...</Typography.Text>}
              />
            ) : filteredListings.length === 0 ? (
              notFoundPost()
            ) : (
              <div className={styles.listingCardsContainer}>
                {filteredListings.map(listing => (
                  <ListingCard
                    key={listing._id}
                    listing={listing}
                    onViewRegistrations={() => handleViewRegistrations(listing)}
                  />
                ))}
              </div>
            )}
          </TabPane>
        ))}
      </Tabs>
      <RegistrationDrawer
        visible={visibleDrawer}
        onClose={() => setVisibleDrawer(false)}
        listing={selectedListing}
        receiveRequests={receiveRequests}
        refetch={() => selectedListing && getRequests(selectedListing)}
        onUpdateSuccess={fetchPosts}
      />
      <ExchangeDrawer
        visible={visibleExchangeDrawer}
        onClose={() => setVisibleExchangeDrawer(false)}
        listing={selectedListing}
        exchangeRequests={exchangeRequests}
        refetch={() => selectedListing && getRequests(selectedListing)}
        onUpdateSuccess={fetchPosts}
      />
    </>
  )
}
