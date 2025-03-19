import React, { useEffect } from 'react'
import { Modal, List, Typography, Button } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { setVisibleSuccessPopup } from 'features/client/notification/notificationSlice'
import { UseListNotification } from 'hooks/UseListNotification'
import { useWindowSize } from 'react-use'
import Confetti from 'react-confetti'

const { Text } = Typography

const NotificationSuccessPopup = () => {
  const dispatch = useDispatch()
  const { handleMarkAsRead } = UseListNotification()
  const { width, height } = useWindowSize()
  const { notifications, isVisibleSuccessPopup } = useSelector(state => state.notification)
  const { data } = notifications

  useEffect(() => {
    const existsSuccess = data.some(item => item.type.split('_')[0] === 'approve' && item.isRead === false)
    if (existsSuccess) {
      dispatch(setVisibleSuccessPopup(true))
    }
  }, [data, dispatch])

  const dataProcessed = data
    .filter(item => item.type.split('_')[0] === 'approve' && item.isRead === false)
    .map(item => {
      let textOfType = ''
      if (item.type.split('_')[1] === 'receive') {
        textOfType = 'được nhận'
      } else {
        textOfType = 'trao đổi'
      }

      return {
        id: item._id,
        title: item.post_id?.title,
        userName: item.post_id?.user_id?.name,
        phone: item.post_id?.user_id?.phone,
        facebook: item.post_id?.user_id.social_media?.facebook,
        type: textOfType
      }
    })

  const handleClose = () => {
    dataProcessed.forEach(item => {
      handleMarkAsRead(item.id)
    })
    dispatch(setVisibleSuccessPopup(false))
  }

  const formatFacebookUrl = fbUrl => {
    if (!fbUrl) return ''
    if (fbUrl.startsWith('http://') || fbUrl.startsWith('https://')) {
      return fbUrl
    }
    return `https://facebook.com/${fbUrl}`
  }

  const renderContactInfo = item => {
    const hasPhone = !!item.phone
    const hasFacebook = !!item.facebook

    if (hasPhone && hasFacebook) {
      return (
        <>
          <a href={`tel:${item.phone}`}>{item.phone}</a> hoặc{' '}
          <a href={formatFacebookUrl(item.facebook)} target="_blank" rel="noopener noreferrer">
            Facebook
          </a>
        </>
      )
    } else if (hasPhone) {
      return <a href={`tel:${item.phone}`}>{item.phone}</a>
    } else if (hasFacebook) {
      return (
        <a href={formatFacebookUrl(item.facebook)} target="_blank" rel="noopener noreferrer">
          Facebook
        </a>
      )
    } else {
      return 'không có thông tin liên hệ'
    }
  }

  const renderContent = item => {
    return (
      <>
        Bạn đã {item.type} thành công sản phẩm{' '}
        <Text strong style={{ color: '#1890ff' }}>
          {item.title}
        </Text>{' '}
        của <Text strong>{item.userName}</Text> vui lòng liên hệ thông qua {renderContactInfo(item)}
      </>
    )
  }

  return (
    <>
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 20, marginRight: 8 }} />
            <span>Xin chúc mừng!</span>
          </div>
        }
        open={isVisibleSuccessPopup}
        onCancel={handleClose}
        footer={[
          <Button key="close" type="primary" onClick={handleClose}>
            Đóng
          </Button>
        ]}
        width={500}
      >
        <Confetti width={width} height={height} numberOfPieces={50} style={{ zIndex: 9999 }} />
        <List
          itemLayout="vertical"
          dataSource={dataProcessed}
          renderItem={item => (
            <List.Item style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ display: 'flex' }}>
                <Text>{renderContent(item)}</Text>
              </div>
            </List.Item>
          )}
          locale={{ emptyText: 'Không có thông báo' }}
        />
      </Modal>
    </>
  )
}

export default NotificationSuccessPopup
