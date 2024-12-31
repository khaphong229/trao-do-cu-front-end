import React, { useState } from 'react'
import { Row, Col, Input, Button } from 'antd'
import { SearchOutlined, PlusOutlined } from '@ant-design/icons'
import UserTable from './components/UserTable'
import UserDetailModal from './components/UserDetailModal'
import UserFormModal from './components/UserFormModal'
import styles from './styles.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { setIsDetailsModalVisible, setIsModalVisible, setSelectedUser } from '../../../features/admin/user/userSlice'

const User = () => {
  const dispatch = useDispatch()

  const [searchText, setSearchText] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  // const [selectedUser, setSelectedUser] = useState(null)

  const { isModalVisible, isDetailsModalVisible, selectedUser } = useSelector(state => state.userManagement)

  const handleSearch = value => {
    setSearchText(value)
  }

  const handleAddUser = () => {
    setSelectedUser(null)
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
        Quản lý bài đăng
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
            Thêm bài đăng
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
        onClose={() => dispatch(setIsModalVisible(false))}
      />
    </div>
  )
}

export default User
