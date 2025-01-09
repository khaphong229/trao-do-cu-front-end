import React from 'react'
import { Drawer, Card, List, Avatar, Button, message, Badge, Descriptions } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import styles from './RegistrationDrawer.module.scss'
import avt from 'assets/images/logo/avtDefault.jpg'
import { URL_SERVER_IMAGE } from '../../../../../../../config/url_server'
import { acceptGiftRequest, rejectGiftRequest } from 'features/client/request/giftRequest/giftRequestThunks'

export const RegistrationDrawer = ({ visible, onClose, listing, receiveRequests, refetch, onUpdateSuccess }) => {
  const dispatch = useDispatch()

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
      refetch()
      onUpdateSuccess()
    } catch (error) {
      message.error(error.message || 'Có lỗi xảy ra khi xử lý yêu cầu')
    }
  }

  const handleDelete = async id => {
    try {
      const response = await dispatch(rejectGiftRequest(id)).unwrap()
      if (response.status === 201) {
        message.success(response.message)
        refetch()
      }
    } catch (error) {
      message.error('Từ chối thất bại!')
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
      width={'70%'}
      className={styles.registrationDrawer}
    >
      <Card className={styles.registrationCard}>
        <div className={styles.registrationHeader}>
          <Avatar src={listing?.user_id?.avatar || avt} size={50} className={styles.registrationAvatar} />
          <div>
            <h4 className={styles.registrationUsername}>{listing.title}</h4>
            <p className={styles.registrationTitle}>{listing.description}</p>
          </div>
        </div>
        <div className={styles.registrationImages}>
          {(listing.image_url || []).map((img, index) => (
            <img
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
                <Avatar
                  src={request.user_req_id?.avatar ? `${URL_SERVER_IMAGE}${request.user_req_id?.avatar}` : avt}
                  icon={<UserOutlined />}
                  size={40}
                />
                <span className={styles.userName}>{request.user_req_id?.name}</span>
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
    </Drawer>
  )
}
