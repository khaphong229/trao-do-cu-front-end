import React, { useEffect, useCallback, useState } from 'react'
import { Button, Typography, Empty, Tooltip } from 'antd'
import { GiftOutlined, SwapOutlined } from '@ant-design/icons'
import styles from '../scss/PostPTIT.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { getPostPtitPagination } from 'features/client/post/postThunks'
import { resetPosts } from 'features/client/post/postSlice'
import { useNavigate } from 'react-router-dom'
import withAuth from 'hooks/useAuth'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/vi'
import PostCardSkeleton from 'components/common/Skeleton/PostCardSkeleton'
import { useGiftRequest } from 'pages/Client/Request/GiftRequest/useRequestGift'
// Import OwlCarousel conditionally
import 'owl.carousel/dist/assets/owl.carousel.css'
import 'owl.carousel/dist/assets/owl.theme.default.css'
import CardPost from 'components/CardPost'

const { Text } = Typography
dayjs.extend(relativeTime)
dayjs.locale('vi')

const PostPTIT = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [OwlCarousel, setOwlCarousel] = useState(null)

  const { ptitPosts: posts, isError, isLoading, query } = useSelector(state => state.post)
  const { user } = useSelector(state => state.auth)

  const pageSizeContanst = 30

  // Import OwlCarousel dynamically
  useEffect(() => {
    // Ensure jQuery is loaded
    if (typeof window !== 'undefined') {
      if (!window.jQuery) {
        const script = document.createElement('script')
        script.src = 'https://code.jquery.com/jquery-3.6.0.min.js'
        script.onload = () => {
          // After jQuery is loaded, import OwlCarousel
          import('react-owl-carousel')
            .then(module => {
              setOwlCarousel(() => module.default)
            })
            .catch(err => {
              console.error('Failed to load OwlCarousel:', err)
            })
        }
        document.head.appendChild(script)
      } else {
        // jQuery already loaded, just import OwlCarousel
        import('react-owl-carousel')
          .then(module => {
            setOwlCarousel(() => module.default)
          })
          .catch(err => {
            console.error('Failed to load OwlCarousel:', err)
          })
      }
    }
  }, [])

  const fetchPost = useCallback(() => {
    dispatch(
      getPostPtitPagination({
        current: 1,
        pageSize: pageSizeContanst,
        query
      })
    )
  }, [dispatch, query])

  useEffect(() => {
    dispatch(resetPosts())
    fetchPost()
  }, [fetchPost, dispatch])

  const goDetail = _id => {
    navigate(`/post/${_id}/detail`)
  }

  const AuthButton = withAuth(Button)

  const formatPrice = price => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ'
  }

  const { handleGiftRequest } = useGiftRequest()

  // Owl Carousel options with autoplay
  const owlOptions = {
    items: 4,
    loop: true, // Changed to true to allow continuous looping
    margin: 16,
    nav: true,
    dots: false,
    autoplay: true, // Enable autoplay
    autoplayTimeout: 2000, // Time between slides in ms (2 seconds)
    autoplayHoverPause: true, // Pause on hover
    smartSpeed: 500, // Transition speed
    responsive: {
      0: {
        items: 1
      },
      576: {
        items: 2
      },
      768: {
        items: 3
      },
      992: {
        items: 4
      }
    }
  }

  const renderActionButton = item => {
    if (!user) {
      return item.type === 'gift' ? (
        <AuthButton
          icon={<GiftOutlined />}
          className={styles.actionButton}
          type="primary"
          danger
          onClick={() => handleGiftRequest(item, item.type)}
        >
          Nhận
        </AuthButton>
      ) : (
        <AuthButton
          icon={<SwapOutlined />}
          className={styles.actionButton}
          type="default"
          danger
          onClick={() => handleGiftRequest(item, item.type)}
        >
          Đổi
        </AuthButton>
      )
    }

    if (item.isRequested) {
      return (
        <Tooltip title={`Bạn ơi, chờ ${item.user_id?.name} xác nhận nhé!`}>
          <Button className={styles.actionButton} disabled>
            Đã yêu cầu
          </Button>
        </Tooltip>
      )
    }

    const isMe = item?.user_id?._id === user._id

    return (
      <Tooltip title={isMe ? 'Không thể thực hiện thao tác với bài đăng của bạn' : ''}>
        {item.type === 'gift' ? (
          <AuthButton
            icon={<GiftOutlined />}
            className={styles.actionButton}
            type="primary"
            danger
            disabled={isMe}
            onClick={() => handleGiftRequest(item, item.type)}
          >
            Nhận
          </AuthButton>
        ) : (
          <AuthButton
            icon={<SwapOutlined />}
            className={styles.actionButton}
            type="default"
            danger
            disabled={isMe}
            onClick={() => handleGiftRequest(item, item.type)}
          >
            Đổi
          </AuthButton>
        )}
      </Tooltip>
    )
  }

  const renderProducts = () => {
    if (isLoading || isError) {
      return (
        <div className={styles.itemsGrid}>
          {[...Array(4)].map((_, index) => (
            <PostCardSkeleton key={index} />
          ))}
        </div>
      )
    }

    if (!posts || posts.length === 0) {
      return !isLoading && <Empty description="Không tìm thấy bài đăng nào" className={styles.emptyState} />
    }

    if (OwlCarousel) {
      return (
        <OwlCarousel className="owl-theme" {...owlOptions}>
          {posts.map(item => (
            <div key={item._id} className={styles.owlItem}>
              {/* <Card
                className={`${styles.productCard} ${styles.glowingCard}`}
                cover={
                  <div className={styles.productImageContainer} onClick={() => goDetail(item._id)}>
                    <div
                      className={`${styles.discountBadge} ${
                        item.type === 'gift' ? styles.giftBadge : styles.exchangeBadge
                      }`}
                    >
                      {item.type === 'gift' ? 'Trao tặng' : 'Trao đổi'}
                    </div>
                    <img src={logoPtit} alt="logo_ptit" className={styles.logo_ptit} />
                    <img
                      loading="lazy"
                      alt={item.title}
                      src={getValidImageUrl(item.image_url) || '/placeholder.svg'}
                      onError={e => {
                        e.target.onerror = null
                        e.target.src = imageNotFound
                      }}
                      className={styles.productImage}
                    />
                  </div>
                }
              >
                <Tooltip title={item.title}>
                  <div className={styles.productName} onClick={() => goDetail(item._id)}>
                    {item.title}
                  </div>
                </Tooltip>

                {(item.salePrice || item.originalPrice) && (
                  <div className={styles.priceContainer}>
                    {item.salePrice && <div className={styles.salePrice}>{formatPrice(item.salePrice)}</div>}
                    {item.originalPrice && (
                      <div className={styles.originalPrice}>{formatPrice(item.originalPrice)}</div>
                    )}
                  </div>
                )}

                <div className={styles.locationRow}>
                  <div className={styles.userGroup}>
                    <Avatar size="small" className={styles.avtUser} src={getAvatarPostNews(item?.user_id)} />
                    <Text type="secondary" className={styles.time}>
                      {dayjs(item.created_at).isValid() ? dayjs(item.created_at).fromNow() : 'Không rõ thời gian'}
                    </Text>
                  </div>
                  {item?.city && (item.city.includes('Thành phố') || item.city.includes('Tỉnh')) ? (
                    <Text type="secondary" className={styles.location}>
                      <FaMapMarkerAlt style={{ marginRight: 4, fontSize: '14px' }} />
                      {item.city.split('Thành phố')[1] || item.city.split('Tỉnh')[1]}
                    </Text>
                  ) : (
                    item?.city && (
                      <Text type="secondary" className={styles.location}>
                        <FaMapMarkerAlt style={{ marginRight: 4, fontSize: '14px' }} />
                        {item.city}
                      </Text>
                    )
                  )}
                </div>

                <div className={styles.productFooter}>{renderActionButton(item)}</div>
              </Card> */}
              <CardPost item={item} />
            </div>
          ))}
        </OwlCarousel>
      )
    } else {
      // Fallback to grid view if OwlCarousel is not loaded
      return (
        <div className={styles.itemsGrid}>
          {posts.map(item => (
            // <Card
            //   key={item._id}
            //   className={`${styles.productCard} ${styles.glowingCard}`}
            //   cover={
            //     <div className={styles.productImageContainer} onClick={() => goDetail(item._id)}>
            //       <div
            //         className={`${styles.discountBadge} ${
            //           item.type === 'gift' ? styles.giftBadge : styles.exchangeBadge
            //         }`}
            //       >
            //         {item.type === 'gift' ? 'Trao tặng' : 'Trao đổi'}
            //       </div>
            //       <img src={logoPtit} alt="logo_ptit" className={styles.logo_ptit} />
            //       <img
            //         loading="lazy"
            //         alt={item.title}
            //         src={getValidImageUrl(item.image_url) || '/placeholder.svg'}
            //         onError={e => {
            //           e.target.onerror = null
            //           e.target.src = imageNotFound
            //         }}
            //         className={styles.productImage}
            //       />
            //     </div>
            //   }
            // >
            //   <Tooltip title={item.title}>
            //     <div className={styles.productName} onClick={() => goDetail(item._id)}>
            //       {item.title}
            //     </div>
            //   </Tooltip>

            //   {(item.salePrice || item.originalPrice) && (
            //     <div className={styles.priceContainer}>
            //       {item.salePrice && <div className={styles.salePrice}>{formatPrice(item.salePrice)}</div>}
            //       {item.originalPrice && <div className={styles.originalPrice}>{formatPrice(item.originalPrice)}</div>}
            //     </div>
            //   )}

            //   <div className={styles.locationRow}>
            //     <div className={styles.userGroup}>
            //       <Avatar size="small" className={styles.avtUser} src={getAvatarPostNews(item?.user_id)} />
            //       <Text type="secondary" className={styles.time}>
            //         {dayjs(item.created_at).isValid() ? dayjs(item.created_at).fromNow() : 'Không rõ thời gian'}
            //       </Text>
            //     </div>
            //     {item?.city && (item.city.includes('Thành phố') || item.city.includes('Tỉnh')) ? (
            //       <Text type="secondary" className={styles.location}>
            //         <FaMapMarkerAlt style={{ marginRight: 4, fontSize: '14px' }} />
            //         {item.city.split('Thành phố')[1] || item.city.split('Tỉnh')[1]}
            //       </Text>
            //     ) : (
            //       item?.city && (
            //         <Text type="secondary" className={styles.location}>
            //           <FaMapMarkerAlt style={{ marginRight: 4, fontSize: '14px' }} />
            //           {item.city}
            //         </Text>
            //       )
            //     )}
            //   </div>

            //   <div className={styles.productFooter}>{renderActionButton(item)}</div>
            // </Card>
            <CardPost item={item} />
          ))}
        </div>
      )
    }
  }

  return (
    <div className={styles.saleBannerContainer}>
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>góc ptit</h1>
      </div>

      {renderProducts()}
    </div>
  )
}

export default PostPTIT
