import React, { useState } from 'react'
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
import useCheckMobileScreen from 'hooks/useCheckMobileScreen'
import pcoin from 'assets/images/logo/pcoin.png'

const HeaderIcons = ({ menu }) => {
  const dispatch = useDispatch()
  const AuthenticatedButton = withAuth(Button)
  const { avatar } = useAvatar()
  const { isAuthenticated, user } = useSelector(state => state.auth)
  const { unreadCount, loadNotifications } = UseListNotification()

  const [dropdownVisible, setDropdownVisible] = useState(false) // State để điều khiển dropdown

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

  const { isMobile } = useCheckMobileScreen()

  const renderText = () => {
    if (!isAuthenticated) {
      return 'Đăng sản phẩm'
    } else {
      if (isMobile) {
        return 'Đăng'
      } else {
        return 'Đăng sản phẩm'
      }
    }
  }

  return (
    <>
      <Space size="middle" className={styles.contentWrapper}>
        <Dropdown
          overlay={<NotificationMenu setDropdownVisible={setDropdownVisible} />}
          trigger={['click']}
          placement="bottomRight"
          getPopupContainer={() => document.body}
          open={dropdownVisible}
          onOpenChange={visible => {
            setDropdownVisible(visible)
            if (visible) {
              loadNotifications()
            }
          }}
        >
          <Badge count={unreadCount} size="small" color="red">
            <BellOutlined className={styles.Icon} />
          </Badge>
        </Dropdown>
        {isAuthenticated &&
          (!isMobile ? (
            <div className={styles.pcoinWrap}>
              <span className={styles.textPcoin}>Hiện có: {user?.pcoin_balance?.total}</span>
              <img className={styles.pcoin} src={pcoin} alt="pcoin_logo" />
            </div>
          ) : (
            <div className={styles.pcoinWrap}>
              <img className={styles.pcoin} src={pcoin} alt="pcoin_logo" />
              <span className={styles.textPcoin}>{user?.pcoin_balance?.total}</span>
            </div>
          ))}
        <Dropdown overlay={menu} placement="bottomRight">
          <Space className={styles.Avatar} style={{ cursor: 'pointer', color: '#fff' }}>
            <Avatar className={styles.avt} src={avatar} size={32} />
            <span className={styles.userName}>{!isAuthenticated ? 'Tài khoản' : user.name}</span>
            <DownOutlined className={styles.IconDown} />
          </Space>
        </Dropdown>
        <AuthenticatedButton icon={<SignatureOutlined />} type="default" className={styles.Button} onClick={handlePost}>
          {renderText()}
        </AuthenticatedButton>
      </Space>
      <CreatePostModal />
    </>
  )
}

export default HeaderIcons
