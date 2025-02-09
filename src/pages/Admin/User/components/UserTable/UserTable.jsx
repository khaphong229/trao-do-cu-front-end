import React, { useEffect, useState } from 'react'
import { Table, Button, Space, Modal, message, Input } from 'antd'
import {
  EditOutlined,
  DeleteOutlined,
  LockOutlined,
  UnlockOutlined,
  LoadingOutlined,
  EyeOutlined,
  PhoneOutlined,
  SearchOutlined,
  MailOutlined
} from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { getUserPagination, toggleUserStatus, deleteUser } from '../../../../../features/admin/user/userThunks'
import styles from './styles.module.scss'
import avt from '../../../../../assets/images/logo/avtDefault.webp'

const UserTable = ({ onEdit, onViewDetails }) => {
  const dispatch = useDispatch()
  const { users, total, isLoading } = useSelector(state => state.userManagement)

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10
    },
    filters: {},
    sorter: {}
  })

  useEffect(() => {
    dispatch(
      getUserPagination({
        page: tableParams.pagination.current,
        per_page: tableParams.pagination.pageSize,
        ...tableParams.filters,
        ...tableParams.sorter
      })
    )
  }, [dispatch, tableParams])

  const handleTableChange = (pagination, filters, sorter) => {
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
          .then(() => message.success('Xóa người dùng thành công'))
          .catch(() => message.error('Xóa người dùng thất bại'))
      }
    })
  }

  const handleToggleStatus = userId => {
    dispatch(toggleUserStatus(userId))
      .then(() => message.success('Cập nhật trạng thái người dùng thành công'))
      .catch(() => message.error('Cập nhật trạng thái thất bại'))
  }

  const columns = [
    {
      title: 'Ảnh đại diện',
      dataIndex: 'avatar',
      key: 'avatar',
      render: avatar => (
        <img src={avatar || avt} alt="avatar-user" width={50} height={50} style={{ objectFit: 'cover' }} />
      )
    },
    {
      title: 'Tên tài khoản',
      dataIndex: 'name',
      key: 'name',
      sorter: {
        compare: (a, b) => a.name - b.name
      },
      // responsive: ['xs'],
      render: (name, record) => (
        <div className={styles.nameRow} onClick={() => onViewDetails(record)} style={{ cursor: 'pointer' }}>
          {name}
        </div>
      ),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Tìm tên tài khoản"
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
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: {
        compare: (a, b) => a.email - b.email
      },
      // responsive: ['md'],
      render: email => <div className="truncate">{email}</div>,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Tìm email"
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
      onFilter: (value, record) => record.email.toString().toLowerCase().includes(value.toLowerCase()),
      filterIcon: filtered => <MailOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      sorter: true,
      // responsive: ['lg'],
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
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Hoạt động', value: 'active' },
        { text: 'Ngừng hoạt động', value: 'inactive' }
      ],
      onFilter: (value, record) => record.status === value,
      render: status => (
        <span className={status === 'active' ? styles.statusActive : styles.statusInactive}>
          {status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động'}
        </span>
      )
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      filters: [
        { text: 'Nam', value: 'male' },
        { text: 'Nữ', value: 'female' },
        { text: 'Khác', value: 'other' }
      ],
      onFilter: (value, record) => record.gender === value,
      render: gender => {
        const genderMap = {
          male: 'Nam',
          female: 'Nữ',
          other: 'Khác'
        }
        return genderMap[gender] || gender
      }
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EyeOutlined />} onClick={() => onViewDetails(record)} size="small" />
          <Button icon={<EditOutlined />} onClick={() => onEdit(record)} size="small" />
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record._id)} danger size="small" />
          <Button
            icon={record.status === 'active' ? <LockOutlined /> : <UnlockOutlined />}
            onClick={() => handleToggleStatus(record._id)}
            size="small"
          />
        </Space>
      )
    }
  ]

  return (
    <Table
      className={styles.responsiveTable}
      columns={columns}
      dataSource={users}
      rowKey="_id"
      loading={{ indicator: <LoadingOutlined />, spinning: isLoading }}
      pagination={{
        total,
        current: tableParams.pagination.current,
        pageSize: tableParams.pagination.pageSize,
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
