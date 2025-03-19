import React, { useState, useEffect } from 'react'
import { Row, Col, Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import UserTable from './components/UserTable'
import UserDetailModal from './components/UserDetailModal'
import UserFormModal from './components/UserFormModal'
import styles from './styles.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import {
  setIsDetailsModalVisible,
  setIsModalVisible,
  setSelectedUser,
  setPage,
  setSearchText // Nhập action mới
} from '../../../features/admin/user/userSlice'
import { getUserPagination } from '../../../features/admin/user/userThunks'

const UserManager = () => {
  const dispatch = useDispatch()

  const { isModalVisible, isDetailsModalVisible, selectedUser, searchText } = useSelector(state => state.userManagement)

  const [isEditing, setIsEditing] = useState(false)

  // Reset to page 1 when search text changes
  useEffect(() => {
    dispatch(setPage(1))
    dispatch(getUserPagination({ page: 1, per_page: 10, searchText }))
  }, [dispatch, searchText])

  const handleSearch = value => {
    dispatch(setSearchText(value)) // Cập nhật trạng thái tìm kiếm
  }

  const handleAddUser = () => {
    dispatch(setSelectedUser(null))
    setIsEditing(false)
    dispatch(setIsModalVisible(true))
  }

  const handleEditUser = user => {
    dispatch(setSelectedUser(user))
    setIsEditing(true)
    dispatch(setIsModalVisible(true))
  }

  const handleViewDetails = user => {
    dispatch(setSelectedUser(user))
    dispatch(setIsDetailsModalVisible(true))
  }

  return (
    <div className={styles.userManagement}>
      <h2 className={styles.titleMain} style={{ marginBottom: '20px' }}>
        Quản lý người dùng
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
      </Row>

      <UserTable onEdit={handleEditUser} onViewDetails={handleViewDetails} />

      <UserDetailModal
        visible={isDetailsModalVisible}
        user={selectedUser}
        onClose={() => dispatch(setIsDetailsModalVisible(false))}
      />

      <UserFormModal
        visible={isModalVisible}
        isEditing={isEditing}
        initialUser={selectedUser}
        onClose={() => dispatch(setIsModalVisible(false))}
      />
    </div>
  )
}

export default UserManager
