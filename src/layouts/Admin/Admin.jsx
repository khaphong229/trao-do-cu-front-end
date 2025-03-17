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
import avatar from '../../assets/images/logo/avtDefault.webp'
import { Link, useNavigate } from 'react-router-dom'
import { removeAuthToken } from '../../utils/localStorageUtils'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../../features/auth/authThunks'
const { Header, Sider, Content } = Layout

const App = ({ children }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [current, setCurrent] = useState('1')
  const { isAdmin } = useSelector(state => state.auth)
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken()
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
              label: <Link to="/admin/dashboard">Bảng điều khiển</Link>
            },
            {
              key: '2',
              icon: <FaUser />,
              label: <Link to="/admin/user">Người dùng</Link>
            },
            {
              key: '3',
              icon: <BsPostcardFill />,
              label: <Link to="/admin/post">Bài đăng</Link>
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
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}
export default App
