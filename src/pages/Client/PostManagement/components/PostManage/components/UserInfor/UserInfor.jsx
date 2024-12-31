import React from 'react'
import { Avatar, Button } from 'antd'
import styles from './UserInfor.module.scss'
import avt from 'assets/images/logo/avt-3d.jpg'

export const UserInfo = ({ user, onCreatePost }) => (
  <div className={styles['user-info']}>
    <Avatar src={user.avatar || avt} size="large" />
    <div className={styles['user-details']}>
      <h4>{user.name}</h4>
      <Button type="primary" className={styles['create-post-btn']} onClick={onCreatePost}>
        Tạo bài đăng
      </Button>
    </div>
  </div>
)
