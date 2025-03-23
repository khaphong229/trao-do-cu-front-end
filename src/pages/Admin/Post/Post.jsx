import React, { useEffect, useState } from 'react'
import { Row, Col, Input, Button } from 'antd'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons'
import styles from './styles.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import {
  forceRefresh,
  setIsDetailsModalVisible,
  setIsModalVisible,
  setSearchText,
  setSelectedPost
} from '../../../features/admin/post/postAdminSlice'
import PostTable from './components/PostTable'
import PostDetailModal from './components/PostDetailModal'
import { setPage } from 'features/admin/user/userSlice'
import { getPostAdminPagination } from 'features/admin/post/postAdminThunks'
import PostFormModal from './components/PostFormModal/PostFormModal'
import { getAllCategory } from 'features/client/category/categoryThunks'

const Post = () => {
  const dispatch = useDispatch()
  const [isEditing, setIsEditing] = useState(false)

  const { isModalVisible, isDetailsModalVisible, selectedPost, searchText } = useSelector(
    state => state.postManagement || {}
  )

  useEffect(() => {
    dispatch(setPage(1))
    dispatch(getPostAdminPagination({ current: 1, pageSize: 10, searchText }))
    dispatch(getAllCategory())
  }, [dispatch, searchText])

  const handleSearch = value => {
    dispatch(setSearchText(value))
  }

  const handleEditPost = post => {
    dispatch(setSelectedPost(post))
    setIsEditing(true)
    dispatch(setIsModalVisible(true))
  }

  const handleViewDetails = post => {
    dispatch(setSelectedPost(post))
    dispatch(setIsDetailsModalVisible(true))
  }

  const handleReload = () => {
    dispatch(getPostAdminPagination({ current: 1, pageSize: 10, searchText }))
  }

  const handleSuccessUpdate = () => {
    // Force a refresh of the table data
    dispatch(forceRefresh())
    dispatch(getPostAdminPagination({ current: 1, pageSize: 10, searchText }))
  }
  return (
    <div className={styles.userManagement}>
      <h2 className={styles.titleMain} style={{ marginBottom: '20px' }}>
        Quản lý sản phẩm
      </h2>
      <Row gutter={[16, 16]} align="middle" justify="space-between" style={{ marginBottom: '40px' }}>
        <Col xs={24} sm={6}>
          <Input
            placeholder="Tìm kiếm sản phẩm"
            prefix={<SearchOutlined />}
            onChange={e => handleSearch(e.target.value)}
            value={searchText}
            style={{ width: '100%' }}
          />
        </Col>
        <Col>
          <Button icon={<ReloadOutlined />} onClick={handleReload} size="large" title="Tải lại dữ liệu" />
        </Col>
      </Row>

      <PostTable onEdit={handleEditPost} onViewDetails={handleViewDetails} />

      <PostDetailModal
        open={isDetailsModalVisible}
        post={selectedPost}
        onClose={() => dispatch(setIsDetailsModalVisible(false))}
      />
      <PostFormModal
        visible={isModalVisible}
        isEditing={isEditing}
        initialPost={selectedPost}
        onClose={() => {
          dispatch(setIsModalVisible(false))
          setIsEditing(false)
        }}
        categories={useSelector(state => state.category?.categories || [])}
        onSuccessUpdate={handleSuccessUpdate}
      />
    </div>
  )
}

export default Post
