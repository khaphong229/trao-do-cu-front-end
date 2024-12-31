import React from 'react'
import { Avatar } from 'antd'
import styles from '../scss/UserInfo.module.scss'
import { useSelector } from 'react-redux'
import avt from 'assets/images/logo/avt-3d.jpg'
const UserInfo = () => {
  const { requestData } = useSelector(state => state.exchangeRequest)
  const { user } = useSelector(state => state.auth)
  return (
    <div className={styles.userInfo}>
      <Avatar size={40} src={user.avatar || avt} />
      <div className={styles.userDetails}>
        <div className={styles.textWrapper}>
          <div className={styles.username}>{user.name}</div>
          <div className={styles.infoMore}>
            {requestData.city && <span className={styles.cityText}>{requestData.city}</span>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserInfo
