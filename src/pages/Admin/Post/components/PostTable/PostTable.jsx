import { Button, Input, message, Space, Table, Select } from 'antd'
import { setPage, setPerPage } from 'features/admin/post/postAdminSlice'
import { getPostPagination } from 'features/client/post/postThunks'
import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { EyeOutlined, SearchOutlined, EnvironmentOutlined, ReloadOutlined } from '@ant-design/icons'
import avt from '../../../../../assets/images/logo/avtDefault.webp'
import styles from '../../styles.module.scss'
import { approvalStatus, getPostAdminPagination } from 'features/admin/post/postAdminThunks'
import moment from 'moment'
import { URL_SERVER_IMAGE } from 'config/url_server'

// Thêm CSS để đảm bảo bảng có thể cuộn trên mobile
import '../../styles.module.scss'

const PostTable = ({ onViewDetails }) => {
  const dispatch = useDispatch()
  const { posts, total, current, pageSize, isLoading, searchText } = useSelector(state => state.postManagement || {})
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const tableRef = useRef(null)
  const containerRef = useRef(null)

  // Theo dõi kích thước màn hình
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const isMobile = windowWidth < 768

  const handleApprovalChange = (value, record) => {
    const isApproved = value === 'approved'
    const reason = isApproved ? 'Bài viết đúng yêu cầu chính sách' : 'Bài viết không đạt yêu cầu'

    dispatch(approvalStatus({ id: record._id, isApproved, reason }))
      .unwrap()
      .then(() => {
        message.success(isApproved ? 'Bài đăng đã được duyệt' : 'Bài đăng đã bị từ chối')
        dispatch(getPostAdminPagination({ current, pageSize })) // Fetch lại danh sách bài đăng
      })
      .catch(() => {
        message.error('Có lỗi xảy ra khi cập nhật trạng thái bài đăng')
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
    dispatch(getPostAdminPagination({ current, pageSize }))
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
    // Cập nhật tableParams trước
    setTableParams({
      pagination,
      filters,
      sorter: {
        field: sorter.field,
        order: sorter.order
      }
    })

    // Sau đó dispatch các action
    dispatch(setPage(pagination.current))
    dispatch(setPerPage(pagination.pageSize))
    dispatch(getPostAdminPagination({ current: pagination.current, pageSize: pagination.pageSize }))
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

  // Định nghĩa cột
  const columns = [
    {
      title: 'Ảnh bài đăng',
      dataIndex: 'image_url',
      key: 'image_url',
      fixed: !isMobile ? 'left' : undefined, // Chỉ fixed trên desktop và dùng undefined thay vì false
      width: isMobile ? 70 : 100,
      render: (imageUrl, record) => {
        const imageSource = getImageUrl(record.image_url)
        return (
          <img
            src={imageSource}
            alt="Bài đăng"
            width={isMobile ? 40 : 50}
            height={isMobile ? 40 : 50}
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
      fixed: !isMobile ? 'left' : undefined, // Chỉ fixed trên desktop và dùng undefined thay vì false
      width: isMobile ? 130 : 250,
      sorter: {
        compare: (a, b) => a.title.localeCompare(b.title)
      },
      render: (title, record) => (
        <div
          className={styles.nameRow}
          onClick={() => onViewDetails(record)}
          style={{
            cursor: 'pointer',
            whiteSpace: 'normal', // Cho phép xuống dòng trên mobile
            wordBreak: 'break-word',
            maxHeight: isMobile ? '60px' : 'none',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: isMobile ? 3 : 'none',
            WebkitBoxOrient: 'vertical'
          }}
        >
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
      width: isMobile ? 140 : 200,
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
      width: isMobile ? 140 : 160,
      render: created_at => {
        return moment(created_at).format('DD/MM/YYYY HH:mm')
      }
    },
    {
      title: 'Thể loại',
      dataIndex: 'category_id',
      key: 'category_id',
      width: isMobile ? 120 : 150,
      render: category_id => {
        return category_id?.name || 'Không có thể loại'
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isApproved',
      key: 'isApproved',
      width: isMobile ? 120 : 150,
      render: (isApproved, record) => {
        const approvedStatus = isApproved || false // Đảm bảo isApproved không bị null hoặc undefined

        return (
          <Select
            value={approvedStatus ? 'approved' : 'pending'}
            style={{ width: isMobile ? 110 : 120 }}
            onChange={value => handleApprovalChange(value, record)}
            options={[
              {
                value: 'approved',
                label: 'Đã duyệt',
                style: { color: '#52c41a', fontWeight: 'bold' }
              },
              {
                value: 'pending',
                label: 'Chưa duyệt',
                style: { color: '#fa8c16', fontWeight: 'bold' }
              }
            ]}
          />
        )
      }
    },
    {
      title: 'Thao tác',
      key: 'actions',
      fixed: isMobile ? undefined : 'right', // Chỉ fixed trên desktop và dùng undefined thay vì false
      width: isMobile ? 70 : 100,
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EyeOutlined />}
            onClick={() => onViewDetails(record)}
            size="small"
            title="Xem chi tiết"
            type="primary"
          />
        </Space>
      )
    }
  ]

  // Tính toán chiều rộng cố định cho bảng để đảm bảo thanh cuộn ngang xuất hiện
  const getTableWidth = () => {
    const calculatedWidth = columns.reduce((acc, col) => acc + (col.width || 0), 0)
    // Đảm bảo chiều rộng tổng luôn lớn hơn container để kích hoạt scroll
    const containerWidth = containerRef.current?.clientWidth || window.innerWidth
    return Math.max(calculatedWidth, containerWidth + 200) // Thêm một khoảng để chắc chắn có scroll
  }

  useEffect(() => {
    // Buộc re-render khi thay đổi kích thước màn hình để cập nhật totalWidth
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // CSS để đảm bảo fixed column hoạt động
  const tableStyle = {
    '.ant-table-container': {
      overflow: 'auto' // Đảm bảo overflow được đặt đúng
    },
    '.ant-table-body': {
      overflow: 'auto !important' // Ghi đè overflow nếu cần
    }
  }

  return (
    <div className="responsive-table-container" ref={containerRef} style={{ overflow: 'hidden', position: 'relative' }}>
      {/* Thêm style inline để đảm bảo CSS không bị ghi đè */}
      <div style={{ overflow: 'auto', width: '100%' }}>
        <Table
          ref={tableRef}
          columns={columns}
          dataSource={filteredPosts}
          rowKey="_id"
          loading={isLoading}
          pagination={{
            current: tableParams.pagination.current,
            pageSize: tableParams.pagination.pageSize,
            total: tableParams.pagination.total,
            showSizeChanger: true,
            pageSizeOptions: [5, 10, 20, 50, 100],
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} bài viết`,
            position: ['bottomCenter']
          }}
          onChange={handleTableChange}
          scroll={{
            x: getTableWidth(),
            scrollToFirstRowOnChange: true
          }}
          className={isMobile ? 'mobile-table' : ''}
          sticky={false} // Tắt sticky để tránh xung đột với fixed columns
          style={{ width: getTableWidth() }}
        />
      </div>
    </div>
  )
}

export default PostTable
