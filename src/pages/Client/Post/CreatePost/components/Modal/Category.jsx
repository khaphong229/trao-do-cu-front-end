import React, { useEffect } from 'react'
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

  // Reset danh mục đã chọn khi mở modal
  useEffect(() => {
    if (isCategoryModalVisible) {
      dispatch(setSelectedCategory(null)) // Reset danh mục đã chọn
    }
  }, [isCategoryModalVisible, dispatch])

  const onSelect = (_, { selectedNodes, node }) => {
    if (selectedNodes.length > 0) {
      const selectedNode = selectedNodes[0]
      const categoryId = selectedNode.dataRef.parent !== null ? selectedNode.dataRef.parent : selectedNode.key

      dispatch(setSelectedCategory(selectedNode))
      dispatch(updatePostData({ category_id: categoryId }))

      if (node.children) {
        node.expanded = !node.expanded
      }
    }
  }

  const handleOk = () => {
    dispatch(setCategoryModalVisibility(false))
    message.success('Chọn danh mục thành công!')
  }

  const handleCancel = () => {
    dispatch(setCategoryModalVisibility(false))
    dispatch(setSelectedCategory(null)) // Reset danh mục khi đóng modal
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
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Lưu"
      cancelText="Hủy"
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
