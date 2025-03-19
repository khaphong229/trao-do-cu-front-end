import React, { useEffect, useState } from 'react'
import { Button, message, Tree } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { setCategoryModalVisibility, updatePostData } from 'features/client/post/postSlice'
import { setSelectedCategory } from 'features/client/category/categorySlice'
import styles from '../../scss/CategoryModal.module.scss'

const CategoryModal = ({ categoryId, setCategory, error, embeddedMode = false, onComplete }) => {
  const dispatch = useDispatch()
  const { selectedCategory } = useSelector(state => state.category)
  const { isCategoryModalVisible } = useSelector(state => state.post)
  const { categories, isLoading } = useSelector(state => state.category)

  // Add state to track if a non-leaf node is selected
  const [nonLeafSelected, setNonLeafSelected] = useState(false)

  // State for expanded tree nodes
  const [expandedKeys, setExpandedKeys] = useState([])

  // Show error message if provided
  useEffect(() => {
    if (error && isCategoryModalVisible) {
      message.error(error, 5) // Show error message for 5 seconds
    }
  }, [error, isCategoryModalVisible])

  // Don't reset selected category when opening modal
  useEffect(() => {
    if (isCategoryModalVisible && selectedCategory) {
      // Find parent nodes of selected category to expand them
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

      // Check if current selection is a non-leaf node
      if (selectedCategory.children && selectedCategory.children.length > 0) {
        setNonLeafSelected(true)
        // Show message when a non-leaf node is selected
      } else {
        setNonLeafSelected(false)
      }
    }
  }, [isCategoryModalVisible, selectedCategory, categories])

  // Show message when categories are empty
  useEffect(() => {
    if (isCategoryModalVisible && !isLoading && (!categories || categories.length === 0)) {
      message.error('Không có dữ liệu danh mục. Vui lòng thử lại sau.', 3)
    }
  }, [isCategoryModalVisible, isLoading, categories])

  const onSelect = (_, { selectedNodes, node }) => {
    if (selectedNodes.length > 0) {
      const selectedNode = selectedNodes[0]
      const categoryId = selectedNode.dataRef.parent !== null ? selectedNode.dataRef.parent : selectedNode.key

      dispatch(setSelectedCategory(selectedNode))
      dispatch(updatePostData({ category_id: categoryId }))

      if (setCategory) {
        setCategory(categoryId)
      }

      // Check if this is a leaf node (no children)
      const isLeafNode = !node.children || node.children.length === 0
      setNonLeafSelected(!isLeafNode)

      // Only auto-close and transition if it's a leaf node
      if (isLeafNode) {
        dispatch(setCategoryModalVisibility(false))
        message.success('Chọn danh mục thành công!')

        // Automatically open location modal after a short delay
        // setTimeout(() => {
        //   dispatch(setLocationModalVisibility(true))
        // }, 300)
      } else {
        // If not a leaf node, just expand it and show message
        setExpandedKeys([...expandedKeys, node.key])
      }
    }
  }

  // Handle expand/collapse of tree nodes
  const onExpand = expandedKeys => {
    setExpandedKeys(expandedKeys)
  }

  const handleConfirmCategory = () => {
    if (!selectedCategory) {
      message.error('Vui lòng chọn một danh mục')
      return
    }

    dispatch(setCategoryModalVisibility(false))
    if (onComplete) {
      onComplete()
    }
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
    // <Modal
    //   title="Chọn danh mục"
    //   open={isCategoryModalVisible}
    //   onCancel={handleCancel}
    //   footer={null}
    //   width={500}
    //   className={styles.categoryModal}
    // >

    <div className={styles.categoryModal}>
      <p className={styles.textTitle}>Chọn dạnh mục sản phẩm</p>
      {isLoading ? (
        <div className={styles.loadingContainer}>Đang tải danh mục...</div>
      ) : (
        <div className={styles.categoryTreeWrapper}>
          {categories && categories.length > 0 ? (
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
          ) : (
            <div className={styles.noDataMessage}>Không có dữ liệu danh mục. Vui lòng thử lại sau.</div>
          )}
          {embeddedMode && (
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <Button type="primary" onClick={handleConfirmCategory}>
                Xác nhận danh mục
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CategoryModal
