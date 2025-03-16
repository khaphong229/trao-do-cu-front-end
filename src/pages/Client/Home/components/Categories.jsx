import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Row, Col, Card, Button } from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import styles from '../scss/Categories.module.scss'

import tatcadanhmuc from 'assets/images/categories/danhmuctatca.webp'
import xeco from 'assets/images/categories/xeco.webp'
import dodientu from 'assets/images/categories/dodientu.webp'
import dogiadung from 'assets/images/categories/dogiadung.webp'
import mevabe from 'assets/images/categories/domevabe.webp'
import thucung from 'assets/images/categories/thucung.webp'
import thoitrang from 'assets/images/categories/thoitrang.webp'
import imgNotFound from 'assets/images/others/imagenotfound.webp'
import tulanh from 'assets/images/categories/tulanh.webp'
import doan from 'assets/images/categories/doan.webp'
import giaitri from 'assets/images/categories/dochoi.webp'
import hoctap from 'assets/images/categories/hoctap.webp'

import { useNavigate } from 'react-router-dom'
import { getCategories } from 'utils/localStorageUtils'
import { useDispatch } from 'react-redux'
import { getAllCategory } from 'features/client/category/categoryThunks'
import { setCategory } from 'features/client/category/categorySlice'

const imgCategory = [
  { title: 'Tất cả danh mục', image: tatcadanhmuc },
  { title: 'Xe cộ', image: xeco },
  { title: 'Đồ điện tử', image: dodientu },
  { title: 'Đồ gia dụng, nội thất, cây cảnh', image: dogiadung },
  { title: 'Tủ lạnh, máy giặt, điều hòa', image: tulanh },
  { title: 'Mẹ và bé', image: mevabe },
  { title: 'Thời trang', image: thoitrang },
  { title: 'Thú cưng', image: thucung },
  { title: 'Đồ ăn, thực phẩm', image: doan },
  { title: 'Giải trí, thể thao', image: giaitri },
  { title: 'Học tập', image: hoctap }
]

// Dữ liệu mặc định ban đầu
const initialDefaultCategory = [
  {
    category_id: '67c6c553f83ba5fb6ecfa97a',
    title: 'Học tập'
  },
  {
    category_id: '67852bfc6ee1505482c7252c',
    title: 'Đồ điện tử'
  },
  {
    category_id: '67852bd46ee1505482c72513',
    title: 'Xe cộ'
  },
  {
    category_id: '67852d2a6ee1505482c725ce',
    title: 'Thời trang'
  },
  {
    category_id: '67852e346ee1505482c72679',
    title: 'Đồ ăn, thực phẩm'
  },
  {
    category_id: '67852d736ee1505482c725fe',
    title: 'Thú cưng'
  },
  {
    category_id: '67852e9c6ee1505482c726cc',
    title: 'Giải trí, thể thao'
  },
  {
    category_id: '67852c896ee1505482c72562',
    title: 'Đồ gia dụng, nội thất, cây cảnh'
  },
  {
    category_id: '67852ce66ee1505482c72589',
    title: 'Tủ lạnh, máy giặt, điều hòa'
  },
  {
    category_id: '67852d086ee1505482c725ae',
    title: 'Mẹ và bé'
  }
]

const Categories = () => {
  const scrollContainerRef = useRef(null)
  const navigate = useNavigate()
  // Khởi tạo state với dữ liệu mặc định
  const [dataDefaultCategory, setDataDefaultCategory] = useState(initialDefaultCategory)
  const dispatch = useDispatch()

  useEffect(() => {
    const categoriesLocal = getCategories()
    if (categoriesLocal.length === 0) {
      dispatch(getAllCategory())
    } else {
      dispatch(setCategory(categoriesLocal))

      // Chỉ cập nhật dataDefaultCategory nếu có dữ liệu từ localStorage
      if (categoriesLocal && categoriesLocal.length > 0) {
        const dataProcess = categoriesLocal
          .map(item => ({
            category_id: item._id,
            title: item.name
          }))
          .filter(item => item.name !== 'Tất cả')

        setDataDefaultCategory(dataProcess)
      }
    }
  }, [dispatch])

  const proccessedCategory = useMemo(() => {
    const mappedCategory = dataDefaultCategory.map(cate => {
      const matchingImg = imgCategory.find(imgItem => imgItem.title === cate.title)
      return {
        category_id: cate.category_id,
        title: cate.title,
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
  }, [dataDefaultCategory])

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
