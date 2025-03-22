import React, { useRef, useCallback } from 'react'
import { Card, List, Typography, Button, Empty, Spin, Menu, Divider, Avatar } from 'antd'
import { UseListNotification } from 'hooks/UseListNotification'
import { useNavigate } from 'react-router-dom'
import styles from './NotificationMenu.module.scss'
import { useAvatar } from 'hooks/useAvatar'
import { useMenuItems } from 'components/common/DropdownAccount/DropdownAccount'
import { useDispatch, useSelector } from 'react-redux'
import {
  markNotificationAsRead,
  setSelectedNotification,
  setVisibleNotificationDetail
} from 'features/client/notification/notificationSlice'
import NotificationDetail from 'components/feature/NotificationDetail/NotificationDetail'

const { Text } = Typography

const NotificationItem = ({ notification, onClick, navigate, setDropdownVisible }) => {
  const dispatch = useDispatch()

  const handleNotificationClick = () => {
    // Đánh dấu thông báo là đã đọc
    onClick()

    if (!notification.isRead) {
      dispatch(markNotificationAsRead(notification._id))
    }
    setDropdownVisible(false)
    // Hiển thị modal chi tiết
    dispatch(setVisibleNotificationDetail(true))
    dispatch(setSelectedNotification(notification))
  }

  const getNotificationIcon = (type, isApproved) => {
    switch (type) {
      case 'request':
        return isApproved ? '✅' : '🔄' // Icon thành công hoặc icon trao đổi
      case 'receive':
        return isApproved ? '🎉' : '📦' // Icon thành công hoặc icon nhận hàng
      default:
        return isApproved ? '🔔' : '🔔' // Icon mặc định
    }
  }

  const getNotificationTypeClass = (type, isApproved) => {
    if (isApproved) {
      return 'success' // Loại thành công
    }
    switch (type) {
      case 'exchange':
        return 'exchange' // Loại trao đổi
      case 'receive':
        return 'receive' // Loại trao tặng
      default:
        return 'other' // Loại khác
    }
  }

  let content
  if (notification.isApproved) {
    content = (
      <>
        {notification.title} <span style={{ color: 'green' }}>đồng ý</span> <strong>{notification.action}</strong> "
        {notification.postTitle}" của bạn.
      </>
    )
  } else {
    content = (
      <>
        {notification.title} <strong>{notification.action}</strong> "{notification.postTitle}".
      </>
    )
  }

  return (
    <List.Item
      className={`${styles.notificationItem} ${!notification.isRead ? styles.unread : styles.read}`}
      onClick={handleNotificationClick}
    >
      <div className={styles.notifiHref}>
        <List.Item.Meta
          avatar={
            <span className={styles.notificationIcon}>
              {getNotificationIcon(notification.type, notification.isApproved)}
            </span>
          }
          title={
            <Text className={styles.itemTitle}>
              {content}
              <span className={`${styles.notificationType} ${styles[getNotificationTypeClass(notification.type)]}`}>
                {notification.type}
              </span>
            </Text>
          }
          description={<Text type="secondary">{notification.time}</Text>}
        />
      </div>
    </List.Item>
  )
}
export const NotificationMenu = ({ setDropdownVisible }) => {
  const navigate = useNavigate()
  const { notifications, isLoading, hasMore, handleMarkAsRead, handleMarkAllAsRead, loadMore } = UseListNotification()
  const { isVisibleNotificationDetail, selectedNotification } = useSelector(state => state.notification)

  const observerRef = useRef(null)
  const lastElementRef = useRef(null)

  const handleObserver = useCallback(
    entries => {
      const target = entries[0]
      if (target.isIntersecting && hasMore && !isLoading) {
        loadMore()
      }
    },
    [hasMore, isLoading, loadMore]
  )

  React.useEffect(() => {
    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 0.1
    }

    observerRef.current = new IntersectionObserver(handleObserver, options)

    if (lastElementRef.current) {
      observerRef.current.observe(lastElementRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [handleObserver])

  React.useEffect(() => {
    if (lastElementRef.current) {
      observerRef.current.observe(lastElementRef.current)
    }
  }, [notifications])

  // Đóng dropdown khi mở modal chi tiết
  React.useEffect(() => {
    if (isVisibleNotificationDetail) {
      setDropdownVisible(false)
    }
  }, [isVisibleNotificationDetail])

  return (
    <>
      <Card
        className={styles.notificationCard}
        title={
          <div className={styles.cardHeader}>
            <span>Thông báo</span>
            {notifications.length > 0 && (
              <Button type="link" onClick={handleMarkAllAsRead}>
                Đánh dấu tất cả đã đọc
              </Button>
            )}
          </div>
        }
      >
        {isLoading && notifications.length === 0 ? (
          <div className={styles.loadingContainer}>
            <Spin />
          </div>
        ) : notifications.length === 0 ? (
          <Empty
            description="Không có thông báo mới"
            className={styles.emptyState}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <div className={styles.notificationList}>
            <List
              dataSource={notifications}
              renderItem={(notification, index) => (
                <div ref={index === notifications.length - 1 ? lastElementRef : null}>
                  <NotificationItem
                    notification={notification}
                    onClick={() => handleMarkAsRead(notification.id)}
                    navigate={navigate}
                    setDropdownVisible={setDropdownVisible}
                  />
                </div>
              )}
            />
            {isLoading && (
              <div className={styles.loadingMore}>
                <Spin size="small" />
              </div>
            )}
          </div>
        )}
      </Card>

      {isVisibleNotificationDetail && <NotificationDetail notification={selectedNotification} />}
    </>
  )
}

export const UserMenu = user => {
  const { avatar } = useAvatar()
  return (
    <Menu style={{ width: 200 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '10px',
          gap: '10px'
        }}
      >
        <Avatar size={40} src={avatar} />
        <Text level={5}>{user.name || 'Tài khoản'}</Text>
      </div>
      <Divider
        style={{
          margin: '10px'
        }}
      />
      {useMenuItems().map((section, index) => (
        <Menu.ItemGroup key={index} title={section.title}>
          {section.items.map((item, i) => (
            <Menu.Item key={`${index}-${i}`} icon={item.icon}>
              {item.name || item.label}
            </Menu.Item>
          ))}
        </Menu.ItemGroup>
      ))}
    </Menu>
  )
}
