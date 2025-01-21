import React, { useEffect } from 'react'
import { Space, Button, Dropdown, Menu } from 'antd'
import { UnorderedListOutlined, DownOutlined, ShoppingOutlined } from '@ant-design/icons'
import styles from './scss/Logo.module.scss'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getAllCategory } from 'features/client/category/categoryThunks'
import { FaHome } from 'react-icons/fa'

const iconCategories = {
  'Bất động sản': <FaHome />
}

const renderMenuItems = (categories, navigate) =>
  categories.map(category => {
    const handleClick = () => {
      navigate(`/post/category/${category.id}`)
    }

    if (category.children && category.children.length > 0) {
      return (
        <Menu.SubMenu
          key={category.title}
          title={
            <Space onClick={handleClick} style={{ width: '100%' }}>
              {category.icon}
              {category.title}
            </Space>
          }
          className={styles.SubMenu}
        >
          {renderMenuItems(category.children, navigate)}
        </Menu.SubMenu>
      )
    }
    return (
      <Menu.Item key={category.title} icon={category.icon} className={styles.SubMenu} onClick={handleClick}>
        {category.title}
      </Menu.Item>
    )
  })

const handleDataCategory = categories => {
  return categories.map(category => {
    const formattedCategory = {
      id: category._id,
      title: category.name,
      // icon: iconCategories[category.name] || <ShoppingOutlined />,
      children: []
    }

    if (category.children && category.children.length > 0) {
      formattedCategory.children = handleDataCategory(category.children)
    }

    return formattedCategory
  })
}

const Logo = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { categories } = useSelector(state => state.category)

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(getAllCategory())
    }
  }, [dispatch, categories.length])

  const goHome = () => {
    navigate('/')
  }

  const formattedCategories = handleDataCategory(categories)

  return (
    <Space size="small" className={styles.contentWrapper}>
      <span className={styles.textLogo} onClick={goHome}>
        TRAO ĐỒ CŨ
      </span>
      <Dropdown overlay={<Menu>{renderMenuItems(formattedCategories, navigate)}</Menu>} trigger={['hover']}>
        <Button type="text" icon={<UnorderedListOutlined className={styles.Icon} />} className={styles.Button}>
          Danh mục <DownOutlined className={styles.IconDown} />
        </Button>
      </Dropdown>
    </Space>
  )
}

export default Logo
