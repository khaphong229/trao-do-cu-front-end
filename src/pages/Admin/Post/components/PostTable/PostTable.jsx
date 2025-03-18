import { Button, Input, Space, Table } from 'antd'
import { setPage, setPerPage } from 'features/admin/post/postAdminSlice'
import { getPostPagination } from 'features/client/post/postThunks'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { EyeOutlined, SearchOutlined, EnvironmentOutlined } from '@ant-design/icons'
import avt from '../../../../../assets/images/logo/avtDefault.webp'
import styles from '../../styles.module.scss'
import { approvalStatus } from 'features/admin/post/postAdminThunks'
import moment from 'moment'

const PostTable = ({ onViewDetails }) => {
  const dispatch = useDispatch()
  const { posts, total, page, perPage, isLoading, searchText } = useSelector(state => state.postManagement)

  const handleApprovePost = postId => {
    dispatch(approvalStatus(postId))
  }

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: page,
      pageSize: perPage,
      total: total
    }
  })

  const filteredPosts = searchText
    ? posts.filter(post => post.title && post.title.toLowerCase().includes(searchText.toLowerCase()))
    : posts
  // Load posts when component mounts
  useEffect(() => {
    dispatch(getPostPagination({ page, per_page: perPage }))
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

  const columns = [
    {
      title: 'Ảnh bài đăng',
      dataIndex: 'image_url',
      key: 'image_url',
      render: (imageUrl, record) => {
        // Handle array of image URLs from the data structure
        const imageSource = record.image_url && record.image_url.length > 0 ? record.image_url[0] : avt
        return <img src={imageSource} alt="imageUrl" width={50} height={50} style={{ objectFit: 'cover' }} />
      }
    },
    {
      title: 'Tên bài đăng',
      dataIndex: 'title',
      key: 'title',
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
        // Format the date string from ISO format
        return moment(created_at).format('DD/MM/YYYY HH:mm')
      }
    },
    {
      title: 'Thể loại',
      dataIndex: 'category_id',
      key: 'category_id',
      render: category_id => {
        // Display category name if available
        return category_id?.name || 'Không có thể loại'
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isApproved',
      key: 'isApproved',
      render: isApproved => {
        return isApproved ? (
          <span style={{ color: 'green' }}>Đã duyệt</span>
        ) : (
          <span style={{ color: 'orange' }}>Chưa duyệt</span>
        )
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
      columns={columns}
      dataSource={filteredPosts}
      rowKey="_id"
      loading={isLoading}
      pagination={{
        current: page,
        pageSize: perPage,
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
