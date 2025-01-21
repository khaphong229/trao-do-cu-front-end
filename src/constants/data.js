import {
  ArrowRightOutlined,
  CameraOutlined,
  CarOutlined,
  CheckSquareOutlined,
  HeartOutlined,
  HomeOutlined,
  LaptopOutlined,
  LockOutlined,
  LogoutOutlined,
  MobileOutlined,
  PlayCircleOutlined,
  ShoppingOutlined,
  SkinOutlined,
  SolutionOutlined,
  TagsOutlined,
  UserOutlined
} from '@ant-design/icons'
import { message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { removeAuthToken } from 'utils/localStorageUtils'

export const categoryData = [
  {
    title: 'Bất động sản',
    icon: <HomeOutlined />,
    children: []
  },
  {
    title: 'Xe cộ',
    icon: <CarOutlined />,
    children: []
  },
  {
    title: 'Đồ điện tử',
    icon: <LaptopOutlined />,
    children: [
      { title: 'Điện thoại', icon: <MobileOutlined /> },
      { title: 'Laptop', icon: <LaptopOutlined /> },
      { title: 'Máy ảnh, Máy quay', icon: <CameraOutlined /> }
    ]
  },
  {
    title: 'Việc làm',
    icon: <SolutionOutlined />,
    children: []
  },
  {
    title: 'Thời trang',
    icon: <ShoppingOutlined />,
    children: [
      { title: 'Quần áo', icon: <SkinOutlined /> },
      { title: 'Giày dép', icon: <TagsOutlined /> }
    ]
  }
]
export const notifications = [
  {
    title: 'John Doe liked your post',
    time: '5 mins ago'
  },
  {
    title: 'Moo Doe liked your cover image',
    time: '7 mins ago'
  },
  {
    title: 'Lee Doe commented on your video',
    time: '10 mins ago'
  }
]
export const cartItems = [
  {
    id: 1,
    name: 'Điện thoại iPhone 14',
    price: 25000000,
    image: 'https://via.placeholder.com/50',
    quantity: 2
  },
  {
    id: 2,
    name: 'Laptop MacBook Pro',
    price: 45000000,
    image: 'https://via.placeholder.com/50',
    quantity: 1
  },
  {
    id: 3,
    name: 'Máy ảnh Sony Alpha',
    price: 20000000,
    image: 'https://via.placeholder.com/50',
    quantity: 3
  }
]

const handleLogout = () => {
  removeAuthToken()
  message.success('Đăng xuất thành công!')
  window.location.reload()
}

const NavigateItem = ({ to, children, ...props }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(to)
  }

  return (
    <span onClick={handleClick} {...props}>
      {children}
    </span>
  )
}

export const menuItems = [
  {
    title: 'Quản lý bài đăng',
    items: [
      {
        label: <NavigateItem to="/management_post?type=active">Đang hiển thị</NavigateItem>,
        icon: <PlayCircleOutlined style={{ color: '#00b96b' }} />
      },
      {
        label: <NavigateItem to="/management_post?type=expired">Đã thành công</NavigateItem>,
        icon: <CheckSquareOutlined style={{ color: '#00b96b' }} />
      },
      {
        label: <NavigateItem to="/management_post?type=requested">Đã yêu cầu</NavigateItem>,
        icon: <ArrowRightOutlined style={{ color: '#00b96b' }} />
      }
    ]
  },
  // {
  //   title: 'Tiện ích',
  //   items: [
  //     {
  //       name: 'Bài đăng yêu thích',
  //       icon: <HeartOutlined style={{ color: '#ff4d4f' }} />
  //     }
  //   ]
  // },

  {
    title: 'Tài khoản của tôi',
    items: [
      {
        name: <NavigateItem to="/profile">Tài khoản của tôi</NavigateItem>,
        icon: <UserOutlined style={{ color: '#00b96b' }} />
      },
      {
        name: 'Đổi mật khẩu',
        icon: <LockOutlined style={{ color: '#00b96b' }} />
      },
      {
        // name: 'Đăng xuất',
        label: <span onClick={() => handleLogout()}>Đăng xuất</span>,
        icon: <LogoutOutlined style={{ color: '#00b96b' }} />
      }
    ]
  }
]
