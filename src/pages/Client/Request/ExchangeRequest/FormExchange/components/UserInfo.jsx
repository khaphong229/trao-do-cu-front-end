import React from 'react'
import { Avatar } from 'antd'
import styles from '../scss/UserInfo.module.scss'
import { useSelector } from 'react-redux'
import avt from 'assets/images/logo/avtDefault.webp'
import { URL_SERVER_IMAGE } from 'config/url_server'
const UserInfo = () => {
  const { requestData } = useSelector(state => state.exchangeRequest)
  const { user } = useSelector(state => state.auth)
  return (
    <div className={styles.userInfo}>
      <Avatar size={40} src={user?.avatar ? `${URL_SERVER_IMAGE}${user.avatar}` : avt} />
      <div className={styles.userDetails}>
        <div className={styles.textWrapper}>
          <div className={styles.username}>{user.name}</div>
          <div className={styles.infoMore}>
            {requestData.city ? (
              <span className={styles.cityText}>{requestData.city}</span>
            ) : (
              <span className={styles.cityText}>{user?.address}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserInfo
