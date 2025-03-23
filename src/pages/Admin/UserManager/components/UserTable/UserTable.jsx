import React, { useEffect, useState } from 'react'
import { Table, Button, Space, Modal, message, Input } from 'antd'
import {
  EyeOutlined,
  PhoneOutlined,
  SearchOutlined,
  MailOutlined,
  WalletOutlined,
  LockOutlined
} from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import styles from './styles.module.scss'
import avt from '../../../../../assets/images/logo/avtDefault.webp'
import { deleteUser, getUserPagination } from 'features/admin/user/userThunks'
import { setPage, setPerPage } from 'features/admin/user/userSlice'
import { URL_SERVER_IMAGE } from 'config/url_server'

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
      title: 'Ảnh người dùng',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (avatar, record) => {
        const avatarUrl = avatar ? `${URL_SERVER_IMAGE}${avatar}` : avt
        return <img src={avatarUrl} alt="avatar-user" width={50} height={50} style={{ objectFit: 'cover' }} />
      }
    },
    {
      title: 'Tên người dùng',
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
          // Check if address is an array
          const addressA =
            Array.isArray(a.address) && a.address.length > 0
              ? a.address.find(addr => addr.isDefault) || a.address[0]
              : a.address

          const addressB =
            Array.isArray(b.address) && b.address.length > 0
              ? b.address.find(addr => addr.isDefault) || b.address[0]
              : b.address

          // Get the address string for comparison
          const addressAStr = typeof addressA === 'object' ? addressA.address : String(addressA || '')
          const addressBStr = typeof addressB === 'object' ? addressB.address : String(addressB || '')

          return addressAStr.localeCompare(addressBStr)
        }
      },
      render: address => {
        // Handle the case where address is an array of address objects
        if (Array.isArray(address) && address.length > 0) {
          // Try to find the default address first
          const defaultAddress = address.find(addr => addr.isDefault)
          const addressToShow = defaultAddress || address[0]

          return <div className="truncate">{addressToShow.address || 'Không có địa chỉ'}</div>
        }
        // Handle the case where address is a single object
        else if (typeof address === 'object' && address !== null && address.address) {
          return <div className="truncate">{address.address || 'Không có địa chỉ'}</div>
        }
        // If address is a string or null/undefined, render it as is
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
      onFilter: (value, record) => {
        if (Array.isArray(record.address) && record.address.length > 0) {
          // Search through all addresses in the array
          return record.address.some(addr => addr.address && addr.address.toLowerCase().includes(value.toLowerCase()))
        } else if (typeof record.address === 'object' && record.address !== null) {
          return record.address.address && record.address.address.toLowerCase().includes(value.toLowerCase())
        }
        return String(record.address || '')
          .toLowerCase()
          .includes(value.toLowerCase())
      },
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
      title: 'Sinh viên PTIT',
      dataIndex: 'isPtiter',
      key: 'isPtiter',
      render: isPtiter => (
        <div
          style={{
            padding: '4px 8px',
            borderRadius: '4px',
            backgroundColor: isPtiter ? '#e6f7ff' : '#fff1f0',
            color: isPtiter ? '#1890ff' : '#ff4d4f',
            border: `1px solid ${isPtiter ? '#91d5ff' : '#ffa39e'}`,
            textAlign: 'center',
            fontWeight: 500
          }}
        >
          {isPtiter ? 'Có' : 'Không'}
        </div>
      ),
      filters: [
        { text: 'Có', value: true },
        { text: 'Không', value: false }
      ],
      onFilter: (value, record) => record.isPtiter === value,
      filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    },
    {
      title: 'Số dư PCoin',
      dataIndex: 'pcoin_balance',
      key: 'pcoin_balance',
      render: pcoin_balance => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <WalletOutlined style={{ color: '#1890ff' }} />
            <span>Tổng: {pcoin_balance?.total || 0}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
            <LockOutlined style={{ color: '#ff4d4f' }} />
            <span>Đã khóa: {pcoin_balance?.locked || 0}</span>
          </div>
        </div>
      ),
      sorter: {
        compare: (a, b) => (a.pcoin_balance?.total || 0) - (b.pcoin_balance?.total || 0)
      }
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EyeOutlined />} onClick={() => onViewDetails(record)} size="small" />
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
