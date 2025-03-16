import React, { useState } from 'react'
import { Drawer, Card, List, Avatar, Button, message, Badge, Descriptions, Image, Pagination, Tag, Space } from 'antd'
import { UserOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import styles from './RegistrationDrawer.module.scss'
import dayjs from 'dayjs'
import { URL_SERVER_IMAGE } from 'config/url_server'
import { acceptGiftRequest, rejectGiftRequest } from 'features/client/request/giftRequest/giftRequestThunks'
import useCheckMobileScreen from 'hooks/useCheckMobileScreen'
import { getAvatarPost } from 'hooks/useAvatar'
// Assuming moment is already installed

export const RegistrationDrawer = ({
  visible,
  onClose,
  listing,
  receiveRequests,
  refetch,
  onUpdateSuccess,
  pagination
}) => {
  const dispatch = useDispatch()
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const isMobile = useCheckMobileScreen()

  const sortedRequests = React.useMemo(() => {
    if (!receiveRequests) return []
    const accepted = receiveRequests.filter(req => req.status === 'accepted')
    const pending = receiveRequests.filter(req => req.status === 'pending')
    return [...accepted, ...pending]
  }, [receiveRequests])

  const hasAccepted = React.useMemo(() => {
    return sortedRequests.some(req => req.status === 'accepted')
  }, [sortedRequests])

  const handleAccept = async (requestId, status = 'accepted') => {
    try {
      await dispatch(acceptGiftRequest({ requestId, status })).unwrap()
      message.success(status === 'accepted' ? 'Đã chấp nhận yêu cầu thành công' : 'Đã hủy yêu cầu thành công')
      await handleRefetch()
      onUpdateSuccess?.()
    } catch (error) {
      message.error(error.message || 'Có lỗi xảy ra khi xử lý yêu cầu')
    }
  }

  const handleDelete = async id => {
    try {
      const response = await dispatch(rejectGiftRequest(id)).unwrap()
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

  if (!listing) return null

  return (
    <Drawer
      title="Chi tiết danh sách"
      placement="right"
      closable={true}
      onClose={onClose}
      open={visible}
      width={isMobile.isMobile ? '100%' : '70%'}
      className={styles.registrationDrawer}
    >
      <Card className={styles.registrationCard}>
        <div className={styles.registrationHeader}>
          <div className={styles.registrationInfo}>
            <h4 className={styles.registrationTitle}>{`${listing.title}`}</h4>
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
        <div className={styles.registrationImages}>
          {(listing.image_url || []).map((img, index) => (
            <Image
              key={index}
              src={`${URL_SERVER_IMAGE}${img}`}
              alt={`Sản phẩm ${index + 1}`}
              className={styles.registrationImage}
            />
          ))}
        </div>
      </Card>

      <List
        className={styles.requestsList}
        dataSource={sortedRequests}
        renderItem={request => (
          <div className={styles.requestItem}>
            <div className={styles.requestHeader}>
              <div className={styles.userInfo}>
                <Avatar src={getAvatarPost(request.user_req_id)} icon={<UserOutlined />} size={40} />
                <span className={styles.userName}>{request.user_req_id?.name || 'Không xác định'}</span>
              </div>
              <Badge
                status={request.status === 'accepted' ? 'success' : 'processing'}
                text={request.status === 'accepted' ? 'Được nhận' : 'Chờ duyệt'}
                className={`${styles.statusBadge} ${styles[request.status]}`}
              />
            </div>

            <div className={styles.requestContent}>
              <Descriptions column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }} bordered size="small">
                <Descriptions.Item label="Số điện thoại">{request.contact_phone}</Descriptions.Item>
                <Descriptions.Item label="Địa chỉ">{request.contact_address}</Descriptions.Item>
                <Descriptions.Item label="Lý do nhận" span={2}>
                  {request.reason_receive || 'Không có'}
                </Descriptions.Item>
              </Descriptions>
            </div>

            <div className={styles.requestActions}>
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
                    danger
                    disabled={hasAccepted || request.status !== 'pending'}
                    onClick={() => handleDelete(request._id)}
                  >
                    Từ chối
                  </Button>
                </>
              )}
            </div>
          </div>
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
