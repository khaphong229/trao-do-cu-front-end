import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Avatar, Carousel } from 'antd'
import { StarFilled, StarOutlined } from '@ant-design/icons'
import styles from '../scss/ReviewUser.module.scss'
import danh from 'assets/images/review/đanh.jpg'
import tlinh from 'assets/images/review/tlinh.jpg'
import hoa from 'assets/images/review/hoa.jpg'
import lien from 'assets/images/review/lien.jpg'
const ReviewUser = () => {
  // Sample testimonial data
  const testimonials = [
    {
      id: 1,
      name: 'Hoàng Thị Hoa',
      avatar: hoa,
      text: 'Mình rất thích trang web này! Trước đây mình thường vứt đồ cũ đi, nhưng giờ có thể tìm được người cần chúng. Giao diện dễ dùng, chỉ mất vài phút để đăng tin.',
      rating: 5
    },
    {
      id: 2,
      name: 'Phạm Đức Anh',
      avatar: danh,
      text: 'Tôi đã nhận được rất nhiều món đồ hữu ích như sách và đồ gia dụng mà không tốn chi phí. Cảm ơn traodocu.vn vì đã giúp tôi tiết kiệm và góp phần bảo vệ môi trường!"',
      rating: 5
    },
    {
      id: 4,
      name: 'Tống Diệu Linh',
      avatar: tlinh,
      text: 'Ý tưởng rất hay, nhưng đôi khi có người đăng bài nhưng không phản hồi khi mình nhắn tin. Nếu có hệ thống xác thực người dùng thì sẽ tốt hơn!',
      rating: 4
    },
    {
      id: 5,
      name: 'Đỗ Thị Liên',
      avatar: lien,
      text: 'Mình đã thử trao đổi vài món đồ nhưng có chút khó khăn khi sắp xếp thời gian gặp mặt. Nếu có hỗ trợ vận chuyển thì sẽ tiện lợi hơn!',
      rating: 5
    }
  ]

  const [isMobile, setIsMobile] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Auto-slide effect for desktop view
  useEffect(() => {
    if (!isMobile) {
      const interval = setInterval(() => {
        setActiveIndex(prevIndex => (prevIndex + 1) % testimonials.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [isMobile, testimonials.length])

  // Render stars based on rating
  const renderStars = rating => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<StarFilled key={i} className="star-icon filled" style={{ color: '#FFD700' }} />)
      } else {
        stars.push(<StarOutlined key={i} className="star-icon" style={{ color: '#FFD700' }} />)
      }
    }
    return stars
  }

  // Desktop view with auto-scroll
  const renderDesktopView = () => {
    const visibleTestimonials = testimonials.slice(activeIndex, activeIndex + 3)
    // If we need more items to fill the view, take from the beginning
    if (visibleTestimonials.length < 3) {
      const remainingCount = 3 - visibleTestimonials.length
      visibleTestimonials.push(...testimonials.slice(0, remainingCount))
    }

    return (
      <div className={styles['testimonials-desktop']}>
        <Row gutter={[24, 24]} className={styles['testimonial-row']}>
          {visibleTestimonials.map((testimonial, index) => (
            <Col
              xs={24}
              sm={24}
              md={8}
              key={`${testimonial.id}-${activeIndex}`}
              className={`${styles['testimonial-col']} ${index === 1 ? styles['active'] : ''}`}
            >
              <Card className={`${styles['testimonial-card']} ${index === 1 ? styles['active'] : ''}`} bordered={false}>
                <div className={styles['testimonial-avatar']}>
                  <Avatar size={60} src={testimonial.avatar} />
                </div>
                <h3 className={styles['testimonial-name']}>{testimonial.name}</h3>
                <div className={styles.rating}>{renderStars(testimonial.rating)}</div>
                <p className={styles['testimonial-text']}>{testimonial.text}</p>
              </Card>
            </Col>
          ))}
        </Row>
        <div className={styles['testimonial-dots']}>
          {testimonials.map((_, index) => (
            <span
              key={index}
              className={`${styles.dot} ${index === activeIndex ? styles.active : ''}`}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </div>
    )
  }

  // Mobile view with carousel
  const renderMobileView = () => {
    return (
      <Carousel autoplay dots={true} autoplaySpeed={5000} className={styles['testimonials-carousel']}>
        {testimonials.map(testimonial => (
          <div key={testimonial.id}>
            <Card className={`${styles['testimonial-card']} ${styles.mobile}`} bordered={false}>
              <div className={styles['testimonial-avatar']}>
                <Avatar size={50} src={testimonial.avatar} />
              </div>
              <h3 className={styles['testimonial-name']}>{testimonial.name}</h3>
              <div className={styles.rating}>{renderStars(testimonial.rating)}</div>
              <p className={styles['testimonial-text']}>{testimonial.text}</p>
            </Card>
          </div>
        ))}
      </Carousel>
    )
  }

  return (
    <div className={styles['testimonials-container']}>
      <div className={styles['testimonials-header']}>
        <h2>Phản hồi của người dùng</h2>
        <div className={styles['header-underline']}></div>
        <p className={styles['header-description']}>
          🎁 Hơn 1.000 món đồ đã được trao đi thành công <br /> 👥 Cộng đồng 5.000+ thành viên tích cực <br /> 🌱 Tiết
          kiệm nghìn đồ dùng, tấn rác thả mỗi năm, góp phần bảo vệ môi trường
        </p>
      </div>

      {isMobile ? renderMobileView() : renderDesktopView()}

      <div className={`${styles['bg-shape']} ${styles['shape-1']}`}></div>
      <div className={`${styles['bg-shape']} ${styles['shape-2']}`}></div>
      <div className={`${styles['bg-shape']} ${styles['shape-3']}`}></div>
      <div className={`${styles['bg-shape']} ${styles['shape-4']}`}></div>
    </div>
  )
}

export default ReviewUser
