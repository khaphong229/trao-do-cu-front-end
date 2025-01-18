import React, { useState, useMemo } from 'react'
import { Drawer, Card, List, Avatar, Space, Button, Image, message, Badge, Descriptions, Pagination } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import styles from './ExchangeDrawer.module.scss'
import { URL_SERVER_IMAGE } from 'config/url_server'
import {
  acceptExchangeRequest,
  rejectExchangeRequest
} from 'features/client/request/exchangeRequest/exchangeRequestThunks'

export const ExchangeDrawer = ({
  visible,
  onClose,
  listing,
  exchangeRequests,
  refetch,
  onUpdateSuccess,
  pagination
}) => {
  console.log(exchangeRequests)

  const dispatch = useDispatch()
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const sortedRequests = useMemo(() => {
    if (!exchangeRequests) return []
    const accepted = exchangeRequests.filter(req => req.status === 'accepted')
    const pending = exchangeRequests.filter(req => req.status === 'pending')
    return [...accepted, ...pending]
  }, [exchangeRequests])

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

  return (
    <Drawer
      title="Chi tiết danh sách"
      placement="right"
      onClose={onClose}
      open={visible}
      width={'70%'}
      destroyOnClose={true}
      maskClosable={true}
    >
      {listing && (
        <Card className={styles.originalPost}>
          <div className={styles.postContent}>
            <p className={styles.title}>{`Tiêu đề: ${listing.title}`}</p>
            <p className={styles.description}>{listing.description}</p>
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
      )}

      <List
        dataSource={sortedRequests}
        renderItem={request => (
          <Card className={styles.requestCard} key={request._id}>
            <div className={styles.userInfo}>
              <Avatar
                src={request.user_req_id?.avatar && `${URL_SERVER_IMAGE}${request.user_req_id?.avatar}`}
                icon={<UserOutlined />}
              />
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
