import {
  CameraOutlined,
  CarOutlined,
  HomeOutlined,
  LaptopOutlined,
  MobileOutlined,
  ShoppingOutlined,
  SkinOutlined,
  SolutionOutlined,
  TagsOutlined
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

export const handleLogout = () => {
  removeAuthToken()
  message.success('Đăng xuất thành công!')
  window.location.reload()
}

export const NavigateItem = ({ to, children, ...props }) => {
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
