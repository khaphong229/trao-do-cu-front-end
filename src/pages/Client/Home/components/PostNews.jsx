import React, { useEffect, useState } from 'react'
import { Card, Row, Col, Button, Avatar, Empty, Typography } from 'antd'
import styles from '../scss/PostNews.module.scss'
import { Link, useNavigate } from 'react-router-dom'
import withAuth from 'hooks/useAuth'
import { getPostPagination } from '../../../../features/client/post/postThunks'
import { resetPosts } from '../../../../features/client/post/postSlice'
import { useDispatch, useSelector } from 'react-redux'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/vi'
import avt from 'assets/images/logo/avt-3d.jpg'
import imageNotFound from 'assets/images/others/imagenotfound.jpg'
import { getValidImageUrl } from 'helpers/helper'
import { useGiftRequest } from 'pages/Client/Request/GiftRequest/useRequestGift'
import { ContactInfoModal } from 'pages/Client/Request/GiftRequest/components/ContactInfoModal'
import { GiftRequestConfirmModal } from 'pages/Client/Request/GiftRequest/components/GiftRequestConfirmModal'
import FormExchangeModal from 'pages/Client/Request/ExchangeRequest/FormExchange/FormExchange'
import { setExchangeFormModalVisible } from 'features/client/request/exchangeRequest/exchangeRequestSlice'
import { URL_SERVER_IMAGE } from '../../../../config/url_server'
import { ArrowDownOutlined } from '@ant-design/icons'
import { usePostStatus } from 'hooks/usePostStatus'

dayjs.extend(relativeTime)
dayjs.locale('vi')

const PostNews = () => {
  const [curPage, setCurPage] = useState(1)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { isExchangeFormModalVisible } = useSelector(state => state.exchangeRequest)
  const { posts, isError, isLoading, hasMore, query } = useSelector(state => state.post)
  const { user } = useSelector(state => state.auth)
  const { handleGiftRequest, handleInfoSubmit, handleRequestConfirm } = useGiftRequest()

  const { postsWithStatus, isChecking } = usePostStatus(posts, user?._id)

  useEffect(() => {
    dispatch(resetPosts())
    dispatch(
      getPostPagination({
        current: 1,
        pageSize: 8,
        query
      })
    )
  }, [dispatch, query])

  const handleLoadMore = () => {
    const nextPage = curPage + 1
    setCurPage(nextPage)
    dispatch(
      getPostPagination({
        current: nextPage,
        pageSize: 8,
        query
      })
    )
  }

  const goDetail = _id => {
    navigate(`/post/${_id}/detail`)
  }

  const AuthButton = withAuth(Button)

  const filteredPosts = postsWithStatus
    ?.filter(post => !query || post.title.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => dayjs(b.created_at).diff(dayjs(a.created_at)))

  const renderActionButton = item => {
    if (!user) {
      return item.type === 'gift' ? (
        <AuthButton size="small" color="primary" variant="filled" onClick={() => handleGiftRequest(item, item.type)}>
          Nhận
        </AuthButton>
      ) : (
        <AuthButton size="small" type="primary" onClick={() => handleGiftRequest(item, item.type)}>
          Đổi
        </AuthButton>
      )
    }

    if (item.isRequested) {
      return (
        <Button size="small" disabled>
          Đã yêu cầu
        </Button>
      )
    }

    return item.type === 'gift' ? (
      <AuthButton size="small" color="primary" variant="filled" onClick={() => handleGiftRequest(item, item.type)}>
        Nhận
      </AuthButton>
    ) : (
      <AuthButton size="small" type="primary" onClick={() => handleGiftRequest(item, item.type)}>
        Đổi
      </AuthButton>
    )
  }

  if (isLoading || isChecking) {
    return (
      <Empty
        style={{ textAlign: 'center' }}
        imageStyle={{ height: 200 }}
        description={<Typography.Text>Đang tải bài đăng...</Typography.Text>}
      />
    )
  }

  if (isError) {
    return (
      <Empty
        style={{ textAlign: 'center' }}
        imageStyle={{ height: 200 }}
        description={<Typography.Text>Lỗi xảy ra khi tải bài đăng.</Typography.Text>}
      />
    )
  }

  return (
    <div className={styles.postWrap}>
      <span className={styles.postTitle}>Bài đăng mới nhất</span>

      {filteredPosts && filteredPosts.length > 0 ? (
        <Row justify="start" className={styles.itemsGrid}>
          {filteredPosts.map(item => (
            <Col key={item._id} xs={12} sm={8} md={6} lg={6} className={styles.itemCol}>
              <Card
                hoverable
                className={styles.itemCard}
                cover={
                  <div className={styles.imageWrapper} onClick={() => goDetail(item._id)}>
                    <img
                      alt={item.title}
                      src={getValidImageUrl(item.image_url)}
                      onError={e => {
                        e.target.onerror = null
                        e.target.src = imageNotFound
                      }}
                    />
                  </div>
                }
              >
                <div className={styles.cardContent}>
                  <p className={styles.itemTitle} onClick={() => goDetail(item._id)}>
                    {item.title}
                  </p>
                  <p className={styles.itemDesc}>{item?.description || ''}</p>
                  <div className={styles.statusRow}>
                    <span className={styles.status}>{item.type === 'gift' ? 'Trao tặng' : 'Trao đổi'}</span>
                    {renderActionButton(item)}
                  </div>
                  <div className={styles.locationRow}>
                    <div className={styles.userGroup}>
                      <Avatar
                        className={styles.avtUser}
                        src={item?.user_id?.avatar ? `${URL_SERVER_IMAGE}${item.user_id.avatar}` : avt}
                      />
                      <span className={styles.time}>
                        {dayjs(item.created_at).isValid() ? dayjs(item.created_at).fromNow() : 'Không rõ thời gian'}
                      </span>
                    </div>
                    <span className={styles.location}>{item.city}</span>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Empty
          style={{ textAlign: 'center' }}
          imageStyle={{ height: 200 }}
          description={<Typography.Text>Không có bài đăng nào.</Typography.Text>}
        />
      )}

      {hasMore && (
        <div className={styles.buttonWrapper}>
          <Button
            icon={<ArrowDownOutlined />}
            onClick={handleLoadMore}
            loading={isLoading}
            type="link"
            className={styles.textMore}
          />
        </div>
      )}

      {/* {!hasMore && (
        <p style={{ textAlign: 'center' }}>
          <Empty
            description={
              <Typography.Text>
                Không có <Link to="/">Dữ Liệu</Link>
              </Typography.Text>
            }
          />
        </p>
      )} */}

      <ContactInfoModal onSubmit={handleInfoSubmit} />
      <GiftRequestConfirmModal onConfirm={handleRequestConfirm} />
      <FormExchangeModal
        visible={isExchangeFormModalVisible}
        onClose={() => dispatch(setExchangeFormModalVisible(false))}
      />
    </div>
  )
}

export default PostNews
