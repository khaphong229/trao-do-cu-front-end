import React from 'react'
import { Avatar, Button } from 'antd'
import styles from './UserInfor.module.scss'

import { useAvatar } from 'hooks/useAvatar'

export const UserInfo = ({ user, onCreatePost }) => {
  const { avatar } = useAvatar()
  return (
    <div className={styles['user-info']}>
      <Avatar className={styles.avt} src={avatar} size="large" />
      <div className={styles['user-details']}>
        <h4>{user.name}</h4>
        <Button type="primary" className={styles['create-post-btn']} onClick={onCreatePost}>
          Tạo bài đăng
        </Button>
      </div>
    </div>
  )
}
