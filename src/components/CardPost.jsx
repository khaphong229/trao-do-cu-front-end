import React from 'react'
import { Card, Button, Avatar, Tooltip, Typography, Badge } from 'antd'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import imageNotFound from 'assets/images/others/imagenotfound.webp'
import { getValidImageUrl } from 'helpers/helper'
import { GiftOutlined, SwapOutlined } from '@ant-design/icons'
import { FaMapMarkerAlt } from 'react-icons/fa'
import { getAvatarPostNews } from 'hooks/useAvatar'
import { useSelector } from 'react-redux'
import { useGiftRequest } from 'pages/Client/Request/GiftRequest/useRequestGift'
import withAuth from 'hooks/useAuth'
import styles from './CardPost.module.scss'
import logoPtit from 'assets/images/common/ptit_logo.png'

const { Text, Paragraph } = Typography
function CardPost({ item }) {
  const navigate = useNavigate()
  const { user } = useSelector(state => state.auth)
  const goDetail = _id => {
    navigate(`/post/${_id}/detail`)
  }
  const AuthButton = withAuth(Button)
  const { handleGiftRequest } = useGiftRequest()
  const renderActionButton = item => {
    if (!user) {
      return item.type === 'gift' ? (
        <AuthButton
          icon={<GiftOutlined />}
          className={styles.actionButton}
          type="primary"
          onClick={() => handleGiftRequest(item, item.type)}
        >
          Nhận
        </AuthButton>
      ) : (
        <AuthButton
          icon={<SwapOutlined />}
          className={styles.actionButton}
          type="default"
          onClick={() => handleGiftRequest(item, item.type)}
        >
          Đổi
        </AuthButton>
      )
    }

    if (item.isRequested) {
      return (
        <Tooltip title={`Bạn ơi, chờ ${item.user_id?.name} xác nhận nhé!`}>
          <Button className={styles.actionButton} disabled>
            Đã yêu cầu
          </Button>
        </Tooltip>
      )
    }

    const isMe = item?.user_id?._id === user._id

    return (
      <Tooltip title={isMe ? 'Không thể thực hiện thao tác với bài đăng của bạn' : ''}>
        {item.type === 'gift' ? (
          <AuthButton
            icon={<GiftOutlined />}
            className={styles.actionButton}
            type="primary"
            disabled={isMe}
            onClick={() => handleGiftRequest(item, item.type)}
          >
            Nhận
          </AuthButton>
        ) : (
          <AuthButton
            icon={<SwapOutlined />}
            className={styles.actionButton}
            type="default"
            disabled={isMe}
            onClick={() => handleGiftRequest(item, item.type)}
          >
            Đổi
          </AuthButton>
        )}
      </Tooltip>
    )
  }
  return (
    <>
      <Badge.Ribbon
        text={item.type === 'gift' ? 'Trao tặng' : 'Trao đổi'}
        color={item.type === 'gift' ? 'red' : 'blue'}
      >
        <Card
          hoverable
          className={styles.itemCard}
          cover={
            <div className={styles.imageWrapper} onClick={() => goDetail(item._id)}>
              <img
                loading="lazy"
                alt={item.title}
                src={getValidImageUrl(item.image_url) || '/placeholder.svg'}
                onError={e => {
                  e.target.onerror = null
                  e.target.src = imageNotFound
                }}
              />
              <img src={logoPtit} alt="logo_ptit" className={styles.logo_ptit} />
            </div>
          }
          actions={[renderActionButton(item)]}
        >
          <Card.Meta
            title={
              <Tooltip title={item.title}>
                <Paragraph className={styles.itemTitle} onClick={() => goDetail(item._id)} ellipsis={{ rows: 2 }}>
                  {item.title}
                </Paragraph>
              </Tooltip>
            }
          />

          <div className={styles.locationRow}>
            <div className={styles.userGroup}>
              <Avatar size="small" className={styles.avtUser} src={getAvatarPostNews(item?.user_id)} />
              <Text type="secondary" className={styles.time}>
                {dayjs(item.created_at).isValid() ? dayjs(item.created_at).fromNow() : 'Không rõ thời gian'}
              </Text>
            </div>
            {item?.city && (item.city.includes('Thành phố') || item.city.includes('Tỉnh')) ? (
              <Text type="secondary" className={styles.location}>
                <FaMapMarkerAlt style={{ marginRight: 4, fontSize: '14px' }} />
                {item.city.split('Thành phố')[1] || item.city.split('Tỉnh')[1]}
              </Text>
            ) : (
              item?.city && (
                <Text type="secondary" className={styles.location}>
                  {item.city.split('Thành phố')[1] || item.city.split('Tỉnh')[1]}
                </Text>
              )
            )}
          </div>
        </Card>
      </Badge.Ribbon>
    </>
  )
}

export default CardPost
