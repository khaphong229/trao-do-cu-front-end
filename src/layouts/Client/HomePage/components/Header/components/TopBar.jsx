import React from 'react'
import { Button } from 'antd'
import { UserOutlined, LoginOutlined, HomeOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import styles from './scss/TopBar.module.scss'
import { useSelector } from 'react-redux'
import { Package } from 'lucide-react'

const TopBar = () => {
  const { isAuthenticated } = useSelector(state => state.auth)
  return (
    <div className={styles.TopBarWrap}>
      <div className={styles.contentWelcome}>
        <span>Chào mừng đến với TRAO ĐỒ CŨ!</span>
      </div>
      <div className={styles.topBarContent}>
        <Button icon={<HomeOutlined />} type="text" className={styles.button}>
          <Link className={styles.linkText} to="/">
            Trang chủ
          </Link>
        </Button>
        <Button icon={<UserOutlined />} type="text" className={styles.button}>
          <Link className={styles.linkText} to="/profile">
            Tài khoản
          </Link>
        </Button>
        {!isAuthenticated ? (
          <Button icon={<LoginOutlined />} type="text" className={styles.button}>
            <Link className={styles.linkText} to="/login">
              Đăng nhập
            </Link>
          </Button>
        ) : (
          <Button icon={<Package height={16} width={16} />} type="text" className={styles.button}>
            <Link className={styles.linkText} to="/management-post">
              Quản lý sản phẩm
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}

export default TopBar
