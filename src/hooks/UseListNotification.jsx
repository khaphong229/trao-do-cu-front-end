import { useState, useMemo, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import vi from 'moment/locale/vi'
import {
  getNotificationPagination,
  markAllNotificationsAsRead,
  markNotificationAsRead
} from 'features/client/notification/notificationThunks'

export const UseListNotification = () => {
  const dispatch = useDispatch()
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [allNotifications, setAllNotifications] = useState([])
  const [lastPolledCount, setLastPolledCount] = useState(0)
  const {
    data: notifications,
    total,
    isLoading,
    selectedNotification,
    isVisibleNotificationDetail
  } = useSelector(state => state.notification.notifications)
  const { isAuthenticated } = useSelector(state => state.auth)

  const loadNotifications = useCallback(
    async (page = 1, isPolling = false) => {
      if (!isAuthenticated) return

      try {
        const response = await dispatch(getNotificationPagination({ current: page, pageSize: 10 }))

        if (!response.payload || !response.payload.data) {
          return
        }

        if (isPolling) {
          const currentUnreadCount = response.payload.data.data.filter(n => !n.isRead).length
          if (currentUnreadCount !== lastPolledCount) {
            setLastPolledCount(currentUnreadCount)
            setAllNotifications(response.payload.data.data)
          }
          return
        }

        setIsLoaded(true)

        const totalItems = response.payload.data.total
        const loadedItems = page * 10
        setHasMore(loadedItems < totalItems)

        if (page === 1) {
          setAllNotifications(response.payload.data.data)
        } else {
          setAllNotifications(prev => [...prev, ...response.payload.data.data])
        }

        setCurrentPage(page)
      } catch (error) {
        console.error('Failed to load notifications:', error)
      }
    },
    [dispatch, isAuthenticated, lastPolledCount]
  )

  // Uncommented the polling interval for real-time notifications
  useEffect(() => {
    if (!isAuthenticated) return

    const pollInterval = setInterval(() => {
      loadNotifications(1, true)
    }, 60000) // Poll every minute

    return () => clearInterval(pollInterval)
  }, [isAuthenticated, loadNotifications])

  // Initial load
  useEffect(() => {
    if (isAuthenticated && !isLoaded) {
      loadNotifications(1)
    }
  }, [isAuthenticated, isLoaded, loadNotifications])

  const loadMore = useCallback(() => {
    if (hasMore && !isLoading) {
      loadNotifications(currentPage + 1)
    }
  }, [hasMore, isLoading, currentPage, loadNotifications])

  const formatTimeAgo = timestamp => {
    return moment(timestamp).locale('vi', vi).fromNow()
  }

  const handleMarkAsRead = async notificationId => {
    try {
      const data = await dispatch(markNotificationAsRead(notificationId))
      if (data.payload?.data?.isRead === true) {
        // Update the notification locally first for better UX
        setAllNotifications(prevNotifications =>
          prevNotifications.map(notification =>
            notification._id === notificationId ? { ...notification, isRead: true } : notification
          )
        )
      }
    } catch (error) {
      // console.error('Failed to mark notification as read:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const response = await dispatch(markAllNotificationsAsRead())
      if (response.payload.status === 200 || response.payload.status === 201) {
        // Update all notifications locally first for better UX
        setAllNotifications(prevNotifications =>
          prevNotifications.map(notification => ({ ...notification, isRead: true }))
        )
        // Then reload from server to ensure sync
        loadNotifications(1)
      }
    } catch (error) {
      // console.error('Failed to mark all notifications as read:', error)
    }
  }

  const getNotificationText = typeInput => {
    if (!typeInput) return ''

    const [status, type] = typeInput.split('_')

    if (status === 'request') {
      return type === 'receive' ? 'yêu cầu nhận' : 'yêu cầu đổi'
    } else if (status === 'approve') {
      return type === 'receive' ? 'đã chấp nhận yêu cầu nhận' : 'đã chấp nhận yêu cầu đổi'
    } else if (status === 'reject') {
      return type === 'receive' ? 'đã từ chối yêu cầu nhận' : 'đã từ chối yêu cầu đổi'
    }
    return ''
  }

  const getNotificationName = notification => {
    if (!notification || !notification.type) return 'Ẩn danh'

    const type = notification.type.split('_')[0]
    if (type === 'request') {
      return notification.source_id?.user_req_id?.name || 'Ẩn danh'
    }
    return notification.post_id?.user_id?.name || 'Ẩn danh'
  }

  const formattedNotifications = useMemo(() => {
    if (!allNotifications || !Array.isArray(allNotifications)) return []
    return allNotifications
      .map(notification => {
        if (!notification) return null

        return {
          id: notification?._id,
          title: getNotificationName(notification),
          action: getNotificationText(notification?.type),
          postTitle: notification.post_id?.title || 'không có tiêu đề',
          isApproved: notification?.type?.startsWith('approve'),
          time: formatTimeAgo(notification.created_at),
          isRead: notification.isRead,
          postId: notification.post_id?._id,
          sourceId: notification.source_id?._id,
          imageUrl: notification.post_id?.image_url || null,
          status: notification.post_id?.user_id?.status,
          ownerName: notification.post_id?.user_id?.name,
          receiverName: notification.source_id?.user_req_id?.name,
          contact: notification.post_id?.user_id?.phone,
          facebookLink: notification.post_id?.user_id?.social_media?.facebook,
          type: notification.type.split('_')[1]
        }
      })
      .filter(Boolean) // Remove null items
  }, [allNotifications])

  const unreadCount = useMemo(() => {
    if (!allNotifications || !Array.isArray(allNotifications)) return 0
    return allNotifications.filter(notification => !notification.isRead).length
  }, [allNotifications])

  return {
    notifications: formattedNotifications,
    unreadCount,
    total,
    isLoading,
    isLoaded,
    hasMore,
    selectedNotification,
    isVisibleNotificationDetail, // Ensure this is returned
    loadNotifications,
    loadMore,
    handleMarkAsRead,
    handleMarkAllAsRead
  }
}
