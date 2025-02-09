import React, { useState, useEffect } from 'react'
import { Row, Col, Card, Button, Avatar, Tabs, Typography, Select, Pagination } from 'antd'
import TabPane from 'antd/es/tabs/TabPane'
import styles from '../scss/PostManagement.module.scss'
import { HeartOutlined, HeartFilled } from '@ant-design/icons' // Thêm import icon
import { useDispatch, useSelector } from 'react-redux'
import { getPostPagination } from '../../../../../features/client/post/postThunks'
import notFoundPost from 'components/feature/post/notFoundPost'
const { Text } = Typography

const PostList = () => {
  const [likedItems, setLikedItems] = useState({})
  const dispatch = useDispatch()
  // const handleChange = value => {
  //   console.log(`selected ${value}`)
  // }
  const toggleLike = id => {
    setLikedItems(prev => ({ ...prev, [id]: !prev[id] }))
  }
  const { posts, isError, isLoading } = useSelector(state => state.post)
  useEffect(() => {
    dispatch(getPostPagination())
  }, [dispatch])
  if (isError === true && isLoading === false) {
    return <div>somthing wrong. Please try again !</div>
  }
  if (isError === false && isLoading === true) {
    return <div>Loading data.....</div>
  }
  return (
    <div className={styles.contentWrap}>
      <div className={styles.topContent}>
        <div className={styles.Tabs}>
          <Tabs defaultActiveKey="all" tabBarStyle={{ margin: 0 }}>
            <TabPane tab="Tất cả" key="all" />
            <TabPane tab="Trao tặng" key="give" />
            <TabPane tab="Trao đổi" key="exchange" />
          </Tabs>
        </div>
        <div className={styles.selection}>
          <Select
            defaultValue="newest"
            size="middle"
            // onChange={handleChange}
            options={[
              { value: 'newest', label: 'Tin mới nhất' },
              { value: 'oldest', label: 'Tin cũ nhất' }
            ]}
          />
        </div>
      </div>

      <Row gutter={[16, 16]}>
        {posts && posts.length > 0
          ? posts.map(item => (
              <Col xs={24} sm={12} md={8} key={item.category_id}>
                <Card
                  className={styles.Card}
                  hoverable
                  cover={
                    <div className={styles.imageWrapper}>
                      <img loading="lazy" alt={item.title} src={item.image_url[0]} />
                      <div
                        className={styles.heartIcon}
                        onClick={e => {
                          e.stopPropagation() // Ngăn click ảnh
                          toggleLike(item.category_id) // Xử lý trạng thái like
                        }}
                      >
                        {likedItems[item.category_id] ? <HeartFilled style={{ color: 'red' }} /> : <HeartOutlined />}
                      </div>
                    </div>
                  }
                >
                  <div className={styles.Container}>
                    <Text strong>{item.title}</Text>
                    <span className={styles.status}>{item.type === 'exchange' ? 'Trao tặng' : 'Trao đổi'}</span>
                    <div className={styles.TimeRole}>
                      <span>1 giờ trước</span>
                      <span> • </span>
                      <span>{item.city}</span>
                    </div>
                    <div className={styles.User}>
                      <div>
                        <Avatar>{item.user_post.name.charAt(0)}</Avatar>
                        <Text className={styles.TextUser}>{item.user_post.name}</Text>
                      </div>
                      <Button type="default" size="middle" className={styles.ButtonChat}>
                        {item.type === 'give' ? 'Nhận' : 'Đổi'}
                      </Button>
                    </div>
                  </div>
                </Card>
              </Col>
            ))
          : notFoundPost()}
      </Row>

      <Pagination className={styles.pagination} defaultCurrent={1} total={100} />
    </div>
  )
}

export default PostList
