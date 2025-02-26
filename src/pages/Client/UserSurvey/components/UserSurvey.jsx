import { useEffect, useState } from 'react'
import { Button, Card, message } from 'antd'
import styles from '../scss/UserSurvey.module.scss'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getAllCategory } from 'features/client/category/categoryThunks'
import { CheckCircle } from 'lucide-react'
import { updateSurvey } from 'features/client/Survey/surveyThunks'

export default function SurveyForm() {
  const [selectedTags, setSelectedTags] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { survey } = useSelector(state => state.survey)
  const { categories: cate } = useSelector(state => state.category)

  // Lấy danh mục từ API nếu chưa có dữ liệu
  useEffect(() => {
    if (cate.length === 0) {
      dispatch(getAllCategory())
    }
  }, [dispatch, cate.length])

  // Load danh mục đã chọn từ survey vào state
  useEffect(() => {
    if (survey.data?.interests?.length > 0 && cate.length > 0) {
      const userSelectedCategories = survey.data.interests
        .map(item => {
          // Trích xuất ID thực sự từ đối tượng hoặc dùng trực tiếp nếu là string
          const categoryId =
            typeof item.category_id === 'object' && item.category_id._id ? item.category_id._id : item.category_id

          const foundCategory = cate.find(c => c._id === categoryId)
          return foundCategory
            ? {
                category_id: foundCategory._id,
                category_name: foundCategory.name
              }
            : null
        })
        .filter(cat => cat !== null)

      setSelectedTags(userSelectedCategories)
    }
  }, [survey.data, cate])

  // Danh sách danh mục hiển thị
  const categories = cate.map(itemCate => ({
    category_id: itemCate._id,
    category_name: itemCate.name
  }))

  // Lấy icon theo danh mục
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

  // Chọn/bỏ chọn danh mục
  const handleTagSelect = category => {
    setSelectedTags(prev =>
      prev.some(tag => tag.category_id === category.category_id)
        ? prev.filter(tag => tag.category_id !== category.category_id)
        : [...prev, category]
    )
  }

  // Xử lý gửi lên API - cách tiếp cận hoàn toàn mới
  const handleSubmit = async () => {
    if (selectedTags.length === 0) {
      message.warning('Vui lòng chọn ít nhất một danh mục')
      return
    }

    try {
      setIsSubmitting(true)

      // Tạo mảng interests với format đơn giản nhất có thể
      const interests = selectedTags.map(tag => ({
        category_id: tag.category_id,
        category_name: tag.category_name,
        selected_at: new Date().toISOString()
      }))

      console.log('🚀 Dữ liệu trước khi gửi:', interests)

      // Kiểm tra cấu trúc dữ liệu interests để debug
      console.log('📊 Kiểm tra cấu trúc:')
      interests.forEach((item, index) => {
        console.log(`- Item ${index}:`)
        console.log(`  category_id type: ${typeof item.category_id}`)
        console.log(`  category_id value: ${item.category_id}`)
      })

      // Tạo payload theo cấu trúc mới
      const payload = {
        interests: interests
      }

      const result = await dispatch(updateSurvey(payload)).unwrap()

      if (result) {
        message.success('Đã lưu sở thích của bạn thành công!')
        navigate('/')
      }
    } catch (error) {
      message.error('Có lỗi xảy ra khi lưu sở thích: ' + (error?.message || 'Không xác định'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.survey}>
      <div className={styles.survey__container}>
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
        </div>

        <Card className={styles.survey__card}>
          <div className={styles['survey__step-content']}>
            <div className={styles.survey__field}>
              <label className={styles.survey__label}>
                Bạn quan tâm đến loại đồ nào?
                <span className={styles['survey__label-hint']}>Chọn một hoặc nhiều danh mục</span>
              </label>
              <div className={styles.survey__categories}>
                {categories.map(category => (
                  <div
                    key={category.category_id}
                    className={`${styles.survey__category} ${selectedTags.some(tag => tag.category_id === category.category_id) ? styles['survey__category--selected'] : ''}`}
                    onClick={() => handleTagSelect(category)}
                  >
                    <span className={styles['survey__category-icon']}>{getCategoryIcon(category.category_name)}</span>
                    <span className={styles['survey__category-name']}>{category.category_name}</span>
                    <CheckCircle size={14} className={styles['survey__category-check']} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.survey__actions}>
            <Button onClick={() => navigate('/')} danger={true}>
              Bỏ qua
            </Button>
            <Button type="primary" onClick={handleSubmit} disabled={selectedTags.length === 0} loading={isSubmitting}>
              Hoàn thành
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
