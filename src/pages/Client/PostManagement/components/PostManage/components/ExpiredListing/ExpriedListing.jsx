import React, { useState } from 'react'
import { Empty, Tabs, Typography } from 'antd'
import { ListingCard } from '../Listing/ListingCard'
import { RegistrationDrawer } from '../RegistrationDrawer/RegistrationDrawer'
import { ExchangeDrawer } from '../ExchangeDrawer/ExchangeDrawer'
import { useDispatch } from 'react-redux'

import styles from './Scss/ExpriedListing.module.scss'
import { getReceiveRequestGift } from 'features/client/request/giftRequest/giftRequestThunks'
import { getExchangeRequest } from 'features/client/request/exchangeRequest/exchangeRequestThunks'
import notFoundPost from 'components/feature/post/notFoundPost'

const { TabPane } = Tabs

export const ExpiredListings = ({ listings = [], isLoading, isError, errorMessage }) => {
  const dispatch = useDispatch()
  const [selectedListing, setSelectedListing] = useState(null)
  const [visibleDrawer, setVisibleDrawer] = useState(false)
  const [visibleExchangeDrawer, setVisibleExchangeDrawer] = useState(false)
  const [receiveRequests, setReceiveRequests] = useState([])
  const [exchangeRequests, setExchangeRequests] = useState([])
  const [activeSubTab, setActiveSubTab] = useState('all')

  const subTabItems = [
    {
      key: 'all',
      label: 'Tất cả',
      count: Array.isArray(listings) ? listings.filter(l => l.status === 'inactive').length : 0
    },
    {
      key: 'gift',
      label: 'Trao tặng',
      count: Array.isArray(listings) ? listings.filter(l => l.status === 'inactive' && l.type === 'gift').length : 0
    },
    {
      key: 'exchange',
      label: 'Trao đổi',
      count: Array.isArray(listings) ? listings.filter(l => l.status === 'inactive' && l.type === 'exchange').length : 0
    }
  ]

  const filteredListings =
    activeSubTab === 'all'
      ? Array.isArray(listings)
        ? listings.filter(l => l.status === 'inactive')
        : []
      : Array.isArray(listings)
        ? listings.filter(l => l.status === 'inactive' && l.type === activeSubTab)
        : []

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

  const handleViewDetails = async listing => {
    setSelectedListing(listing)
    await getRequests(listing)
  }

  if (isLoading) {
    return <div className={styles.loadingContainer}>Loading...</div>
  }

  if (isError) {
    return <div className={styles.error}>{errorMessage || 'An error occurred while fetching listings.'}</div>
  }

  if (!listings || listings.length === 0) {
    notFoundPost()
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
            {filteredListings.length === 0
              ? notFoundPost()
              : filteredListings.map(listing => (
                  <ListingCard
                    key={listing._id}
                    listing={listing}
                    onViewRegistrations={() => handleViewDetails(listing)}
                  />
                ))}
          </TabPane>
        ))}
      </Tabs>

      <RegistrationDrawer
        visible={visibleDrawer}
        onClose={() => setVisibleDrawer(false)}
        listing={selectedListing}
        receiveRequests={receiveRequests}
        refetch={() => selectedListing && getRequests(selectedListing)}
      />
      <ExchangeDrawer
        visible={visibleExchangeDrawer}
        onClose={() => setVisibleExchangeDrawer(false)}
        listing={selectedListing}
        exchangeRequests={exchangeRequests}
        refetch={() => selectedListing && getRequests(selectedListing)}
      />
    </>
  )
}
