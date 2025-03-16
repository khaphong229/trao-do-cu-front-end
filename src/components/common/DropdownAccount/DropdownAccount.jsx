import { handleLogout, NavigateItem } from 'constants/data'
import { useSelector } from 'react-redux'
import { ArrowRightOutlined, LockOutlined, LogoutOutlined, PlayCircleOutlined, UserOutlined } from '@ant-design/icons'

export const useMenuItems = () => {
  const { isAuthenticated } = useSelector(state => state.auth)

  return [
    {
      title: 'Quản lý sản phẩm',
      items: [
        {
          label: <NavigateItem to="/management-post?tab=active">Sản phẩm trao đi</NavigateItem>,
          icon: <PlayCircleOutlined style={{ color: '#00b96b' }} />,
          key: 'active'
        },
        {
          label: <NavigateItem to="/management-post?tab=requested">Sản phẩm đang chờ duyệt</NavigateItem>,
          icon: <ArrowRightOutlined style={{ color: '#00b96b' }} />,
          key: 'requested'
        }
      ]
    },
    {
      title: 'Tài khoản của tôi',
      items: [
        {
          label: <NavigateItem to="/profile?tab=personal">Tài khoản của tôi</NavigateItem>,
          icon: <UserOutlined style={{ color: '#00b96b' }} />,
          key: 'personal'
        },
        {
          label: <NavigateItem to="/profile?tab=security">Đổi mật khẩu</NavigateItem>,
          icon: <LockOutlined style={{ color: '#00b96b' }} />,
          key: 'security'
        },
        ...(isAuthenticated
          ? [
              {
                label: <span onClick={() => handleLogout()}>Đăng xuất</span>,
                icon: <LogoutOutlined style={{ color: '#00b96b' }} />,
                key: 'logout'
              }
            ]
          : [])
      ]
    }
  ]
}

// Assuming this is what NavigateItem might look like if it's not already defined
// If NavigateItem is already defined elsewhere, you can omit this
// export const NavigateItem = ({ to, children }) => {
//   const navigate = useNavigate();
//   return (
//     <span onClick={() => navigate(to)}>
//       {children}
//     </span>
//   );
// };
