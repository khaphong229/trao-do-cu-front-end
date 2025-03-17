import React, { useEffect, useState } from 'react'
import { Table, Button, Space, Modal, message, Input } from 'antd'
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PhoneOutlined,
  SearchOutlined,
  MailOutlined
} from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import styles from './styles.module.scss'
import avt from '../../../../../assets/images/logo/avtDefault.webp'
import { deleteUser, getUserPagination } from 'features/admin/user/userThunks'
import { setPage, setPerPage } from 'features/admin/user/userSlice'

const UserTable = ({ onEdit, onViewDetails }) => {
  const dispatch = useDispatch()
  const { users, total, page, perPage, isLoading, searchText } = useSelector(state => state.userManagement)

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: page,
      pageSize: perPage,
      total: total
    }
  })
  const filteredUsers = users.filter(user => user.name.toLowerCase().includes(searchText.toLowerCase()))

  // Load users when component mounts
  useEffect(() => {
    dispatch(getUserPagination({ page, per_page: perPage }))
  }, [dispatch, page, perPage])

  // Update table params when redux state changes
  useEffect(() => {
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        current: page,
        pageSize: perPage,
        total: total
      }
    })
  }, [page, perPage, total])

  const handleTableChange = (pagination, filters, sorter) => {
    dispatch(setPage(pagination.current))
    dispatch(setPerPage(pagination.pageSize))

    setTableParams({
      pagination,
      filters,
      sorter: {
        field: sorter.field,
        order: sorter.order
      }
    })
  }

  const handleDelete = userId => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa người dùng này?',
      content: 'Hành động này không thể hoàn tác.',
      onOk() {
        dispatch(deleteUser(userId))
          .unwrap()
          .then(() => {
            message.success('Xóa người dùng thành công')
            // Reload the current page
            dispatch(getUserPagination({ page, per_page: perPage }))
          })
          .catch(error => {
            message.error(error.message || 'Có lỗi xảy ra khi xóa người dùng')
          })
      }
    })
  }

  const columns = [
    {
      title: 'Ảnh bài đăng',
      dataIndex: 'avatar',
      key: 'avatar',
      render: avatar => (
        <img src={avatar || avt} alt="avatar-user" width={50} height={50} style={{ objectFit: 'cover' }} />
      )
    },
    {
      title: 'Tên bài đăng',
      dataIndex: 'name',
      key: 'name',
      sorter: {
        compare: (a, b) => a.name.localeCompare(b.name)
      },
      render: (name, record) => (
        <div className={styles.nameRow} onClick={() => onViewDetails(record)} style={{ cursor: 'pointer' }}>
          {name}
        </div>
      ),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Tìm tên bài đăng"
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={confirm}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button type="primary" onClick={confirm} icon={<SearchOutlined />} size="small" style={{ width: 90 }}>
              Tìm
            </Button>
            <Button onClick={clearFilters} size="small" style={{ width: 90 }}>
              Đặt lại
            </Button>
          </Space>
        </div>
      ),
      onFilter: (value, record) => record.name.toString().toLowerCase().includes(value.toLowerCase()),
      filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      sorter: {
        compare: (a, b) => {
          // Check if address is a string or an object
          const addressA = typeof a.address === 'string' ? a.address : JSON.stringify(a.address)
          const addressB = typeof b.address === 'string' ? b.address : JSON.stringify(b.address)
          return addressA.localeCompare(addressB)
        }
      },
      render: address => {
        // Handle the case where address is an object
        if (typeof address === 'object' && address !== null) {
          // You can format the address object however you want
          // For example, if it has a property like 'text'
          return (
            <div className="truncate">
              {address.isDefault ? '(Mặc định) ' : ''}
              {address.address || 'Không có địa chỉ'}
            </div>
          )
        }
        // If address is a string, render it as is
        return <div className="truncate">{address || 'Không có địa chỉ'}</div>
      },
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Tìm địa chỉ"
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={confirm}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button type="primary" onClick={confirm} icon={<SearchOutlined />} size="small" style={{ width: 90 }}>
              Tìm
            </Button>
            <Button onClick={clearFilters} size="small" style={{ width: 90 }}>
              Đặt lại
            </Button>
          </Space>
        </div>
      ),
      onFilter: (value, record) => record.address.toString().toLowerCase().includes(value.toLowerCase()),
      filterIcon: filtered => <MailOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      sorter: true,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Tìm số điện thoại"
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={confirm}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button type="primary" onClick={confirm} icon={<SearchOutlined />} size="small" style={{ width: 90 }}>
              Tìm
            </Button>
            <Button onClick={clearFilters} size="small" style={{ width: 90 }}>
              Đặt lại
            </Button>
          </Space>
        </div>
      ),
      onFilter: (value, record) => record.phone.toString().toLowerCase().includes(value.toLowerCase()),
      filterIcon: filtered => <PhoneOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EyeOutlined />} onClick={() => onViewDetails(record)} size="small" />
          <Button icon={<EditOutlined />} onClick={() => onEdit(record)} size="small" />
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record._id)} danger size="small" />
        </Space>
      )
    }
  ]

  return (
    <Table
      className={styles.responsiveTable}
      columns={columns}
      dataSource={filteredUsers} // Sử dụng dữ liệu đã lọc
      rowKey="_id"
      loading={isLoading}
      pagination={{
        current: tableParams.pagination.current,
        pageSize: tableParams.pagination.pageSize,
        total: tableParams.pagination.total,
        showSizeChanger: true,
        pageSizeOptions: [5, 10, 20, 50, 100],
        showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} người dùng`
      }}
      onChange={handleTableChange}
      scroll={{ x: 'max-content' }}
    />
  )
}

export default UserTable
