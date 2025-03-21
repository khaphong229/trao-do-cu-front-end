import { Button, Input, message, Space, Table, Select } from 'antd'
import { setPage, setPerPage } from 'features/admin/post/postAdminSlice'
import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { EyeOutlined, SearchOutlined, EnvironmentOutlined } from '@ant-design/icons'
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
      width: isMobile ? 130 : 190,
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
      title: 'Sản Phẩm góc PTIT',
      dataIndex: 'isPtiterOnly',
      key: 'isPtiterOnly',
      width: isMobile ? 120 : 150,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8, width: 200 }}>
          <div style={{ marginBottom: 8 }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 0',
                cursor: 'pointer'
              }}
            >
              <input
                type="checkbox"
                checked={selectedKeys.includes(true)}
                onChange={e => {
                  const newKeys = [...selectedKeys]
                  if (e.target.checked) {
                    if (!newKeys.includes(true)) newKeys.push(true)
                  } else {
                    const index = newKeys.indexOf(true)
                    if (index > -1) newKeys.splice(index, 1)
                  }
                  setSelectedKeys(newKeys)
                }}
                style={{ marginRight: 8 }}
              />
              <span
                style={{
                  backgroundColor: '#1890ff',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontWeight: 'bold'
                }}
              >
                True
              </span>
            </label>

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 0',
                cursor: 'pointer'
              }}
            >
              <input
                type="checkbox"
                checked={selectedKeys.includes(false)}
                onChange={e => {
                  const newKeys = [...selectedKeys]
                  if (e.target.checked) {
                    if (!newKeys.includes(false)) newKeys.push(false)
                  } else {
                    const index = newKeys.indexOf(false)
                    if (index > -1) newKeys.splice(index, 1)
                  }
                  setSelectedKeys(newKeys)
                }}
                style={{ marginRight: 8 }}
              />
              <span
                style={{
                  backgroundColor: '#ff4d4f',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontWeight: 'bold'
                }}
              >
                False
              </span>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button type="primary" onClick={() => confirm()} size="small" style={{ width: 90 }}>
              Lọc
            </Button>
            <Button
              onClick={() => {
                clearFilters()
                confirm()
              }}
              size="small"
              style={{ width: 90 }}
            >
              Đặt lại
            </Button>
          </div>
        </div>
      ),
      filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
      onFilter: (value, record) => record.isPtiterOnly === value,
      render: isPtiterOnly => {
        return (
          <span
            style={{
              backgroundColor: isPtiterOnly ? '#1890ff' : '#ff4d4f',
              color: 'white',
              padding: '2px 8px',
              borderRadius: '4px',
              fontWeight: 'bold'
            }}
          >
            {isPtiterOnly ? 'true' : 'false'}
          </span>
        )
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isApproved',
      key: 'isApproved',
      width: isMobile ? 120 : 150,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8, width: 200 }}>
          <div style={{ marginBottom: 8 }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 0',
                cursor: 'pointer'
              }}
            >
              <input
                type="checkbox"
                checked={selectedKeys.includes(true)}
                onChange={e => {
                  const newKeys = [...selectedKeys]
                  if (e.target.checked) {
                    if (!newKeys.includes(true)) newKeys.push(true)
                  } else {
                    const index = newKeys.indexOf(true)
                    if (index > -1) newKeys.splice(index, 1)
                  }
                  setSelectedKeys(newKeys)
                }}
                style={{ marginRight: 8 }}
              />
              <span
                style={{
                  backgroundColor: '#52c41a',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontWeight: 'bold'
                }}
              >
                Đã duyệt
              </span>
            </label>

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 0',
                cursor: 'pointer'
              }}
            >
              <input
                type="checkbox"
                checked={selectedKeys.includes(false)}
                onChange={e => {
                  const newKeys = [...selectedKeys]
                  if (e.target.checked) {
                    if (!newKeys.includes(false)) newKeys.push(false)
                  } else {
                    const index = newKeys.indexOf(false)
                    if (index > -1) newKeys.splice(index, 1)
                  }
                  setSelectedKeys(newKeys)
                }}
                style={{ marginRight: 8 }}
              />
              <span
                style={{
                  backgroundColor: '#fa8c16',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontWeight: 'bold'
                }}
              >
                Chưa duyệt
              </span>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button type="primary" onClick={() => confirm()} size="small" style={{ width: 90 }}>
              Lọc
            </Button>
            <Button
              onClick={() => {
                clearFilters()
                confirm()
              }}
              size="small"
              style={{ width: 90 }}
            >
              Đặt lại
            </Button>
          </div>
        </div>
      ),
      filterIcon: filtered => (
        <div style={{ position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              top: -8,
              right: -8,
              backgroundColor: filtered ? '#1890ff' : 'transparent',
              color: '#fff',
              width: 16,
              height: 16,
              borderRadius: '50%',
              display: filtered ? 'flex' : 'none',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 'bold'
            }}
          >
            {filtered ? '!' : ''}
          </div>
          <svg
            width="1em"
            height="1em"
            fill="currentColor"
            viewBox="0 0 1024 1024"
            style={{ color: filtered ? '#1890ff' : undefined }}
          >
            <path d="M819.2 486.4c-25.6 0-44.8-19.2-44.8-44.8V108.8c0-25.6 19.2-44.8 44.8-44.8s44.8 19.2 44.8 44.8v332.8c0 25.6-19.2 44.8-44.8 44.8zM512 486.4c-25.6 0-44.8-19.2-44.8-44.8V108.8c0-25.6 19.2-44.8 44.8-44.8s44.8 19.2 44.8 44.8v332.8c0 25.6-19.2 44.8-44.8 44.8zM204.8 486.4c-25.6 0-44.8-19.2-44.8-44.8V108.8c0-25.6 19.2-44.8 44.8-44.8s44.8 19.2 44.8 44.8v332.8c0 25.6-19.2 44.8-44.8 44.8z" />
            <path d="M932.8 179.2H91.2c-25.6 0-44.8-19.2-44.8-44.8s19.2-44.8 44.8-44.8h841.6c25.6 0 44.8 19.2 44.8 44.8s-19.2 44.8-44.8 44.8zM284.8 966.4c-32 0-57.6-25.6-57.6-57.6V537.6c0-32 25.6-57.6 57.6-57.6s57.6 25.6 57.6 57.6v364.8c0 38.4-25.6 64-57.6 64zM512 966.4c-32 0-57.6-25.6-57.6-57.6V537.6c0-32 25.6-57.6 57.6-57.6s57.6 25.6 57.6 57.6v364.8c6.4 38.4-25.6 64-57.6 64zM742.4 966.4c-32 0-57.6-25.6-57.6-57.6V537.6c0-32 25.6-57.6 57.6-57.6s57.6 25.6 57.6 57.6v364.8c0 38.4-25.6 64-57.6 64z" />
            <path d="M838.4 966.4H185.6c-70.4 0-128-57.6-128-128V390.4c0-25.6 19.2-44.8 44.8-44.8s44.8 19.2 44.8 44.8v448c0 19.2 16 38.4 38.4 38.4h652.8c19.2 0 38.4-16 38.4-38.4V390.4c0-25.6 19.2-44.8 44.8-44.8s44.8 19.2 44.8 44.8v448c0 70.4-57.6 128-128 128z" />
          </svg>
        </div>
      ),
      onFilter: (value, record) => {
        return record.isApproved === value
      },
      render: (isApproved, record) => {
        const approvedStatus = isApproved || false

        const backgroundColor = approvedStatus ? '#52c41a' : '#fa8c16'

        return (
          <Select
            value={approvedStatus ? 'approved' : 'pending'}
            style={{
              width: isMobile ? 110 : 120,
              backgroundColor: backgroundColor,
              borderColor: backgroundColor
            }}
            className={styles.statusSelect}
            onChange={value => handleApprovalChange(value, record)}
            options={[
              {
                value: 'approved',
                label: 'Đã duyệt',
                style: {
                  color: '#ffffff',
                  fontWeight: 'bold',
                  backgroundColor: '#52c41a',
                  padding: '2px 8px',
                  borderRadius: '4px'
                }
              },
              {
                value: 'pending',
                label: 'Chưa duyệt',
                style: {
                  color: '#ffffff',
                  fontWeight: 'bold',
                  backgroundColor: '#fa8c16',
                  padding: '2px 8px',
                  borderRadius: '4px'
                }
              }
            ]}
            dropdownStyle={{ minWidth: 120 }}
            dropdownMatchSelectWidth={false}
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
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} bài viết`
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
