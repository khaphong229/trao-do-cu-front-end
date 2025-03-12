import React from 'react'
import { Space, Badge, Avatar, Dropdown, Button } from 'antd'
import { BellOutlined, DownOutlined, SignatureOutlined } from '@ant-design/icons'
import styles from './scss/HeaderIcons.module.scss'
import CreatePostModal from '../../../../../../pages/Client/Post/CreatePost'
import { useDispatch, useSelector } from 'react-redux'
import { setCreateModalVisibility, setShowTour } from 'features/client/post/postSlice'
import withAuth from 'hooks/useAuth'
import { UseListNotification } from 'hooks/UseListNotification'
import { NotificationMenu } from 'constants/menus'
import { useAvatar } from 'hooks/useAvatar'
import { setInfoModalVisible } from 'features/client/request/giftRequest/giftRequestSlice'

const HeaderIcons = ({ menu }) => {
  const dispatch = useDispatch()
  const AuthenticatedButton = withAuth(Button)
  const { avatar } = useAvatar()
  const { isAuthenticated, user } = useSelector(state => state.auth)
  const { unreadCount, loadNotifications } = UseListNotification()

  const checkUserContactInfo = () => {
    return (user?.phone || user?.social_media?.facebook) && user?.address
  }

  const handlePost = () => {
    if (!checkUserContactInfo()) {
      dispatch(setInfoModalVisible(true))
    } else {
      dispatch(setCreateModalVisibility(true))
      dispatch(setShowTour(true))
    }
  }

  return (
    <>
      <Space size="large" className={styles.contentWrapper}>
        <Dropdown
          overlay={<NotificationMenu />}
          trigger={['click']}
          placement="bottomRight"
          getPopupContainer={() => document.body}
          onOpenChange={open => open && loadNotifications()}
        >
          <Badge count={unreadCount} size="small" color="red">
            <BellOutlined className={styles.Icon} />
          </Badge>
        </Dropdown>
        <Dropdown overlay={menu} placement="bottomRight">
          <Space className={styles.Avatar} style={{ cursor: 'pointer', color: '#fff' }}>
            <Avatar className={styles.avt} src={avatar} size={32} />
            {!isAuthenticated ? 'Tài khoản' : user.name}
            <DownOutlined className={styles.IconDown} />
          </Space>
        </Dropdown>
        <AuthenticatedButton icon={<SignatureOutlined />} type="default" className={styles.Button} onClick={handlePost}>
          Đăng sản phẩm
        </AuthenticatedButton>
      </Space>
      <CreatePostModal />
    </>
  )
}

export default HeaderIcons
