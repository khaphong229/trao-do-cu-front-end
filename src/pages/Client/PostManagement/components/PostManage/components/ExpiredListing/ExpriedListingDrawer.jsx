import React from 'react'
import { Drawer, Avatar } from 'antd'
import styles from './Scss/ExpriedListingDrawer.module.scss'

export const ExpiredListingDrawer = ({ visible, onClose, listing }) => {
  if (!listing) return null

  return (
    <Drawer
      title="Chi tiết bài đăng đã hết hạn"
      placement="right"
      closable={true}
      onClose={onClose}
      visible={visible}
      width={400}
    >
      <div>
        <div className={styles['drawer-avatar-container']}>
          <Avatar src={listing.avatar} size={64} className={styles['drawer-avatar']} />
          <div className={styles['drawer-user-info']}>
            <h3>{listing.username}</h3>
            <p>{listing.title}</p>
          </div>
        </div>
        <p className={styles['drawer-description']}>{listing.description}</p>
        <div className={styles['recipient-info']}>
          <h4>Thông tin người nhận/trao đổi:</h4>
          {listing.type === 'gift' ? (
            <div className={styles['recipient-detail']}>
              <Avatar src={listing.registrations[0]?.avatar} size={40} className={styles.avatar} />
              <span>{listing.registrations[0]?.username || 'Không có thông tin'}</span>
            </div>
          ) : (
            <>
              <div className={styles['recipient-detail']}>
                <Avatar src={listing.registrations[0]?.avatar} size={40} className={styles.avatar} />
                <span>{listing.registrations[0]?.username || 'Không có thông tin'}</span>
              </div>
              <p>Yêu cầu trao đổi: {listing.registrations[0]?.exchangeOffer?.description || 'Không có thông tin'}</p>
              <div className={styles['exchange-requirement']}>
                {listing.registrations[0]?.exchangeOffer?.images.map((img, index) => (
                  <img key={index} src={img} alt="Sản phẩm trao đổi" />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </Drawer>
  )
}
