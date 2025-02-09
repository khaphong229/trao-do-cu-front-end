import { useState, useMemo, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import {
  getExchangeRequest,
  getMyRequestedExchange
} from 'features/client/request/exchangeRequest/exchangeRequestThunks'
import { getMyRequestedGift, getReceiveRequestGift } from 'features/client/request/giftRequest/giftRequestThunks'

export const UseListNotification = () => {
  const dispatch = useDispatch()
  const [isLoaded, setIsLoaded] = useState(false)

  const giftRequests = useSelector(state => state.giftRequest.requests)
  const exchangeRequests = useSelector(state => state.exchangeRequest.requests)
  const listRequestGift = useSelector(state => state.giftRequest.posts)
  const listRequestExchange = useSelector(state => state.exchangeRequest.posts)
  const { isAuthenticated } = useSelector(state => state.auth)
  const params = {
    current: 1,
    pageSize: 10,
    status: 'pending',
    statusPotsId: 'active'
  }

  const loadNotifications = useCallback(async () => {
    if (isLoaded) return

    try {
      await dispatch(getMyRequestedGift('accepted'))
      await dispatch(getMyRequestedExchange('accepted'))
      await dispatch(getReceiveRequestGift(params))
      await dispatch(getExchangeRequest(params))
      setIsLoaded(true)
    } catch (error) {
      console.error('Failed to load notifications', error)
    }
  }, [dispatch, isLoaded, params])

  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications()
    }
  }, [loadNotifications, isAuthenticated])

  const formatTimeAgo = timestamp => {
    return moment(timestamp).fromNow()
  }

  const MAX_NOTIFICATIONS = 10

  const listNotification = useMemo(() => {
    const combinedNotifications = [
      ...giftRequests.map(item => ({
        id: item._id,
        title: `Trạng thái bài đăng ${item?.post_id?.title} thành công`,
        time: formatTimeAgo(item.updated_at)
      })),
      ...exchangeRequests.map(item => ({
        id: item._id,
        title: `Trạng thái bài đăng ${item?.post_id?.title} thành công`,
        time: formatTimeAgo(item.updated_at)
      })),
      ...listRequestGift.map(item => ({
        id: item._id,
        title: `${item?.user_req_id?.name} yêu cầu ${item?.post_id?.type === 'gift' ? 'nhận' : 'đổi'} bài đăng ${item?.post_id?.title}`,
        time: formatTimeAgo(item.updated_at)
      })),
      ...listRequestExchange.map(item => ({
        id: item._id,
        title: `${item?.user_req_id?.name} yêu cầu ${item?.post_id?.type === 'gift' ? 'nhận' : 'đổi'} bài đăng ${item?.post_id?.title}`,
        time: formatTimeAgo(item.updated_at)
      }))
    ]

    return combinedNotifications.sort((a, b) => moment(b.time) - moment(a.time)).slice(0, MAX_NOTIFICATIONS)
  }, [giftRequests, exchangeRequests, listRequestGift, listRequestExchange])

  return {
    listNotification,
    loadNotifications
  }
}
