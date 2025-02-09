import React from 'react'
import { Space, Badge, Avatar, Dropdown, Button } from 'antd'
import { BellOutlined, DownOutlined, SignatureOutlined } from '@ant-design/icons'
import styles from './scss/HeaderIcons.module.scss'
import CreatePostModal from '../../../../../../pages/Client/Post/CreatePost'
import { useDispatch, useSelector } from 'react-redux'
import { setCreateModalVisibility, setShowTour } from 'features/client/post/postSlice'
import withAuth from 'hooks/useAuth'
import avtDefault from 'assets/images/logo/avtDefault.webp'
import { URL_SERVER_IMAGE } from 'config/url_server'
// import { UseListNotification } from 'hooks/UseListNotification'
// import { NotificationMenu } from 'constants/menus'

const HeaderIcons = ({ menu }) => {
  const dispatch = useDispatch()
  const AuthenticatedButton = withAuth(Button)
  const { isAuthenticated, user } = useSelector(state => state.auth)
  // const { loadNotifications, listNotification } = UseListNotification()
  const listNotification = 0
  return (
    <>
      <Space size="large" className={styles.contentWrapper}>
        <Dropdown
          // overlay={<NotificationMenu />}
          trigger={['click']}
          placement="bottomRight"
          getPopupContainer={() => document.body}
          // onOpenChange={open => open && loadNotifications()}
        >
          <Badge count={listNotification.length} size="small" color="red">
            <BellOutlined className={styles.Icon} />
          </Badge>
        </Dropdown>
        <Dropdown overlay={menu} placement="bottomRight">
          <Space className={styles.Avatar} style={{ cursor: 'pointer', color: '#fff' }}>
            <Avatar
              className={styles.avt}
              src={user?.avatar ? (user?.isGoogle ? user.avatar : `${URL_SERVER_IMAGE}${user.avatar}`) : avtDefault}
              size={32}
            />
            {!isAuthenticated ? 'Tài khoản' : user.name}
            <DownOutlined className={styles.IconDown} />
          </Space>
        </Dropdown>
        <AuthenticatedButton
          icon={<SignatureOutlined />}
          type="default"
          className={styles.Button}
          onClick={() => {
            dispatch(setCreateModalVisibility(true))
            dispatch(setShowTour(true))
          }}
        >
          Đăng bài
        </AuthenticatedButton>
      </Space>
      <CreatePostModal />
    </>
  )
}

export default HeaderIcons
