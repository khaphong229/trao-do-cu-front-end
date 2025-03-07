import { handleLogout, NavigateItem } from 'constants/data'
import { useSelector } from 'react-redux'
import {
  ArrowRightOutlined,
  CheckSquareOutlined,
  LockOutlined,
  LogoutOutlined,
  PlayCircleOutlined,
  UserOutlined
} from '@ant-design/icons'

export const useMenuItems = () => {
  const { isAuthenticated } = useSelector(state => state.auth)

  return [
    {
      title: 'Quản lý bài đăng',
      items: [
        {
          label: <NavigateItem to="/management-post?tab=active">Đang hiển thị</NavigateItem>,
          icon: <PlayCircleOutlined style={{ color: '#00b96b' }} />
        },
        {
          label: <NavigateItem to="/management-post?tab=expired">Đã thành công</NavigateItem>,
          icon: <CheckSquareOutlined style={{ color: '#00b96b' }} />
        },
        {
          label: <NavigateItem to="/management-post?tab=requested">Đã yêu cầu</NavigateItem>,
          icon: <ArrowRightOutlined style={{ color: '#00b96b' }} />
        }
      ]
    },
    {
      title: 'Tài khoản của tôi',
      items: [
        {
          name: <NavigateItem to="/profile?tab=personal">Tài khoản của tôi</NavigateItem>,
          icon: <UserOutlined style={{ color: '#00b96b' }} />
        },
        {
          name: <NavigateItem to="/profile?tab=security">Đổi mật khẩu</NavigateItem>,
          icon: <LockOutlined style={{ color: '#00b96b' }} />
        },
        ...(isAuthenticated
          ? [
              {
                label: <span onClick={() => handleLogout()}>Đăng xuất</span>,
                icon: <LogoutOutlined style={{ color: '#00b96b' }} />
              }
            ]
          : [])
      ]
    }
  ]
}
