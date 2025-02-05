import React, { useState } from 'react'
import { Table, Button, Space, Modal, message, Input } from 'antd'
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PhoneOutlined,
  SearchOutlined,
  MailOutlined
} from '@ant-design/icons'
import styles from './styles.module.scss'
import avt from '../../../../../assets/images/logo/avtDefault.webp'
const initialUsers = [
  {
    _id: '1',
    avatar: null,
    name: '🌹Nhà sổ riêng 2,55 tỷ Gần cầu Phú Xuân Q7',
    address: 'Ha Noi',
    phone: '0123456789',
    status: 'active',
    typePost: 'gift'
  },
  {
    _id: '2',
    avatar: null,
    name: 'Bộ quần áo đá bóng, đồ đá banh nam nữ Man City, thun lạnh cao cấp',
    address: 'Ninh bình',
    phone: '0987654321',
    status: 'inactive',
    typePost: 'exchange'
  },
  {
    _id: '3',
    avatar: null,
    name: 'Bộ quần áo đá bóng, đồ đá banh nam nữ Man City, thun lạnh cao cấp',
    address: 'Ninh bình',
    phone: '0987654321',
    status: 'inactive',
    typePost: 'exchange'
  },
  {
    _id: '4',
    avatar: null,
    name: 'Bộ quần áo đá bóng, đồ đá banh nam nữ Man City, thun lạnh cao cấp',
    address: 'Ninh bình',
    phone: '0987654321',
    status: 'inactive',
    typePost: 'exchange'
  },
  {
    _id: '5',
    avatar: null,
    name: 'Bộ quần áo đá bóng, đồ đá banh nam nữ Man City, thun lạnh cao cấp',
    address: 'Ninh bình',
    phone: '0987654321',
    status: 'inactive',
    typePost: 'exchange'
  },
  {
    _id: '6',
    avatar: null,
    name: 'Bộ quần áo đá bóng, đồ đá banh nam nữ Man City, thun lạnh cao cấp',
    address: 'Ninh bình',
    phone: '0987654321',
    status: 'inactive',
    typePost: 'exchange'
  },
  {
    _id: '7',
    avatar: null,
    name: 'Bộ quần áo đá bóng, đồ đá banh nam nữ Man City, thun lạnh cao cấp',
    address: 'Ninh bình',
    phone: '0987654321',
    status: 'inactive',
    typePost: 'exchange'
  }
]

const UserTable = ({ onEdit, onViewDetails }) => {
  const [setData] = useState(initialUsers)
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10
    }
  })

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
        setData(prevData => prevData.filter(user => user._id !== userId))
        message.success('Xóa người dùng thành công')
      }
    })
  }

  // const handleAdd = () => {
  //   const newUser = {
  //     _id: Date.now().toString(),
  //     avatar: null,
  //     name: 'Người dùng mới',
  //     email: 'newuser@example.com',
  //     phone: '0000000000',
  //     status: 'active',
  //     gender: 'other'
  //   }
  //   setData(prevData => [...prevData, newUser])
  //   message.success('Thêm người dùng thành công')
  // }

  // const handleEdit = user => {
  //   const newName = prompt('Nhập tên mới:', user.name)
  //   if (newName) {
  //     setData(prevData => prevData.map(item => (item._id === user._id ? { ...item, name: newName } : item)))
  //     message.success('Sửa thông tin bài đăng thành công')
  //   }
  // }
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
        compare: (a, b) => a.address - b.address
      },
      // responsive: ['md'],
      render: address => <div className="truncate">{address}</div>,
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
      title: 'loại bài đăng',
      dataIndex: 'typePost',
      key: 'typePost',
      filters: [
        { text: 'Cho', value: 'gift' },
        { text: 'Tặng', value: 'exchange' },
        { text: 'Khác', value: 'other' }
      ],
      onFilter: (value, record) => record.typePost === value,
      render: typePost => {
        const genderMap = {
          male: 'Cho',
          female: 'Tặng',
          other: 'Khác'
        }
        return genderMap[typePost] || typePost
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
        </Space>
      )
    }
  ]

  return (
    <Table
      className={styles.responsiveTable}
      columns={columns}
      dataSource={initialUsers}
      rowKey="_id"
      pagination={{
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
