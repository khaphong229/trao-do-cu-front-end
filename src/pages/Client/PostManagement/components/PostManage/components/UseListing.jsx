import { useState } from 'react'
import { message, Modal } from 'antd'
import { initialFakeListings } from './data.js'

export const useListings = () => {
  const [listings, setListings] = useState(initialFakeListings)

  const getFilteredListings = (type, status) => {
    let filteredListings = listings
    if (type !== 'all') filteredListings = filteredListings.filter(listing => listing.type === type)
    if (status !== 'all') filteredListings = filteredListings.filter(listing => listing.status === status)
    return filteredListings
  }

  const handleAccept = (listingId, registrationId) => {
    Modal.confirm({
      title: 'Xác nhận chấp nhận',
      content: 'Bạn có chắc chắn muốn chấp nhận đăng ký này?',
      onOk() {
        setListings(prevListings =>
          prevListings.map(listing => (listing.id === listingId ? { ...listing, status: 'inactive' } : listing))
        )
        message.success('Đã chấp nhận đăng ký thành công')
      }
    })
  }

  const handleReject = (listingId, registrationId) => {
    Modal.confirm({
      title: 'Xác nhận từ chối',
      content: 'Bạn có chắc chắn muốn từ chối đăng ký này?',
      onOk() {
        setListings(prevListings =>
          prevListings.map(listing => {
            if (listing.id === listingId) {
              return {
                ...listing,
                registrations: listing.registrations.filter(reg => reg.id !== registrationId)
              }
            }
            return listing
          })
        )
        message.success('Đã từ chối đăng ký thành công')
      }
    })
  }

  return { listings, getFilteredListings, handleAccept, handleReject }
}
