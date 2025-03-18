import React, { useState } from 'react'
import { Row, Col, Input, Button } from 'antd'
import { SearchOutlined, PlusOutlined } from '@ant-design/icons'
import styles from './styles.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import {
  setIsDetailsModalVisible,
  setIsModalVisible,
  setSelectedPost
} from '../../../features/admin/post/postAdminSlice'
import PostTable from './components/PostTable'
import PostDetailModal from './components/PostDetailModal'

const Post = () => {
  const dispatch = useDispatch()

  const [searchText, setSearchText] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  const { isModalVisible, isDetailsModalVisible, selectedPost } = useSelector(state => state.postManagement)

  const handleSearch = value => {
    setSearchText(value)
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

  return (
    <div className={styles.userManagement}>
      <h2 className={styles.titleMain} style={{ marginBottom: '20px' }}>
        Quản lý sản phẩm
      </h2>
      <Row gutter={[16, 16]} align="middle" justify="space-between" style={{ marginBottom: '40px' }}>
        <Col xs={24} sm={6}>
          <Input
            placeholder="Tìm kiếm người dùng"
            prefix={<SearchOutlined />}
            onChange={e => handleSearch(e.target.value)}
            value={searchText}
            style={{ width: '100%' }}
          />
        </Col>
      </Row>

      <PostTable onEdit={handleEditPost} onViewDetails={handleViewDetails} />

      <PostDetailModal
        visible={isDetailsModalVisible}
        post={selectedPost}
        onClose={() => dispatch(setIsDetailsModalVisible(false))}
      />
    </div>
  )
}

export default Post
