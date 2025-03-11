import React, { useRef, useCallback } from 'react'
import { Card, List, Typography, Button, Empty, Spin, Menu, Divider, Avatar } from 'antd'
import { UseListNotification } from 'hooks/UseListNotification'
import { Link } from 'react-router-dom'
import styles from './NotificationMenu.module.scss'
import { useAvatar } from 'hooks/useAvatar'
import { useMenuItems } from 'components/common/DropdownAccount/DropdownAccount'

const { Text } = Typography

const NotificationItem = ({ notification, onClick }) => {
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
    <List.Item className={`${styles.notificationItem} ${!notification.isRead ? styles.unread : ''}`} onClick={onClick}>
      <Link className={styles.notifiHref}>
        <List.Item.Meta
          title={<Text className={styles.itemTitle}>{content}</Text>}
          description={<Text type="secondary">{notification.time}</Text>}
        />
      </Link>
    </List.Item>
  )
}

export const NotificationMenu = () => {
  const { notifications, isLoading, hasMore, handleMarkAsRead, handleMarkAllAsRead, loadMore } = UseListNotification()

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

  return (
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
                <NotificationItem notification={notification} onClick={() => handleMarkAsRead(notification.id)} />
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
