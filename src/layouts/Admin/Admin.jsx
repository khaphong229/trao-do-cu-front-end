import React, { useState } from 'react'
import { MdDashboard } from 'react-icons/md'
import { IoMdSettings } from 'react-icons/io'
import { BsPostcardFill } from 'react-icons/bs'
import { IoLogOut } from 'react-icons/io5'
import { FaUser } from 'react-icons/fa'
import { IoNotifications } from 'react-icons/io5'
import { Layout, Menu, message, Popover, theme } from 'antd'
import styles from './styles.module.scss'
import logo from '../../assets/images/final/logo_traodocu.png'
import Search from 'antd/es/transfer/search'
import avatar from '../../assets/images/logo/avt-3d.jpg'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { removeAuthToken } from '../../utils/localStorageUtils'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../../features/auth/authThunks'
const { Header, Sider, Content } = Layout

const App = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [current, setCurrent] = useState('1')
  const { isAdmin } = useSelector(state => state.auth)
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken()
  const onSearch = (value, _e, info) => console.log(info?.source, value)
  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap()
      removeAuthToken()
      const logoutPath = isAdmin ? '/admin/login' : '/login'
      navigate(logoutPath)
      message.success('Đăng xuất thành công')
    } catch (error) {
      message.error('Đăng xuất thất bại')
    }
  }
  const onClick = e => {
    setCurrent(e.key)
  }
  return (
    <Layout className={styles.layoutWrap} style={{ minHeight: '100vh' }}>
      <Sider
        className={styles.siderWrap}
        width="300"
        style={{
          background: colorBgContainer
        }}
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={broken => {
          // console.log(broken)
        }}
        onCollapse={(collapsed, type) => {
          // console.log(collapsed, type)
        }}
      >
        <div className={styles.demoLogoVertical}>
          <img src={logo} alt="" className={styles.demoLogoImg} />
          <span className={styles.demoLogoText}>TRAO ĐỒ</span>
        </div>
        <Menu
          className={styles.menuWrap}
          theme="dark"
          mode="inline"
          style={{
            background: colorBgContainer
          }}
          onClick={onClick}
          selectedKeys={[current]}
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: <MdDashboard />,
              label: <Link to="dashboard">Bảng điều khiển</Link>
            },
            {
              key: '2',
              icon: <FaUser />,
              label: <Link to="user">Người dùng</Link>
            },
            {
              key: '3',
              icon: <BsPostcardFill />,
              label: <Link to="post">Bài đăng</Link>
            },
            {
              key: '4',
              icon: <IoMdSettings />,
              label: 'Cài đặt'
            },
            {
              key: '5',
              icon: <IoLogOut />,
              label: <span onClick={handleLogout}>Đăng xuất</span>
            }
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            height: '100px'
          }}
        >
          <div className={styles.headerWrap}>
            <div className={styles.headerLeft}>{/* <span className={styles.headerText}>Bảng điều khiển</span> */}</div>
            <div className={styles.headerRight}>
              {/* <Search
                className={styles.headerSearch}
                placeholder="Nhập nội dung tìm kiếm"
                allowClear
                onSearch={onSearch}
              /> */}
              <IoMdSettings />
              <IoNotifications />
              <Popover placement="bottomRight" title={'phong'} content={'thông tin'}>
                <img className={styles.headerImage} src={avatar} alt="" />
              </Popover>
            </div>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px 0'
          }}
        >
          <div
            style={{
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}
export default App
