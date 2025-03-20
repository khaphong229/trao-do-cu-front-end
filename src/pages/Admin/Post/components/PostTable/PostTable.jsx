import { Button, Input, message, Space, Table } from 'antd'
import { setPage, setPerPage } from 'features/admin/post/postAdminSlice'
import { getPostPagination } from 'features/client/post/postThunks'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { EyeOutlined, SearchOutlined, EnvironmentOutlined, ReloadOutlined } from '@ant-design/icons'
import avt from '../../../../../assets/images/logo/avtDefault.webp'
import styles from '../../styles.module.scss'
import { approvalStatus, getPostAdminPagination } from 'features/admin/post/postAdminThunks'
import moment from 'moment'
import { URL_SERVER_IMAGE } from 'config/url_server'

const PostTable = ({ onViewDetails }) => {
  const dispatch = useDispatch()
  const { posts, total, current, pageSize, isLoading, searchText } = useSelector(state => state.postManagement || {})

  const handleApprovePost = postId => {
    console.log('Post ID:', postId)
    const isApproved = true
    const reason = 'Bài viết đúng yêu cầu chính sách'

    dispatch(approvalStatus({ id: postId, isApproved, reason }))
      .unwrap()
      .then(() => {
        message.success('Bài đăng đã được duyệt')
        dispatch(getPostAdminPagination({ current, pageSize })) // Fetch lại danh sách bài đăng
      })
      .catch(() => {
        message.error('Có lỗi xảy ra khi duyệt bài đăng')
      })
  }
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: current,
      pageSize: pageSize,
      total: total
    }
  })

  const filteredPosts = searchText
    ? posts.filter(post => post.title && post.title.toLowerCase().includes(searchText.toLowerCase()))
    : posts

  // Load posts when component mounts
  useEffect(() => {
    dispatch(getPostPagination({ current, pageSize: pageSize }))
  }, [dispatch, current, pageSize])

  // Update table params when redux state changes
  useEffect(() => {
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        current: current,
        pageSize: pageSize,
        total: total
      }
    })
  }, [current, pageSize, total])

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

  // Hàm xử lý hiển thị ảnh
  const getImageUrl = imageUrlArr => {
    if (!imageUrlArr || imageUrlArr.length === 0) {
      return avt
    }

    // Lấy URL đầu tiên từ mảng image_url
    const imageUrl = imageUrlArr[0]

    // Kiểm tra nếu URL đã bắt đầu bằng http hoặc https
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl
    }

    // Sử dụng URL_SERVER_IMAGE để xây dựng đường dẫn đầy đủ
    return `${URL_SERVER_IMAGE}${imageUrl}`
  }

  const columns = [
    {
      title: 'Ảnh bài đăng',
      dataIndex: 'image_url',
      key: 'image_url',
      fixed: 'left', // Fix this column to the left
      width: 100, // Give it a fixed width
      render: (imageUrl, record) => {
        const imageSource = getImageUrl(record.image_url)
        return (
          <img
            src={imageSource}
            alt="Bài đăng"
            width={50}
            height={50}
            style={{ objectFit: 'cover' }}
            onError={e => {
              e.target.src = avt
            }}
          />
        )
      }
    },
    {
      title: 'Tên bài đăng',
      dataIndex: 'title',
      key: 'title',
      fixed: 'left', // Fix this column to the left
      width: 250, // Give it a fixed width
      sorter: {
        compare: (a, b) => a.title.localeCompare(b.title)
      },
      render: (title, record) => (
        <div className={styles.nameRow} onClick={() => onViewDetails(record)} style={{ cursor: 'pointer' }}>
          {title}
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
      onFilter: (value, record) => record.title && record.title.toString().toLowerCase().includes(value.toLowerCase()),
      filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'specificLocation',
      key: 'specificLocation',
      sorter: {
        compare: (a, b) => {
          const locationA = a.specificLocation || ''
          const locationB = b.specificLocation || ''
          return locationA.localeCompare(locationB)
        }
      },
      render: specificLocation => <div className="truncate">{specificLocation || 'Không có địa chỉ'}</div>,
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
      onFilter: (value, record) =>
        record.specificLocation && record.specificLocation.toString().toLowerCase().includes(value.toLowerCase()),
      filterIcon: filtered => <EnvironmentOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    },
    {
      title: 'Ngày đăng',
      dataIndex: 'created_at',
      key: 'created_at',
      render: created_at => {
        return moment(created_at).format('DD/MM/YYYY HH:mm')
      }
    },
    {
      title: 'Thể loại',
      dataIndex: 'category_id',
      key: 'category_id',
      render: category_id => {
        return category_id?.name || 'Không có thể loại'
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isApproved',
      key: 'isApproved',
      render: (isApproved, record) => {
        const approvedStatus = isApproved || false // Đảm bảo isApproved không bị null hoặc undefined
        return (
          <Space size="middle">
            {approvedStatus ? (
              <span style={{ color: 'green' }}>Đã duyệt</span>
            ) : (
              <span style={{ color: 'orange' }}>Chưa duyệt</span>
            )}
            <Button type="primary" size="small" onClick={() => handleApprovePost(record._id)} disabled={approvedStatus}>
              Duyệt
            </Button>
          </Space>
        )
      }
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EyeOutlined />} onClick={() => onViewDetails(record)} size="small" title="Xem chi tiết" />
        </Space>
      )
    }
  ]

  return (
    <Table
      columns={columns}
      dataSource={filteredPosts}
      rowKey="_id"
      loading={isLoading}
      pagination={{
        current: current,
        pageSize: pageSize,
        total: total,
        showSizeChanger: true,
        pageSizeOptions: [5, 10, 20, 50, 100],
        showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} bài viết`
      }}
      onChange={handleTableChange}
      scroll={{ x: 'max-content' }}
    />
  )
}

export default PostTable
