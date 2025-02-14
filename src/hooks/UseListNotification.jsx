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
  const { data: notifications, total, isLoading } = useSelector(state => state.notification.notifications)
  const { isAuthenticated } = useSelector(state => state.auth)

  const loadNotifications = useCallback(
    async (page = 1) => {
      if (!isAuthenticated) return

      try {
        const response = await dispatch(getNotificationPagination({ current: page, pageSize: 10 }))
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
    [dispatch, isAuthenticated]
  )

  const loadMore = useCallback(() => {
    if (hasMore && !isLoading) {
      loadNotifications(currentPage + 1)
    }
  }, [hasMore, isLoading, currentPage, loadNotifications])

  useEffect(() => {
    if (isAuthenticated && !isLoaded) {
      loadNotifications(1)
    }
  }, [isAuthenticated, isLoaded, loadNotifications])

  const formatTimeAgo = timestamp => {
    return moment(timestamp).locale('vi', vi).fromNow()
  }

  const handleMarkAsRead = async notificationId => {
    try {
      const data = await dispatch(markNotificationAsRead(notificationId))
      if (data.payload?.data?.isRead === true) {
        loadNotifications(currentPage)
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const response = await dispatch(markAllNotificationsAsRead())
      if (response.payload.status === 200 || response.payload.status === 201) {
        loadNotifications(1)
      }
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
    }
  }

  const getNotificationText = typeInput => {
    const [status, type] = typeInput.split('_')

    if (status === 'request') {
      return type === 'receive' ? 'yêu cầu nhận' : 'yêu cầu đổi'
    } else if (status === 'approve') {
      return type === 'receive' ? 'yêu cầu nhận' : 'yêu cầu đổi'
    }
    return ''
  }

  const getNotificationName = notification => {
    const type = notification.type.split('_')[0]
    if (type === 'request') {
      return notification.source_id?.user_req_id?.name || 'Ẩn danh'
    }
    return notification.post_id.user_id?.name || 'Ẩn danh'
  }

  const formattedNotifications = useMemo(() => {
    if (!allNotifications) return []

    return allNotifications.map(notification => ({
      id: notification._id,
      title: getNotificationName(notification),
      action: getNotificationText(notification.type),
      postTitle: notification.post_id.title,
      isApproved: notification.type.startsWith('approve'),
      time: formatTimeAgo(notification.created_at),
      isRead: notification.isRead,
      postId: notification.post_id._id
    }))
  }, [allNotifications])

  const unreadCount = useMemo(() => {
    if (!allNotifications) return 0
    return allNotifications.filter(notification => !notification.isRead).length
  }, [allNotifications])

  return {
    notifications: formattedNotifications,
    unreadCount,
    total,
    isLoading,
    isLoaded,
    hasMore,
    loadNotifications,
    loadMore,
    handleMarkAsRead,
    handleMarkAllAsRead
  }
}
