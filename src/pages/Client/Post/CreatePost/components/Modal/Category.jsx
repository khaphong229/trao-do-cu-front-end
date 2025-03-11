import React, { useEffect, useState } from 'react'
import { message, Modal, Tree } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { setCategoryModalVisibility, updatePostData } from 'features/client/post/postSlice'
import { setSelectedCategory } from 'features/client/category/categorySlice'
import styles from '../../scss/CategoryModal.module.scss'

const CategoryModal = () => {
  const dispatch = useDispatch()
  const { selectedCategory } = useSelector(state => state.category)
  const { isCategoryModalVisible } = useSelector(state => state.post)
  const { categories, isLoading } = useSelector(state => state.category)

  // Thêm state để lưu các key của node đã mở rộng
  const [expandedKeys, setExpandedKeys] = useState([])

  // Không reset danh mục đã chọn khi mở modal
  useEffect(() => {
    if (isCategoryModalVisible && selectedCategory) {
      // Tìm các node cha của node đã chọn để mở rộng
      if (selectedCategory.dataRef && selectedCategory.dataRef.parent) {
        const findParentPath = (items, targetId, path = []) => {
          for (const item of items) {
            if (item._id === targetId) {
              return [...path, item._id]
            }

            if (item.children && item.children.length > 0) {
              const found = findParentPath(item.children, targetId, [...path, item._id])
              if (found.length) return found
            }
          }
          return []
        }

        const parentPath = findParentPath(categories, selectedCategory.dataRef.parent)
        if (parentPath.length > 0) {
          setExpandedKeys(parentPath)
        }
      }
    }
  }, [isCategoryModalVisible, selectedCategory, categories])

  const onSelect = (_, { selectedNodes, node }) => {
    if (selectedNodes.length > 0) {
      const selectedNode = selectedNodes[0]
      const categoryId = selectedNode.dataRef.parent !== null ? selectedNode.dataRef.parent : selectedNode.key

      dispatch(setSelectedCategory(selectedNode))
      dispatch(updatePostData({ category_id: categoryId }))

      // Nếu node không có children (node lá), tự động đóng modal và hiển thị thông báo
      if (!node.children || node.children.length === 0) {
        dispatch(setCategoryModalVisibility(false))
        message.success('Chọn danh mục thành công!')
      }
    }
  }

  // Xử lý sự kiện mở rộng/thu gọn node
  const onExpand = expandedKeys => {
    setExpandedKeys(expandedKeys)
  }

  const handleCancel = () => {
    dispatch(setCategoryModalVisibility(false))
    // Không reset selectedCategory khi đóng modal để lưu lại lựa chọn
  }

  const renderTreeNodes = data =>
    data.map(item =>
      item.children ? (
        <Tree.TreeNode key={item._id} title={item.name} dataRef={item}>
          {renderTreeNodes(item.children)}
        </Tree.TreeNode>
      ) : (
        <Tree.TreeNode key={item._id} title={item.name} dataRef={item} />
      )
    )

  return (
    <Modal
      title="Chọn danh mục"
      open={isCategoryModalVisible}
      onCancel={handleCancel}
      footer={null}
      width={500}
      className={styles.categoryModal}
    >
      {isLoading ? (
        <div>Đang tải...</div>
      ) : (
        <div className={styles.categoryTreeWrapper}>
          <Tree
            showLine={false}
            onSelect={onSelect}
            onExpand={onExpand}
            expandedKeys={expandedKeys}
            selectedKeys={selectedCategory?.key ? [selectedCategory.key] : []}
            className={styles.categoryTree}
            expandAction="click"
          >
            {renderTreeNodes(categories)}
          </Tree>
        </div>
      )}
    </Modal>
  )
}

export default CategoryModal
