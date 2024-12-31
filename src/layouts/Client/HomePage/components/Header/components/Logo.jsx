import React from 'react'
import { Space, Button, Dropdown, Menu } from 'antd'
import { UnorderedListOutlined, DownOutlined } from '@ant-design/icons'
import logo from '../../../../../../assets/images/logo/logoText.png'
import styles from './scss/Logo.module.scss'
import { useNavigate } from 'react-router-dom'

const renderMenuItems = categories =>
  categories.map(category => {
    if (category.children && category.children.length > 0) {
      return (
        <Menu.SubMenu
          key={category.title}
          title={
            <Space>
              {category.icon}
              {category.title}
            </Space>
          }
          className={styles.SubMenu}
        >
          {renderMenuItems(category.children)}
        </Menu.SubMenu>
      )
    }
    return (
      <Menu.Item key={category.title} icon={category.icon} className={styles.SubMenu}>
        {category.title}
      </Menu.Item>
    )
  })

const Logo = ({ categoryData }) => {
  const navigate = useNavigate()

  const goHome = () => {
    navigate('/')
  }
  return (
    <Space size="small" className={styles.contentWrapper}>
      <span className={styles.textLogo} onClick={goHome}>
        TRAO ĐỒ CŨ
      </span>
      {/* <img src={logo} alt="logo" className={styles.Logo} onClick={goHome} style={{ cursor: 'pointer' }} /> */}
      <Dropdown overlay={<Menu>{renderMenuItems(categoryData)}</Menu>} trigger={['hover']}>
        <Button type="text" icon={<UnorderedListOutlined className={styles.Icon} />} className={styles.Button}>
          Danh mục <DownOutlined className={styles.IconDown} />
        </Button>
      </Dropdown>
    </Space>
  )
}

export default Logo
