import { useEffect, useState } from 'react'
import { Button, Card } from 'antd'
import styles from '../scss/UserSurvey.module.scss'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getAllCategory } from 'features/client/category/categoryThunks'
import { CheckCircle } from 'lucide-react' // Assuming you're using lucide-react

export default function SurveyForm() {
  const [selectedTags, setSelectedTags] = useState([])
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { categories: cate } = useSelector(state => state.category)

  useEffect(() => {
    if (cate.length === 0) {
      dispatch(getAllCategory())
    }
  }, [dispatch, cate.length])

  // Use categories directly without assigning random colors
  const categories = cate.map(itemCate => ({
    category_id: itemCate._id,
    name: itemCate.name
  }))

  const getCategoryIcon = categoryName => {
    const iconMap = {
      'Bất động sản': '🏠',
      'Xe cộ': '🛵',
      'Đồ điện tử': '📱',
      'Đồ gia dụng, nội thất, cây cảnh': '🖼',
      'Tủ lạnh, máy giặt, điều hòa': '🛁',
      'Mẹ và bé': '👶',
      'Thời trang': '👗',
      'Thú cưng': '🐶',
      'Đồ ăn, thực phẩm': '🍕',
      'Giải trí, thể thao': '🤾',
      'Tất cả': '✔️'
    }

    return iconMap[categoryName] || '📦'
  }

  const handleTagSelect = cate => {
    const isSelected = selectedTags.some(tag => tag.category_id === cate.category_id)

    if (isSelected) {
      setSelectedTags(selectedTags.filter(tag => tag.category_id !== cate.category_id))
    } else {
      setSelectedTags([...selectedTags, cate])
    }
  }

  return (
    <div className={styles.survey}>
      <div className={styles.survey__container}>
        {/* Left Column - Survey Info */}
        <div className={styles.survey__info}>
          <h1 className={styles['survey__info-title']}>Khám phá sở thích của bạn</h1>
          <p className={styles['survey__info-subtitle']}>Tìm kiếm sản phẩm phù hợp dựa trên sở thích cá nhân</p>
          <div className={styles['survey__info-description']}>
            <p>
              Chào mừng bạn đến với khảo sát người dùng của chúng tôi. Bằng cách chia sẻ sở thích của bạn, chúng tôi có
              thể giúp bạn kết nối với những người có cùng mối quan tâm và tìm kiếm sản phẩm phù hợp nhất với nhu cầu
              của bạn.
            </p>
            <p>Hãy chọn những danh mục bạn quan tâm nhất để bắt đầu hành trình khám phá!</p>
          </div>
          {/* Placeholder for an illustration or image */}
          <div className={styles['survey__info-image-container']}>{/* You could add an image here */}</div>
        </div>

        {/* Right Column - Survey Form */}
        <Card className={styles.survey__card}>
          {/* <div className={styles.survey__header}>
            <div className={styles['survey__header-content']}>
              <h2 className={styles.survey__title}>Khảo sát người dùng</h2>
              <p className={styles.survey__subtitle}>
                Hãy chia sẻ thông tin để chúng tôi có thể tìm kiếm người cùng sở thích với bạn
              </p>
            </div>
          </div> */}

          <div className={styles['survey__step-content']}>
            <div className={styles.survey__field}>
              <label className={styles.survey__label}>
                Bạn quan tâm đến loại đồ nào?
                <span className={styles['survey__label-hint']}>Chọn một hoặc nhiều danh mục</span>
              </label>
              <div className={styles.survey__categories}>
                {categories.map(category => (
                  <div
                    key={category.category_id || category.name}
                    className={`${styles.survey__category} ${
                      selectedTags.some(tag => tag.category_id === category.category_id)
                        ? styles['survey__category--selected']
                        : ''
                    }`}
                    onClick={() => handleTagSelect(category)}
                  >
                    <span className={styles['survey__category-icon']}>{getCategoryIcon(category.name)}</span>
                    <span className={styles['survey__category-name']}>{category.name}</span>
                    <CheckCircle size={14} className={styles['survey__category-check']} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.survey__actions}>
            <Button
              className={`${styles.survey__button} ${styles['survey__button--back']}`}
              onClick={() => navigate('/')}
              danger={true}
            >
              Bỏ qua
            </Button>
            <Button
              type="primary"
              className={`${styles.survey__button} ${styles['survey__button--next']}`}
              onClick={() => {
                navigate('/')
              }}
              disabled={selectedTags.length === 0}
            >
              Hoàn thành
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
