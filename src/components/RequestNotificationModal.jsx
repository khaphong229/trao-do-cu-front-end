import { Modal, Button, Typography, Space, Avatar, Badge, Divider, Row, Col } from 'antd'
import { UserOutlined, InfoCircleOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { setRequestNotificationModal } from 'features/client/request/giftRequest/giftRequestSlice'
import { useCallback, useEffect, useState, useMemo } from 'react'
import { getCountReceive } from 'features/client/request/giftRequest/giftRequestThunks'
import { getCountExchange } from 'features/client/request/exchangeRequest/exchangeRequestThunks'
import linh from 'assets/images/review/linh.jpg'
import { useAvatar } from 'hooks/useAvatar'
import tthuong from 'assets/images/review/tthuong.png'
import tu from 'assets/images/review/tu.png'
import danh from 'assets/images/review/đanh.jpg'
const { Text, Title } = Typography

const RequestNotificationModal = () => {
  const { isRequestNotificationModal } = useSelector(state => state.giftRequest)
  const dispatch = useDispatch()
  const { selectedPostExchange } = useSelector(state => state.exchangeRequest)
  const [count, setCount] = useState(5)
  const { user } = useSelector(state => state.auth)
  const handleOk = () => {
    dispatch(setRequestNotificationModal(false))
  }
  const { avatar } = useAvatar()

  // Create array of avatar components and shuffle them
  const randomizedAvatars = useMemo(() => {
    const avatarElements = [
      { key: 'linh', element: <Avatar src={linh} /> },
      { key: 'default', element: <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} /> },
      { key: 'tu', element: <Avatar src={tu} /> },
      { key: 'danh', element: <Avatar src={danh} /> },
      { key: 'tthuong', element: <Avatar src={tthuong} /> }
    ]

    // Fisher-Yates shuffle algorithm
    for (let i = avatarElements.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[avatarElements[i], avatarElements[j]] = [avatarElements[j], avatarElements[i]]
    }

    return avatarElements
  }, [avatar])

  const fetchCounts = useCallback(async () => {
    if (!selectedPostExchange?._id) return

    const id = selectedPostExchange._id
    const action = selectedPostExchange.type === 'gift' ? getCountReceive : getCountExchange

    try {
      const res = await dispatch(action(id)).unwrap()

      if (res.status === 200) {
        const countRes = res.data.display_request_count
        setCount(countRes === 0 ? countRes + 5 : countRes)
      }
    } catch (error) {}
  }, [selectedPostExchange, dispatch])

  useEffect(() => {
    fetchCounts()
  }, [selectedPostExchange, fetchCounts])

  return (
    <Modal
      title={
        <Space size="small" align="center">
          <InfoCircleOutlined style={{ color: '#1890ff', fontSize: '16px' }} />
          <span style={{ fontSize: '14px', fontWeight: 600 }}>Thông Báo</span>
        </Space>
      }
      open={isRequestNotificationModal}
      onOk={handleOk}
      onCancel={handleOk}
      footer={[
        <Button key="back" onClick={handleOk}>
          Đóng
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk} icon={<CheckCircleOutlined />}>
          Đã Hiểu
        </Button>
      ]}
      width={380}
      centered
      bodyStyle={{ padding: '16px' }}
      maskClosable={false}
    >
      <div
        style={{
          padding: '16px 12px',
          textAlign: 'center',
          background: 'linear-gradient(to right, #f0f5ff,rgb(230, 253, 255))',
          borderRadius: '8px',
          margin: '10px 0',
          boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)',
          border: '1px solid #d6e4ff'
        }}
      >
        <Row justify="center" gutter={[0, 12]}>
          <Col>
            <Badge
              count={count}
              overflowCount={99}
              style={{
                backgroundColor: '#ff4d4f',
                boxShadow: '0 0 0 2px #fff'
              }}
            >
              <Avatar.Group
                maxCount={3}
                maxPopoverTrigger="click"
                size="default"
                maxStyle={{
                  color: '#1890ff',
                  backgroundColor: '#e6f7ff',
                  cursor: 'pointer',
                  border: '1px solid #1890ff'
                }}
              >
                <Avatar src={avatar} />
                {randomizedAvatars.map(item => item.element)}
              </Avatar.Group>
            </Badge>
          </Col>

          <Col span={24}>
            <Title level={5} style={{ marginTop: '8px', marginBottom: '4px', color: '#262626' }}>
              Bạn và <span style={{ color: '#1890ff' }}>{count} người khác</span> đã xin đồ
            </Title>
          </Col>
        </Row>
      </div>

      <Divider style={{ margin: '12px 0' }} />

      <Row justify="center" align="middle" gutter={[0, 8]}>
        <Col span={24} style={{ textAlign: 'center' }}>
          <Space align="center" size="small">
            <ClockCircleOutlined style={{ color: '#faad14', fontSize: '16px' }} />
            <Text style={{ fontSize: '14px' }}>
              Vui lòng chờ phản hồi từ{' '}
              <Text strong style={{ color: '#1890ff' }}>
                {selectedPostExchange?.user_id?.name || 'người đăng'}
              </Text>
            </Text>
          </Space>
        </Col>
      </Row>
    </Modal>
  )
}

export default RequestNotificationModal
