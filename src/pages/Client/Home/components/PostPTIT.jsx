import React, { useEffect, useCallback, useState, useRef } from 'react'
import { Button, Empty, Row, Col } from 'antd'
import { RightOutlined } from '@ant-design/icons'
import styles from '../scss/PostPTIT.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { getPostPtitPagination } from 'features/client/post/postThunks'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/vi'
import PostCardSkeleton from 'components/common/Skeleton/PostCardSkeleton'
// Import OwlCarousel conditionally
import 'owl.carousel/dist/assets/owl.carousel.css'
import 'owl.carousel/dist/assets/owl.theme.default.css'
import CardPost from 'components/CardPost'

dayjs.extend(relativeTime)
dayjs.locale('vi')

const PostPTIT = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [OwlCarousel, setOwlCarousel] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLastPage, setIsLastPage] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const owlCarouselRef = useRef(null)
  const allLoadedPosts = useRef([])

  const { ptitPosts, isErrorPtit, isLoadingPtit, query, total } = useSelector(state => state.post)

  const pageSizeConstant = 8

  // Calculate max pages based on total
  const maxPages = Math.ceil(total / pageSizeConstant) || 1

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

  const fetchPost = useCallback(
    (page = 1) => {
      setIsLoadingMore(page > 1)
      dispatch(
        getPostPtitPagination({
          current: page,
          pageSize: pageSizeConstant,
          query
        })
      )
    },
    [dispatch, query]
  )

  // Handle pagination and append new posts to existing ones
  useEffect(() => {
    if (!isLoadingPtit && ptitPosts) {
      if (currentPage === 1) {
        allLoadedPosts.current = [...ptitPosts]
      } else {
        // Filter out duplicates by ID
        const existingPostIds = new Set(allLoadedPosts.current.map(post => post._id))
        const uniqueNewPosts = ptitPosts.filter(post => !existingPostIds.has(post._id))

        allLoadedPosts.current = [...allLoadedPosts.current, ...uniqueNewPosts]
      }
      setIsLoadingMore(false)

      // Check if we've reached the last page
      setIsLastPage(currentPage >= maxPages)
    }
  }, [ptitPosts, isLoadingPtit, currentPage, maxPages])

  // Initial fetch on mount
  useEffect(() => {
    setCurrentPage(1)
    fetchPost(1)
  }, [fetchPost, dispatch])

  // Function to handle post request completion
  const handleRequestComplete = useCallback(() => {
    // Refresh the posts data
    fetchPost(1)
  }, [fetchPost])

  const viewAllPosts = () => {
    navigate('/post/category/ptit')
  }

  // Handler for carousel events to detect when to load more
  const handleCarouselChange = useCallback(
    event => {
      if (!owlCarouselRef.current || isLoadingMore || isLastPage) return

      const carousel = owlCarouselRef.current
      if (!carousel) return

      // Get current item index and total items
      const currentIndex = event.item.index
      const totalItems = event.item.count

      // If we're near the end (last 3 items), load more posts
      if (currentIndex >= totalItems - 3 && currentPage < maxPages) {
        const nextPage = currentPage + 1
        setCurrentPage(nextPage)
        fetchPost(nextPage)
      }
    },
    [currentPage, fetchPost, isLastPage, isLoadingMore, maxPages]
  )

  // Updated Owl Carousel options with fixed 2 items for mobile and event binding
  const owlOptions = {
    items: 4,
    margin: 14,
    nav: true,
    dots: false,
    // autoplay: true, // Disabled autoplay to make pagination work better
    // autoplayTimeout: 2000,
    smartSpeed: 500,
    responsive: {
      0: {
        items: 2
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
    },
    onChanged: handleCarouselChange
  }

  const renderProducts = () => {
    if ((isLoadingPtit && currentPage === 1) || isErrorPtit) {
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

    if (!allLoadedPosts.current || allLoadedPosts.current.length === 0) {
      return !isLoadingPtit && <Empty description="Không tìm thấy bài đăng nào" className={styles.emptyState} />
    }

    if (OwlCarousel) {
      return (
        <OwlCarousel className="owl-theme" {...owlOptions} ref={ref => (owlCarouselRef.current = ref)}>
          {allLoadedPosts.current.map(item => (
            <div key={item._id} className={styles.owlItem}>
              <CardPost item={item} onRequestComplete={handleRequestComplete} />
            </div>
          ))}
          {isLoadingMore && (
            <div className={styles.owlItem}>
              <PostCardSkeleton isPtit={true} />
            </div>
          )}
        </OwlCarousel>
      )
    } else {
      // Fallback to Ant Design Row/Col grid view - always 2 items on mobile
      return (
        <Row gutter={[16, 16]}>
          {allLoadedPosts.current.map(item => (
            <Col xs={12} sm={12} md={8} lg={6} key={item._id}>
              <CardPost item={item} onRequestComplete={handleRequestComplete} />
            </Col>
          ))}
          {isLoadingMore && (
            <>
              {[...Array(2)].map((_, index) => (
                <Col xs={12} sm={12} md={8} lg={6} key={`loading-${index}`}>
                  <PostCardSkeleton />
                </Col>
              ))}
            </>
          )}
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
