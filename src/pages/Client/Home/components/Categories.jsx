import React, { useCallback, useMemo, useRef } from 'react'
import { Row, Col, Card, Button } from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import styles from '../scss/Categories.module.scss'

import tatcadanhmuc from '../../../../assets/images/categories/danhmuctatca.jpg'
import batdongsan from '../../../../assets/images/categories/batdongsan.jpg'
import xeco from '../../../../assets/images/categories/xeco.jpg'
import dodientu from '../../../../assets/images/categories/dodientu.jpg'
import dogiadung from '../../../../assets/images/categories/dogiadung.jpg'
import mevabe from '../../../../assets/images/categories/domevabe.jpg'
import thucung from '../../../../assets/images/categories/thucung.jpg'
import thoitrang from '../../../../assets/images/categories/thoitrang.jpg'
import imgNotFound from 'assets/images/others/imagenotfound.jpg'
import tulanh from 'assets/images/categories/tulanh.jpg'
import doan from 'assets/images/categories/doan.jpg'
import giaitri from 'assets/images/categories/dochoi.jpg'

import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const imgCategory = [
  { title: 'Tất cả danh mục', image: tatcadanhmuc },
  { title: 'Bất động sản', image: batdongsan },
  { title: 'Xe cộ', image: xeco },
  { title: 'Đồ điện tử', image: dodientu },
  { title: 'Đồ gia dụng, nội thất, cây cảnh', image: dogiadung },
  { title: 'Tủ lạnh, máy giặt, điều hòa', image: tulanh },
  { title: 'Mẹ và bé', image: mevabe },
  { title: 'Thời trang', image: thoitrang },
  { title: 'Thú cưng', image: thucung },
  { title: 'Đồ ăn, thực phẩm', image: doan },
  { title: 'Giải trí, thể thao', image: giaitri }
]

const Categories = () => {
  const { categories: cate } = useSelector(state => state.category)
  const scrollContainerRef = useRef(null)
  const navigate = useNavigate()

  const proccessedCategory = useMemo(() => {
    const mappedCategory = cate.map(cate => {
      const matchingImg = imgCategory.find(imgItem => imgItem.title === cate.name)
      return {
        category_id: cate._id,
        title: cate.name,
        image: matchingImg ? matchingImg.image : imgNotFound
      }
    })

    return [
      {
        category_id: 'all',
        title: 'Tất cả danh mục',
        image: imgCategory[0].image
      },
      ...mappedCategory
    ]
  }, [cate])

  const scroll = useCallback(direction => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400

      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      })
    }
  }, [])

  const goPostFilter = useCallback(
    id => {
      navigate(`/post/category/${id}`)
    },
    [navigate]
  )

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
            {proccessedCategory.map((category, index) => (
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
