import React from 'react'
import { Space, Badge, Avatar, Dropdown, Button } from 'antd'
import { BellOutlined, DownOutlined, SignatureOutlined } from '@ant-design/icons'
import styles from './scss/HeaderIcons.module.scss'
import CreatePostModal from '../../../../../../pages/Client/Post/CreatePost'
import { useDispatch, useSelector } from 'react-redux'
import { setCreateModalVisibility, setShowTour } from 'features/client/post/postSlice'
import withAuth from 'hooks/useAuth'
import avtDefault from 'assets/images/logo/avtDefault.jpg'
import { URL_SERVER_IMAGE } from 'config/url_server'

const HeaderIcons = ({ notificationMenu, cartMenu, menu }) => {
  const dispatch = useDispatch()
  const AuthenticatedButton = withAuth(Button)
  const { isAuthenticated, user } = useSelector(state => state.auth)

  return (
    <>
      <Space size="large" className={styles.contentWrapper}>
        {/* <Dropdown
          overlay={cartMenu}
          trigger={['click']}
          placement="bottomRight"
          getPopupContainer={() => document.body}
        >
          <Badge count={0} size="small" color="red">
            <HeartOutlined className={styles.Icon} />
          </Badge>
        </Dropdown> */}
        <Dropdown
          overlay={notificationMenu}
          trigger={['click']}
          placement="bottomRight"
          getPopupContainer={() => document.body}
        >
          <Badge count={0} size="small" color="red">
            <BellOutlined className={styles.Icon} />
          </Badge>
        </Dropdown>
        <Dropdown overlay={menu} placement="bottomRight">
          <Space className={styles.Avatar} style={{ cursor: 'pointer', color: '#fff' }}>
            <Avatar
              className={styles.avt}
              src={user?.avatar ? `${URL_SERVER_IMAGE}${user.avatar}` : avtDefault}
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
