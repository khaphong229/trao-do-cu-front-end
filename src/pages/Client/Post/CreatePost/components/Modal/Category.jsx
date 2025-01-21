import React, { useEffect } from 'react'
import { message, Modal, Tree } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { setCategoryModalVisibility, updatePostData } from 'features/client/post/postSlice'
import { getAllCategory } from 'features/client/category/categoryThunks'
import { setSelectedCategory } from 'features/client/category/categorySlice'
import styles from '../../scss/CategoryModal.module.scss'

const CategoryModal = () => {
  const dispatch = useDispatch()
  const { selectedCategory } = useSelector(state => state.category)
  const { isCategoryModalVisible } = useSelector(state => state.post)
  const { categories, isLoading } = useSelector(state => state.category)
  useEffect(() => {
    if (categories.length === 0) {
      dispatch(getAllCategory())
    }
  }, [dispatch, categories.length])

  const onSelect = (_, { selectedNodes, node }) => {
    if (selectedNodes.length > 0) {
      const selectedNode = selectedNodes[0]

      let categoryId
      if (selectedNode.dataRef.parent !== null) {
        categoryId = selectedNode.dataRef.parent
      } else {
        categoryId = selectedNode.key
      }

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
  }

  const renderTreeNodes = data => {
    return data.map(item => {
      if (item.children) {
        return (
          <Tree.TreeNode key={item._id} title={item.name} dataRef={item}>
            {renderTreeNodes(item.children)}
          </Tree.TreeNode>
        )
      }
      return <Tree.TreeNode key={item._id} title={item.name} dataRef={item} />
    })
  }

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
