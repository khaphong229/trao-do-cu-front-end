import React from 'react'
import { Card, Button, Avatar, Badge } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import styles from './Scss/ListingCard.module.scss'
import { URL_SERVER_IMAGE } from '../../../../../../../config/url_server'

const renderBadge = post => {
  const statusOK = post.type === 'exchange' ? 'success' : 'processing'
  const text = post.type === 'exchange' ? 'Trao đổi' : 'Trao tặng'
  return <Badge status={statusOK} text={text} />
}

export const ListingCard = ({ listing, onViewRegistrations, onViewDetails }) => {
  return (
    <Card
      className={styles.listingCard}
      style={{ borderRadius: '0px', height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <div className={styles.listingCardContent}>
        <div className={styles.listingCardHeader}>
          <Avatar
            src={`${URL_SERVER_IMAGE}${listing.user_id?.avatar}`}
            icon={<UserOutlined />}
            size={40}
            className={styles.ownerAvatar}
          />
          <div className={styles.headerInfo}>
            <div
              className={styles.nameWrapper}
              style={{
                display: 'flex',
                justifyContent: 'space-between'
              }}
            >
              <h5 className={styles.ownerName}>{listing.user_id?.name || 'Người dùng'}</h5>
              {renderBadge(listing)}
            </div>

            <h4 className={styles.listingTitle}>{listing.title}</h4>
          </div>
        </div>
        <p className={styles.listingCardDescription}>{listing.description}</p>
        <div className={styles.listingCardImages}>
          {listing.image_url?.map((img, index) => (
            <img
              key={index}
              src={`${URL_SERVER_IMAGE}${img}`}
              alt={`Sản phẩm ${index + 1}`}
              className={styles.listingCardImage}
              width={160}
              height={160}
            />
          ))}
        </div>
      </div>
      <div className={styles.listingCardActions}>
        <Button onClick={() => onViewRegistrations(listing)} className={styles.listingCardButton}>
          {listing.type === 'exchange' ? 'Xem danh sách người đổi' : 'Xem danh sách người nhận'}
        </Button>
      </div>
    </Card>
  )
}
