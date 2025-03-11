import React, { useEffect, useRef } from 'react'
import { Space, Button, Dropdown, Menu } from 'antd'
import { UnorderedListOutlined, DownOutlined } from '@ant-design/icons'
import styles from './scss/Logo.module.scss'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getAllCategory } from 'features/client/category/categoryThunks'
import { getCategories, setCategories } from 'utils/localStorageUtils'
import { setCategory } from 'features/client/category/categorySlice'

// Fixed to use category.id for navigation instead of parent ID
const handleMenuItemClick = (e, category, navigate, parentId) => {
  e.domEvent.stopPropagation()
  // Always use the category's own ID for navigation
  const navigateId = category.id
  navigate(`/post/category/${navigateId === '67c6c5ecf83ba5fb6ecfaa0e' ? 'all' : navigateId}`)
}

// Modified recursive function to track parent IDs for children
const renderMenuItems = (categories, navigate, parentId = null) =>
  categories?.map(category => {
    if (category.children && category.children.length > 0) {
      return (
        <Menu.SubMenu
          key={category.id || category.title}
          title={
            <span>
              {category.icon} {category.title}
            </span>
          }
          className={styles.SubMenu}
          onTitleClick={e => {
            e.domEvent.stopPropagation()
            navigate(`/post/category/${category.id === '67c6c5ecf83ba5fb6ecfaa0e' ? 'all' : category.id}`)
          }}
        >
          {/* Pass current category's ID as parentId to all children */}
          {renderMenuItems(category.children, navigate, category.id)}
        </Menu.SubMenu>
      )
    }
    return (
      <Menu.Item
        key={category.id || category.title}
        icon={category.icon}
        className={styles.SubMenu}
        onClick={e => handleMenuItemClick(e, category, navigate, parentId)}
      >
        {category.title}
      </Menu.Item>
    )
  })

const handleDataCategory = categories => {
  return categories?.map(category => {
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
  const prevCategoriesRef = useRef() // Lưu giá trị trước đó của categories
  const categoriesInitialized = useRef(false)

  useEffect(() => {
    // Only run this effect once
    if (!categoriesInitialized.current) {
      const categoriesLocal = getCategories()
      if (categoriesLocal.length === 0) {
        dispatch(getAllCategory())
      } else {
        dispatch(setCategory(categoriesLocal))
      }
      categoriesInitialized.current = true
    }
  }, [dispatch])

  useEffect(() => {
    // Kiểm tra nếu categories thay đổi so với giá trị trước đó
    if (prevCategoriesRef.current !== categories) {
      setCategories(categories) // Lưu vào localStorage
      prevCategoriesRef.current = categories // Cập nhật giá trị tham chiếu
    }
  }, [categories]) // Phụ thuộc vào categories

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
