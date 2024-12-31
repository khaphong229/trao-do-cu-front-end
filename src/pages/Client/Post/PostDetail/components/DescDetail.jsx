import React from 'react'
import { Button, Typography } from 'antd'
import { CameraOutlined } from '@ant-design/icons'
import styles from './../scss/PostDescriptionDetail.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { setCreateModalVisibility } from 'features/client/post/postSlice'

const { Text, Link } = Typography

const DescDetail = () => {
  const dispatch = useDispatch()
  const { selectedPost } = useSelector(state => state.post)

  return (
    <div className={styles.ContentWrap}>
      <Typography>
        <Text strong>{selectedPost?.title || 'Không có tiêu đề'}</Text>
        <br />
        <Text>{selectedPost?.description || ''}</Text>
        <br />

        <Link href="/">{`Số điện thoại: ${selectedPost?.user_id?.phone ? selectedPost?.user_id?.phone : ''}`}</Link>
      </Typography>

      <div className={styles.recommendWrap}>
        <div>
          <Text className={styles.recommendWrapText}>
            <CameraOutlined /> Bạn có muốn đăng bài tiếp không?
          </Text>
        </div>
        <div>
          <Button type="primary" onClick={() => dispatch(setCreateModalVisibility(true))}>
            Đăng bài
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DescDetail
