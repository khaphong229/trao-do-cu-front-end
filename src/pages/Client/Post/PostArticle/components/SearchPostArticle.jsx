import React, { useState, useEffect } from 'react'
import { Button, Modal, List, Row, Col, Card, Typography, Avatar } from 'antd'
import { EnvironmentOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons'
import styles from '../scss/SearchPostManagement.module.scss'
import { getPostPagination } from '../../../../../features/client/post/postThunks'
import { useDispatch, useSelector } from 'react-redux'
const { Text } = Typography
const SearchPostArticle = () => {
  const dispatch = useDispatch()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedCity, setSelectedCity] = useState('Tp Hồ Chí Minh')
  const [tempSelectedCity, setTempSelectedCity] = useState('Tp Hồ Chí Minh')
  const { posts, isLoading, isError } = useSelector(state => state.post)
  const [likedItems, setLikedItems] = useState({})
  const cities = [
    'Hà Nội',
    'Hồ Chí Minh',
    'Đà Nẵng',
    'Hải Phòng',
    'Cần Thơ',
    'Quảng Ninh',
    'Bình Dương',
    'Đồng Nai',
    'Khánh Hòa',
    'Hải Dương',
    'Long An',
    'Tiền Giang',
    'Đắk Lắk',
    'Quảng Nam',
    'Thừa Thiên Huế',
    'Bình Thuận',
    'Thái Nguyên',
    'Thanh Hóa',
    'Nghệ An',
    'Bình Định',
    'Hà Tĩnh',
    'Phú Yên',
    'Hà Nam',
    'Ninh Bình',
    'Lào Cai',
    'Nam Định'
  ]
  useEffect(() => {
    // Gọi API để lấy danh sách bài đăng dựa trên thành phố được chọn
    dispatch(getPostPagination({ city: selectedCity }))
  }, [dispatch, selectedCity])

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    setSelectedCity(tempSelectedCity)
    setIsModalVisible(false)
    // Fetch bài đăng khi thành phố được xác nhận
    dispatch(getPostPagination({ city: tempSelectedCity }))
  }
  const handleCancel = () => {
    setTempSelectedCity(selectedCity) // Reset to previously confirmed city
    setIsModalVisible(false)
  }

  const handleCityChange = city => {
    setTempSelectedCity(city)
  }
  const toggleLike = id => {
    setLikedItems(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className={styles.Container}>
      <div>
        <h4>Danh sách bài đăng</h4>
      </div>
      <div>
        <div className={styles.LocationSearch}>
          <Button onClick={showModal} icon={<EnvironmentOutlined />}>
            Vị trí: {selectedCity}
          </Button>
        </div>
        <Modal
          title="Chọn tỉnh, thành phố"
          open={isModalVisible}
          onCancel={handleCancel}
          footer={
            <Button type="primary" onClick={handleOk}>
              Xác nhận
            </Button>
          }
          bodyStyle={{ maxHeight: '400px', overflowY: 'auto' }}
        >
          <List
            dataSource={cities}
            renderItem={city => (
              <List.Item
                className={city === tempSelectedCity ? styles.TempSelectedItem : styles.ListItem}
                onClick={() => handleCityChange(city)}
              >
                {city}
              </List.Item>
            )}
          />
        </Modal>
      </div>
      {/* <div>
        {isLoading ? (
          <p>Đang tải bài đăng...</p>
        ) : isError ? (
          <p>Có lỗi xảy ra khi tải bài đăng.</p>
        ) : posts.length > 0 ? (
          <Row gutter={[16, 16]}>
            {posts.map(item => (
              <Col xs={24} sm={12} md={8} key={item.id}>
                <Card
                  className={styles.Card}
                  hoverable
                  cover={
                    <div className={styles.imageWrapper}>
                      <img alt={item.title} src={item.link} />
                      <div
                        className={styles.heartIcon}
                        onClick={e => {
                          e.stopPropagation() // Ngăn click ảnh
                          toggleLike(item.id) // Xử lý trạng thái like
                        }}
                      >
                        {likedItems[item.id] ? <HeartFilled style={{ color: 'red' }} /> : <HeartOutlined />}
                      </div>
                    </div>
                  }
                >
                  <div className={styles.Container}>
                    <Text strong>{item.title}</Text>
                    <span className={styles.status}>{item.status === 'give' ? 'Cho tặng' : 'Trao đổi'}</span>
                    <div className={styles.TimeRole}>
                      <span>1 giờ trước</span>
                      <span> • </span>
                      <span>{item.location.split(',').slice(-1)[0]}</span>
                    </div>
                    <div className={styles.User}>
                      <div>
                        <Avatar>{item.user_post.name.charAt(0)}</Avatar>
                        <Text className={styles.TextUser}>{item.user_post.name}</Text>
                      </div>
                      <Button type="default" size="middle" className={styles.ButtonChat}>
                        {item.status === 'give' ? 'Nhận' : 'Đổi'}
                      </Button>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        ) : selectedCity ? (
          <p>Không có bài đăng nào cho thành phố {selectedCity}.</p>
        ) : (
          <p>Không có thành phố nào được chọn.</p>
        )}
      </div> */}
    </div>
  )
}

export default SearchPostArticle
