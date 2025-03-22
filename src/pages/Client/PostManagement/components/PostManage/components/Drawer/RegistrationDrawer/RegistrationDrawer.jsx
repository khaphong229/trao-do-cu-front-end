import React, { useState, useEffect } from 'react'
import {
  Drawer,
  Card,
  List,
  Avatar,
  Button,
  message,
  Badge,
  Descriptions,
  Image,
  Pagination,
  Tag,
  Space,
  Input,
  Select,
  Radio,
  Modal
} from 'antd'
import { UserOutlined, ClockCircleOutlined, SearchOutlined, GiftOutlined, AimOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import styles from './RegistrationDrawer.module.scss'
import dayjs from 'dayjs'
import { URL_SERVER_IMAGE } from 'config/url_server'
import { acceptGiftRequest, rejectGiftRequest } from 'features/client/request/giftRequest/giftRequestThunks'
import useCheckMobileScreen from 'hooks/useCheckMobileScreen'
import { getAvatarPost } from 'hooks/useAvatar'
import imgNotFound from 'assets/images/others/imagenotfound.webp'
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
  const [searchText, setSearchText] = useState('')
  const [filteredRequests, setFilteredRequests] = useState([])
  const [activeTab, setActiveTab] = useState('all')
  const [sortOrder, setSortOrder] = useState('newest')
  const isMobile = useCheckMobileScreen()
  const [isRandomModalVisible, setIsRandomModalVisible] = useState(false)
  const [randomMode, setRandomMode] = useState('currentPage')
  const [isRandomizing, setIsRandomizing] = useState(false)
  const [selectedWinner, setSelectedWinner] = useState(null)
  const [allRequests, setAllRequests] = useState([])

  const sortedRequests = React.useMemo(() => {
    if (!receiveRequests) return []

    let sorted = [...receiveRequests]

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
  }, [receiveRequests, sortOrder])

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

  const handleSearch = e => {
    setSearchText(e.target.value)
  }

  const handleSortChange = value => {
    setSortOrder(value)
  }
  // Hàm lấy tất cả requests từ tất cả các trang
  const fetchAllRequests = async () => {
    try {
      setIsRandomizing(true)
      const totalPages = Math.ceil(pagination.total / pagination.pageSize)
      let allRequestsData = []

      if (totalPages <= 1) {
        const pendingRequests = sortedRequests.filter(req => req.status === 'pending')
        return pendingRequests
      }

      for (let page = 1; page <= totalPages; page++) {
        const response = await refetch(listing, {
          current: page,
          pageSize: pagination.pageSize,
          post_id: listing._id
        })

        if (response?.data) {
          const pendingRequests = response.data.filter(req => req.status === 'pending')
          allRequestsData = [...allRequestsData, ...pendingRequests]
        }
      }

      await refetch(listing, {
        current: currentPage,
        pageSize: pagination.pageSize,
        post_id: listing._id
      })

      return allRequestsData
    } catch (error) {
      message.error('Lỗi khi tải tất cả yêu cầu: ' + (error.message || 'Đã xảy ra lỗi'))
      return []
    }
  }

  const showRandomModal = () => {
    setIsRandomModalVisible(true)
    setSelectedWinner(null)
  }

  const selectRandomWinner = async () => {
    setIsRandomizing(true)
    setSelectedWinner(null)

    try {
      let eligibleRequests = []

      if (randomMode === 'currentPage') {
        eligibleRequests = sortedRequests.filter(req => req.status === 'pending')
      } else {
        eligibleRequests = await fetchAllRequests()
      }

      if (eligibleRequests.length === 0) {
        message.warning('Không có yêu cầu nào đủ điều kiện để chọn')
        setIsRandomizing(false)
        return
      }

      let counter = 0
      const maxIterations = 15
      const animationInterval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * eligibleRequests.length)
        setSelectedWinner(eligibleRequests[randomIndex])

        counter++
        if (counter >= maxIterations) {
          clearInterval(animationInterval)

          const finalIndex = Math.floor(Math.random() * eligibleRequests.length)
          const winner = eligibleRequests[finalIndex]
          setSelectedWinner(winner)
          setIsRandomizing(false)
        }
      }, 150)
    } catch (error) {
      message.error('Lỗi khi chọn ngẫu nhiên: ' + (error.message || 'Đã xảy ra lỗi'))
      setIsRandomizing(false)
    }
  }

  const confirmWinner = async () => {
    if (selectedWinner) {
      try {
        await handleAccept(selectedWinner._id)
        setIsRandomModalVisible(false)
        message.success(`Đã chọn ${selectedWinner.user_req_id?.name || 'Người dùng'} làm người nhận!`)
      } catch (error) {
        message.error('Lỗi khi xác nhận người nhận: ' + (error.message || 'Đã xảy ra lỗi'))
      }
    } else {
      message.warning('Vui lòng chọn ngẫu nhiên một người nhận trước')
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
              src={`${URL_SERVER_IMAGE}${img}` || imgNotFound}
              alt={`Sản phẩm ${index + 1}`}
              className={styles.registrationImage}
              onError={e => {
                e.target.onerror = null
                e.target.src = imgNotFound
              }}
            />
          ))}
        </div>
      </Card>

      <div className={styles.controlsContainer}>
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

        <Button
          type="primary"
          icon={<GiftOutlined />}
          onClick={showRandomModal}
          disabled={hasAccepted || sortedRequests.filter(req => req.status === 'pending').length === 0}
          className={styles.randomButton}
        >
          Chọn người nhận ngẫu nhiên
        </Button>
      </div>

      <List
        className={styles.requestsList}
        dataSource={filteredRequests}
        locale={{ emptyText: 'Không tìm thấy yêu cầu nào' }}
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

            {/* <div className={styles.requestActions}>
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
            </div> */}
            <div className={styles.requestActions}>
              {request.status !== 'accepted' && (
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
      {/* Modal chọn người nhận ngẫu nhiên */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <AimOutlined style={{ marginRight: '8px' }} /> Chọn người nhận ngẫu nhiên
          </div>
        }
        open={isRandomModalVisible}
        onCancel={() => setIsRandomModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsRandomModalVisible(false)}>
            Hủy
          </Button>,
          <Button
            key="random"
            type="primary"
            onClick={selectRandomWinner}
            loading={isRandomizing}
            disabled={isRandomizing}
          >
            {isRandomizing ? 'Đang chọn...' : 'Chọn ngẫu nhiên'}
          </Button>,
          <Button key="confirm" type="primary" onClick={confirmWinner} disabled={!selectedWinner || isRandomizing}>
            Xác nhận người được chọn
          </Button>
        ]}
        width={500}
      >
        <div className={styles.randomModalContent}>
          <div className={styles.randomModeSelector}>
            <Radio.Group value={randomMode} onChange={e => setRandomMode(e.target.value)}>
              <Radio value="currentPage">Chỉ chọn từ trang hiện tại</Radio>
              <Radio value="allPages">Chọn từ tất cả các trang</Radio>
            </Radio.Group>
          </div>

          {isRandomizing && (
            <div className={styles.randomizingAnimation}>
              <div className={styles.spinner}></div>
              <p>Đang chọn ngẫu nhiên...</p>
            </div>
          )}

          {selectedWinner && !isRandomizing && (
            <div className={styles.winnerDisplay}>
              <div className={styles.winnerHeader}>
                <Avatar src={getAvatarPost(selectedWinner.user_req_id)} icon={<UserOutlined />} size={64} />
                <div className={styles.winnerInfo}>
                  <h3>{selectedWinner.user_req_id?.name || 'Không xác định'}</h3>
                  <p>{selectedWinner.contact_phone}</p>
                </div>
              </div>
              <div className={styles.winnerDetails}>
                <p>
                  <strong>Địa chỉ:</strong> {selectedWinner.contact_address}
                </p>
                <p>
                  <strong>Lý do nhận:</strong> {selectedWinner.reason_receive || 'Không có'}
                </p>
              </div>
            </div>
          )}

          {!selectedWinner && !isRandomizing && (
            <div className={styles.noWinnerYet}>
              <p>Nhấn "Chọn ngẫu nhiên" để bắt đầu quá trình chọn người nhận</p>
            </div>
          )}
        </div>
      </Modal>
    </Drawer>
  )
}
