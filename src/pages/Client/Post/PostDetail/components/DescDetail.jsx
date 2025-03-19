import React, { useState } from 'react'
import { Button, Typography } from 'antd'
import { CameraOutlined } from '@ant-design/icons'
import styles from './../scss/PostDescriptionDetail.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { setCreateModalVisibility } from 'features/client/post/postSlice'

const { Text, Link } = Typography

const DescDetail = () => {
  const dispatch = useDispatch()
  const { selectedPost } = useSelector(state => state.post)
  const [expandDescription, setExpandDescription] = useState(false)

  // Xử lý nội dung mô tả với chức năng xem thêm
  const renderDescription = () => {
    if (!selectedPost?.description) return null

    const description = selectedPost.description
    const isDescriptionLong = description.length > 150 // Giới hạn 150 ký tự cho mô tả

    if (!isDescriptionLong || expandDescription) {
      return (
        <div className={styles.descriptionContainer}>
          <Text>{description}</Text>
          {isDescriptionLong && (
            <Button
              type="link"
              size="small"
              onClick={() => setExpandDescription(false)}
              className={styles.showLessButton}
            >
              Thu gọn
            </Button>
          )}
        </div>
      )
    } else {
      return (
        <div className={styles.descriptionContainer}>
          <Text>{description.substring(0, 150)}...</Text>
          <Button type="link" size="small" onClick={() => setExpandDescription(true)} className={styles.expandButton}>
            Xem thêm
          </Button>
        </div>
      )
    }
  }

  // Xử lý tiêu đề với chức năng xem thêm
  const [expandTitle, setExpandTitle] = useState(false)

  const renderTitle = () => {
    if (!selectedPost?.title) return <Text strong>Không có tiêu đề</Text>

    const title = selectedPost.title
    const isTitleLong = title.length > 50 // Giới hạn 50 ký tự cho tiêu đề

    if (!isTitleLong || expandTitle) {
      return (
        <div className={styles.titleContainer}>
          <Text strong>{title}</Text>
          {isTitleLong && (
            <Button type="link" size="small" onClick={() => setExpandTitle(false)} className={styles.showLessButton}>
              Thu gọn
            </Button>
          )}
        </div>
      )
    } else {
      return (
        <div className={styles.titleContainer}>
          <Text strong>{title.substring(0, 50)}...</Text>
          <Button type="link" size="small" onClick={() => setExpandTitle(true)} className={styles.expandButton}>
            Xem thêm
          </Button>
        </div>
      )
    }
  }

  return (
    <div className={styles.ContentWrap}>
      <Typography>
        {renderTitle()}
        {selectedPost?.user_id?.phone && (
          <Link>{`Số điện thoại: ${selectedPost.user_id.phone.slice(0, 3)}xxxxxxx`}</Link>
        )}
      </Typography>

      <div className={styles.recommendWrap}>
        <div>
          <Text className={styles.recommendWrapText}>
            <CameraOutlined /> Bạn có muốn đăng sản phẩm tiếp không?
          </Text>
        </div>
        <div>
          <Button type="primary" onClick={() => dispatch(setCreateModalVisibility(true))}>
            Đăng sản phẩm
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DescDetail
