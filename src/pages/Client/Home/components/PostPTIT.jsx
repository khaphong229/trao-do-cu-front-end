import React, { useEffect, useCallback, useState } from 'react'
import { Button, Typography, Empty, Row, Col } from 'antd'
import { RightOutlined } from '@ant-design/icons'
import styles from '../scss/PostPTIT.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { getPostPtitPagination } from 'features/client/post/postThunks'
import { resetPosts } from 'features/client/post/postSlice'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/vi'
import PostCardSkeleton from 'components/common/Skeleton/PostCardSkeleton'
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

  const { ptitPosts, isError, isLoading, query } = useSelector(state => state.post)

  const pageSizeContanst = 8

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

  // Function to handle post request completion
  const handleRequestComplete = useCallback(() => {
    // Refresh the posts data
    fetchPost()
  }, [fetchPost])

  useEffect(() => {
    dispatch(resetPosts())
    fetchPost()
  }, [fetchPost, dispatch])

  const viewAllPosts = () => {
    navigate('/post/category/ptit')
  }

  // Updated Owl Carousel options with fixed 2 items for mobile
  const owlOptions = {
    items: 4,
    loop: true,
    margin: 16,
    nav: true,
    dots: false,
    autoplay: true,
    autoplayTimeout: 2000,
    autoplayHoverPause: true,
    smartSpeed: 500,
    responsive: {
      0: {
        items: 2 // Changed from 1 to 2 for mobile phones
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

  const renderProducts = () => {
    if (isLoading || isError) {
      return (
        <Row gutter={[16, 16]}>
          {[...Array(4)].map((_, index) => (
            <Col xs={12} sm={12} md={8} lg={6} key={index}>
              <PostCardSkeleton />
            </Col>
          ))}
        </Row>
      )
    }

    if (!ptitPosts || ptitPosts.length === 0) {
      return !isLoading && <Empty description="Không tìm thấy bài đăng nào" className={styles.emptyState} />
    }

    if (OwlCarousel) {
      return (
        <OwlCarousel className="owl-theme" {...owlOptions}>
          {ptitPosts.map(item => (
            <div key={item._id} className={styles.owlItem}>
              <CardPost item={item} onRequestComplete={handleRequestComplete} />
            </div>
          ))}
        </OwlCarousel>
      )
    } else {
      // Fallback to Ant Design Row/Col grid view - always 2 items on mobile
      return (
        <Row gutter={[16, 16]}>
          {ptitPosts.map(item => (
            <Col xs={12} sm={12} md={8} lg={6} key={item._id}>
              <CardPost item={item} onRequestComplete={handleRequestComplete} />
            </Col>
          ))}
        </Row>
      )
    }
  }

  return (
    <div className={styles.saleBannerContainer}>
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>góc ptit</h1>
      </div>

      {renderProducts()}

      <div className={styles.viewAllButtonContainer}>
        <Button
          type="default"
          size="middle"
          danger
          icon={<RightOutlined />}
          onClick={viewAllPosts}
          className={styles.viewAllButton}
        >
          Xem tất cả
        </Button>
      </div>
    </div>
  )
}

export default PostPTIT
