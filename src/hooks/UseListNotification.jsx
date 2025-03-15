import { useState, useMemo, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import vi from 'moment/locale/vi'
import {
  getNotificationPagination,
  markAllNotificationsAsRead,
  markNotificationAsRead
} from 'features/client/notification/notificationThunks'
import axios from 'axios'

const sendTelegramNotification = async message => {
  const botToken = process.env.REACT_APP_TELEGRAM_BOT_TOKEN
  const chatId = process.env.REACT_APP_TELEGRAM_CHAT_ID

  if (!botToken || !chatId) {
    console.error('Bot token or chat ID is missing.')
    return
  }

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`

  try {
    const response = await axios.post(url, {
      chat_id: chatId,
      text: message
    })
    console.log('Message sent successfully:', response.data)
  } catch (error) {
    console.error('Error sending message:', error.response?.data || error.message)
  }
}

// Hàm định dạng thông báo
const formatNotificationMessage = notification => {
  const { title, action, postTitle } = notification

  if (action.includes('đồng ý')) {
    return `${title} đồng ý ${action} "${postTitle}" của bạn.`
  } else {
    return `${title} ${action} "${postTitle}".`
  }
}

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

            // Gửi thông báo đến Telegram khi có thông báo mới
            const newNotifications = response.payload.data.data.filter(n => !n.isRead)
            newNotifications.forEach(notification => {
              const formattedNotification = {
                title: getNotificationName(notification),
                action: getNotificationText(notification?.type),
                postTitle: notification.post_id?.title || 'Không có tiêu đề'
              }
              const message = formatNotificationMessage(formattedNotification)
              sendTelegramNotification(message)
            })
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

  useEffect(() => {
    if (!isAuthenticated) return

    const pollInterval = setInterval(() => {
      loadNotifications(1, true)
    }, 60000) // Poll every minute

    return () => clearInterval(pollInterval)
  }, [isAuthenticated, loadNotifications])

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
        setAllNotifications(prevNotifications =>
          prevNotifications.map(notification =>
            notification._id === notificationId ? { ...notification, isRead: true } : notification
          )
        )

        // Gửi thông báo đến Telegram
        const notification = allNotifications.find(n => n._id === notificationId)
        if (notification) {
          const formattedNotification = {
            title: getNotificationName(notification),
            action: getNotificationText(notification?.type),
            postTitle: notification.post_id?.title || 'Không có tiêu đề'
          }
          const message = formatNotificationMessage(formattedNotification)
          sendTelegramNotification(message)
        }
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const response = await dispatch(markAllNotificationsAsRead())
      if (response.payload.status === 200 || response.payload.status === 201) {
        setAllNotifications(prevNotifications =>
          prevNotifications.map(notification => ({ ...notification, isRead: true }))
        )
        loadNotifications(1)

        // Gửi thông báo đến Telegram
        const message = 'Tất cả thông báo đã được đánh dấu là đã đọc.'
        sendTelegramNotification(message)
      }
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
    }
  }

  const getNotificationText = typeInput => {
    if (!typeInput) return 'Không có loại thông báo'

    const [status, type] = typeInput.split('_')

    if (status === 'request') {
      return type === 'receive' ? 'yêu cầu nhận' : 'yêu cầu đổi'
    } else if (status === 'approve') {
      return type === 'receive' ? 'đã chấp nhận yêu cầu nhận' : 'đã chấp nhận yêu cầu đổi'
    } else if (status === 'reject') {
      return type === 'receive' ? 'đã từ chối yêu cầu nhận' : 'đã từ chối yêu cầu đổi'
    }
    return 'Không có loại thông báo'
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
          id: notification?._id || 'Không có ID',
          title: getNotificationName(notification) || 'Ẩn danh',
          action: getNotificationText(notification?.type) || 'Không có hành động',
          postTitle: notification.post_id?.title || 'Không có tiêu đề',
          isApproved: notification?.type?.startsWith('approve') || false,
          time: formatTimeAgo(notification.created_at) || 'Không có thời gian',
          isRead: notification.isRead || false,
          postId: notification.post_id?._id || 'Không có post ID',
          sourceId: notification.source_id?._id || 'Không có source ID',
          imageUrl: notification.post_id?.image_url || null,
          status: notification.post_id?.user_id?.status || 'Không có trạng thái',
          ownerName: notification.post_id?.user_id?.name || 'Ẩn danh',
          receiverName: notification.source_id?.user_req_id?.name || 'Ẩn danh',
          contact: notification.post_id?.user_id?.phone || 'Không có liên hệ',
          facebookLink: notification.post_id?.user_id?.social_media?.facebook || 'Không có link Facebook',
          type: notification.type?.split('_')[1] || 'Không có loại'
        }
      })
      .filter(Boolean)
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
    isVisibleNotificationDetail,
    loadNotifications,
    loadMore,
    handleMarkAsRead,
    handleMarkAllAsRead
  }
}
