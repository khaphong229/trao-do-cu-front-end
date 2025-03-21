import React from 'react'
import { Modal, Button, Typography, Space, Avatar, Badge, Tooltip } from 'antd'
import { UserOutlined, InfoCircleOutlined, AntDesignOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { setRequestNotificationModal } from 'features/client/request/giftRequest/giftRequestSlice'

const { Text, Title } = Typography

const RequestNotificationModal = () => {
  const { isRequestNotificationModal } = useSelector(state => state.giftRequest)
  const dispatch = useDispatch()
  const { selectedPostExchange } = useSelector(state => state.exchangeRequest)
  const handleOk = () => {
    dispatch(setRequestNotificationModal(false))
  }

  return (
    <>
      <Modal
        title={
          <Space>
            <InfoCircleOutlined style={{ color: '#1890ff' }} />
            <span>Thông Báo</span>
          </Space>
        }
        open={isRequestNotificationModal}
        onOk={handleOk}
        onCancel={handleOk}
        footer={[
          <Button key="back" onClick={handleOk}>
            Đóng
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Đã Hiểu
          </Button>
        ]}
        width={400}
      >
        <div
          style={{
            padding: '20px 0',
            textAlign: 'center',
            background: '#f8f8f8',
            borderRadius: '8px',
            margin: '15px 0'
          }}
        >
          <Badge count={23} overflowCount={99}>
            <Avatar.Group>
              <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
              <a href="https://ant.design">
                <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
              </a>
              <Tooltip title="Ant User" placement="top">
                <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
              </Tooltip>
              <Avatar style={{ backgroundColor: '#1677ff' }} icon={<AntDesignOutlined />} />
            </Avatar.Group>
          </Badge>

          <Title level={4} style={{ marginTop: '16px', marginBottom: '8px' }}>
            Bạn và 23 người khác đã xin đồ
          </Title>
        </div>

        <Text style={{ display: 'block', textAlign: 'center', marginTop: '10px' }}>
          Vui lòng chờ phản hồi từ {selectedPostExchange?.user_id?.name || 'người đăng'}
        </Text>
      </Modal>
    </>
  )
}

export default RequestNotificationModal
