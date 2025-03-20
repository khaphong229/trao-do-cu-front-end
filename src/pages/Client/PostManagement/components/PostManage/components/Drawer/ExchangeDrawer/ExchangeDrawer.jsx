import React, { useState, useMemo, useEffect } from 'react'
import {
  Drawer,
  Card,
  List,
  Avatar,
  Space,
  Button,
  Image,
  message,
  Badge,
  Descriptions,
  Pagination,
  Tag,
  Select
} from 'antd'
import { UserOutlined, ClockCircleOutlined, SearchOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import styles from './ExchangeDrawer.module.scss'
import dayjs from 'dayjs'
import { URL_SERVER_IMAGE } from 'config/url_server'
import {
  acceptExchangeRequest,
  rejectExchangeRequest
} from 'features/client/request/exchangeRequest/exchangeRequestThunks'
import useCheckMobileScreen from 'hooks/useCheckMobileScreen'
import { getAvatarPost } from 'hooks/useAvatar'
import { Input } from 'postcss'
// Assuming moment is already installed

export const ExchangeDrawer = ({
  visible,
  onClose,
  listing,
  exchangeRequests,
  refetch,
  onUpdateSuccess,
  pagination
}) => {
  const dispatch = useDispatch()
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchText, setSearchText] = useState('')
  const [filteredRequests, setFilteredRequests] = useState([])
  const [activeTab, setActiveTab] = useState('all')
  const [sortOrder, setSortOrder] = useState('newest')
  const isMobile = useCheckMobileScreen()

  const sortedRequests = React.useMemo(() => {
    if (!exchangeRequests) return []

    let sorted = [...exchangeRequests]

    // Sắp xếp theo trạng thái trước (accepted luôn lên đầu)
    sorted.sort((a, b) => {
      if (a.status === 'accepted' && b.status !== 'accepted') return -1
      if (a.status !== 'accepted' && b.status === 'accepted') return 1
      return 0
    })

    // Sau đó sắp xếp theo thời gian trong mỗi nhóm
    sorted = sorted.sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.created_at) - new Date(a.created_at)
      } else {
        return new Date(a.created_at) - new Date(b.created_at)
      }
    })

    return sorted
  }, [exchangeRequests, sortOrder])
  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredRequests(sortedRequests)
    } else {
      const searchLower = searchText.toLowerCase()
      const filtered = sortedRequests.filter(
        request =>
          (request.user_req_id?.name || '').toLowerCase().includes(searchLower) ||
          (request.contact_phone || '').includes(searchText) ||
          (request.contact_address || '').toLowerCase().includes(searchLower) ||
          (request.reason_receive || '').toLowerCase().includes(searchLower)
      )
      setFilteredRequests(filtered)
    }
  }, [searchText, sortedRequests])

  const hasAccepted = useMemo(() => {
    return sortedRequests.some(req => req.status === 'accepted')
  }, [sortedRequests])

  const handleAccept = async (requestId, status = 'accepted') => {
    try {
      await dispatch(acceptExchangeRequest({ requestId, status })).unwrap()
      message.success(
        status === 'accepted' ? 'Đã chấp nhận yêu cầu trao đổi thành công' : 'Đã hủy yêu cầu trao đổi thành công'
      )
      await handleRefetch()
      onUpdateSuccess()
    } catch (error) {
      message.error(error.message || 'Có lỗi xảy ra khi xử lý yêu cầu trao đổi')
    }
  }

  const handleDelete = async id => {
    try {
      const response = await dispatch(rejectExchangeRequest(id)).unwrap()
      if (response.status === 201) {
        message.success(response.message)
        await handleRefetch()
      }
    } catch (error) {
      message.error('Từ chối thất bại!')
    }
  }

  const handleRefetch = async () => {
    if (listing) {
      await refetch(listing, {
        current: currentPage,
        pageSize: pageSize,
        post_id: listing._id
      })
    }
  }

  const handlePaginationChange = async (page, size) => {
    setCurrentPage(page)
    setPageSize(size)
    if (listing) {
      await refetch(listing, {
        current: page,
        pageSize: size,
        post_id: listing._id
      })
    }
  }

  const handleSearch = e => {
    setSearchText(e.target.value)
  }

  if (!listing) return null
  const handleSortChange = value => {
    setSortOrder(value)
  }

  return (
    <Drawer
      title="Chi tiết danh sách"
      placement="right"
      onClose={onClose}
      open={visible}
      width={isMobile.isMobile ? '100%' : '70%'}
      destroyOnClose={true}
      maskClosable={true}
    >
      <Card className={styles.originalPost}>
        <div className={styles.postHeader}>
          <div className={styles.postInfo}>
            <p className={styles.title}>{`${listing.title}`}</p>
            <Space direction="horizontal" size="small" className={styles.metaInfo}>
              <Tag icon={<UserOutlined />} color="blue">
                {`Đăng bởi: ${listing.user_id?.name || 'Không xác định'}`}
              </Tag>
              <Tag icon={<ClockCircleOutlined />} color="green">
                {`Đăng lúc: ${dayjs(listing.created_at).format('DD/MM/YYYY HH:mm')}`}
              </Tag>
            </Space>
          </div>
        </div>
        <div className={styles.postContent}>
          <div className={styles.imageGrid}>
            {listing.image_url?.map((img, index) => (
              <Image
                className={styles.imgItem}
                key={index}
                src={`${URL_SERVER_IMAGE}${img}`}
                alt={`Post image ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </Card>
      <div className={styles.searchAndFilterContainer}>
        <div className={styles.searchContainer}>
          <Input
            placeholder="Tìm kiếm người yêu cầu trao tặng..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={handleSearch}
            className={styles.searchInput}
            allowClear
          />
        </div>

        <div className={styles.filterContainer}>
          <Select
            value={sortOrder}
            onChange={handleSortChange}
            options={[
              { value: 'newest', label: 'Mới nhất' },
              { value: 'oldest', label: 'Cũ nhất' }
            ]}
          />
        </div>
      </div>

      <List
        dataSource={sortedRequests}
        renderItem={request => (
          <Card className={styles.requestCard} key={request._id}>
            <div className={styles.userInfo}>
              <Avatar src={getAvatarPost(request.user_req_id)} icon={<UserOutlined />} />
              <Space>
                <span>{request.user_req_id?.name}</span>
                {request.status === 'accepted' && <Badge status="success" text="Đã chấp nhận" />}
              </Space>
            </div>

            <Descriptions
              title="Chi tiết trao đổi"
              bordered
              column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
              className={styles.exchangeDetails}
            >
              <Descriptions.Item label="Tiêu đề">{request.title || 'Không có tiêu đề'}</Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">{request.contact_phone || 'Không có'}</Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">{request.contact_address || 'Không có'}</Descriptions.Item>
              <Descriptions.Item label="Facebook">
                {request.contact_social_media?.facebook || 'Không có'}
              </Descriptions.Item>
              <Descriptions.Item label="Mô tả" span={2}>
                {request.description || 'Không có mô tả'}
              </Descriptions.Item>
            </Descriptions>

            {request.image_url && request.image_url.length > 0 && (
              <div className={styles.imageSection}>
                <div className={styles.imageTitle}>Hình ảnh trao đổi</div>
                <div className={styles.imageGrid}>
                  {request.image_url.map((img, index) => (
                    <Image key={index} src={`${URL_SERVER_IMAGE}${img}`} alt={`Exchange item ${index + 1}`} />
                  ))}
                </div>
              </div>
            )}

            <div className={styles.actions}>
              {request.status === 'accepted' ? (
                <Button danger onClick={() => handleAccept(request._id, 'pending')}>
                  Hủy yêu cầu
                </Button>
              ) : (
                <>
                  <Button
                    type="primary"
                    onClick={() => handleAccept(request._id)}
                    disabled={hasAccepted || request.status !== 'pending'}
                  >
                    Chấp nhận
                  </Button>
                  <Button
                    onClick={() => handleDelete(request._id)}
                    danger
                    disabled={hasAccepted || request.status !== 'pending'}
                  >
                    Từ chối
                  </Button>
                </>
              )}
            </div>
          </Card>
        )}
      />

      <div className={styles.paginationContainer}>
        <Pagination
          align="end"
          current={currentPage}
          pageSize={pagination.pageSize}
          total={pagination.total || 0}
          showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} yêu cầu`}
          showSizeChanger={true}
          onChange={handlePaginationChange}
          onShowSizeChange={handlePaginationChange}
          style={{ margin: '40px 0' }}
        />
      </div>
    </Drawer>
  )
}
