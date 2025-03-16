import React, { useState, useEffect } from 'react'
import { Row, Col, Input, Button } from 'antd'
import { SearchOutlined, PlusOutlined } from '@ant-design/icons'
import UserTable from './components/UserTable'
import UserDetailModal from './components/UserDetailModal'
import UserFormModal from './components/UserFormModal'
import styles from './styles.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { setIsDetailsModalVisible, setIsModalVisible, setSelectedUser } from '../../../features/admin/user/userSlice'
import { getUserPagination } from '../../../features/admin/user/userThunks'

const User = () => {
  const dispatch = useDispatch()

  const [searchText, setSearchText] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  const { isModalVisible, isDetailsModalVisible, selectedUser, page, perPage } = useSelector(
    state => state.userManagement
  )

  // Load users when component mounts
  useEffect(() => {
    dispatch(getUserPagination({ page, per_page: perPage }))
  }, [dispatch, page, perPage])

  const handleSearch = value => {
    setSearchText(value)
    dispatch(
      getUserPagination({
        page: 1,
        per_page: perPage,
        q: value
      })
    )
  }

  const handleAddUser = () => {
    dispatch(setSelectedUser(null)) // Fixed: using dispatch instead of direct state setter
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
            placeholder="Tìm kiếm người dùng"
            prefix={<SearchOutlined />}
            onChange={e => handleSearch(e.target.value)}
            value={searchText}
            style={{ width: '100%' }}
          />
        </Col>
        <Col xs={24} sm={4} style={{ textAlign: 'right' }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddUser} block>
            Thêm người dùng
          </Button>
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
        onClose={() => {
          dispatch(setIsModalVisible(false))
          // Refresh user list after adding/editing
          dispatch(getUserPagination({ page, per_page: perPage, q: searchText }))
        }}
      />
    </div>
  )
}

export default User
