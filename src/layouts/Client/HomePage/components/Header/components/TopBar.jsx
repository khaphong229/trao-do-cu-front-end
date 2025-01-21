import React from 'react'
import { Button } from 'antd'
import { UserOutlined, HeartOutlined, LoginOutlined, BarsOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import styles from './scss/TopBar.module.scss'
import { useSelector } from 'react-redux'

const TopBar = () => {
  const { isAuthenticated } = useSelector(state => state.auth)
  return (
    <div className={styles.TopBarWrap}>
      <div className={styles.contentWelcome}>
        <span>Chào mừng đến với TRAO ĐỒ CŨ!</span>
      </div>
      <div className={styles.topBarContent}>
        <Button icon={<UserOutlined />} type="text" className={styles.button}>
          <Link to="/profile">Tài khoản</Link>
        </Button>
        {/* <Button icon={<HeartOutlined />} type="text" className={styles.button}>
          Yêu thích
        </Button> */}
        {!isAuthenticated ? (
          <Button icon={<LoginOutlined />} type="text" className={styles.button}>
            <Link to="/login">Đăng nhập</Link>
          </Button>
        ) : (
          <Button icon={<BarsOutlined />} type="text" className={styles.button}>
            <Link to="/management-post">Quản lý bài đăng</Link>
          </Button>
        )}
      </div>
    </div>
  )
}

export default TopBar
