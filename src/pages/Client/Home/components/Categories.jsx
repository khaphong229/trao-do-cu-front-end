import React, { useRef } from 'react'
import { Row, Col, Card, Button } from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import styles from '../scss/Categories.module.scss'

import tatcadanhmuc from '../../../../assets/images/categories/danhmuctatca.jpg'
import batdongsan from '../../../../assets/images/categories/batdongsan.jpg'
import xeco from '../../../../assets/images/categories/xeco.jpg'
import dodientu from '../../../../assets/images/categories/dodientu.jpg'
import dogiadung from '../../../../assets/images/categories/dogiadung.jpg'
import giaitri from '../../../../assets/images/categories/dogiaitri.jpg'
import mevabe from '../../../../assets/images/categories/domevabe.jpg'
import thucung from '../../../../assets/images/categories/thucung.jpg'
import thoitrang from '../../../../assets/images/categories/thoitrang.jpg'

import { useNavigate } from 'react-router-dom'

const Categories = () => {
  const categories = [
    { category_id: 'all', title: 'Tất cả danh mục', image: tatcadanhmuc },
    { category_id: '675ed6b7fe4a47fe5de068b6', title: 'Bất động sản', image: batdongsan },
    { category_id: '675b08f6a40aa8fbb535a8d4', title: 'Xe cộ', image: xeco },
    { category_id: '675becf9aed9b9b7ae396659', title: 'Đồ điện tử', image: dodientu },
    { category_id: '675ed6d7fe4a47fe5de068c6', title: 'Đồ gia dụng', image: dogiadung },
    { category_id: '67622645db41240c20cb41ad', title: 'Giải trí', image: giaitri },
    { category_id: '675ed708fe4a47fe5de068e5', title: 'Mẹ và bé', image: mevabe },
    { category_id: '675ed65afe4a47fe5de0688d', title: 'Thú cưng', image: thucung },
    { category_id: '6760eb34b7c773d17130eed3', title: 'Thời trang', image: thoitrang }
  ]

  const scrollContainerRef = useRef(null)

  const scroll = direction => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400

      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const navigate = useNavigate()
  const goPostFilter = id => {
    navigate(`/post/category/${id}`)
  }

  return (
    <div className={styles.ContentWrap}>
      <span className={styles.title}>Khám phá danh mục</span>
      <div className={styles.scrollContainer}>
        <Button
          variant="filled"
          size="small"
          className={`${styles.navButton} ${styles.left}`}
          onClick={() => scroll('left')}
        >
          <LeftOutlined />
        </Button>

        <div className={styles.scrollWrapper}>
          <Row ref={scrollContainerRef} className={styles.categoriesRow} wrap={false}>
            {categories.map((category, index) => (
              <Col key={index} span={4}>
                <Card className={styles.cardItem}>
                  <img
                    onClick={() => goPostFilter(category.category_id)}
                    src={category.image}
                    alt={`${category.title} ${index}`}
                    className={styles.imageCategory}
                  />
                  <div className={styles.titleCategory}>{category.title}</div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        <Button
          variant="filled"
          size="small"
          className={`${styles.navButton} ${styles.right}`}
          onClick={() => scroll('right')}
        >
          <RightOutlined />
        </Button>
      </div>
    </div>
  )
}

export default Categories
