import { useState } from 'react'
import { SearchOutlined, CheckCircleOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Input, Switch, Button, Card } from 'antd'
import styles from '../scss/UserSurvey.module.scss'

export default function SurveyForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedTags, setSelectedTags] = useState([])
  const [selectedAreas, setSelectedAreas] = useState([])

  const categories = [
    { name: 'Quần áo', color: 'yellow' },
    { name: 'Đồ điện tử', color: 'blue' },
    { name: 'Sách', color: 'green' },
    { name: 'Nội thất', color: 'purple' },
    { name: 'Đồ gia dụng', color: 'pink' },
    { name: 'Đồ chơi', color: 'orange' }
  ]

  const areas = ['Hà Nội', 'TP.HCM', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ', 'Nha Trang']

  const handleTagSelect = tag => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag))
    } else if (selectedTags.length < 3) {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const handleAreaSelect = area => {
    if (selectedAreas.includes(area)) {
      setSelectedAreas(selectedAreas.filter(a => a !== area))
    } else if (selectedAreas.length < 3) {
      setSelectedAreas([...selectedAreas, area])
    }
  }

  return (
    <div className={styles.survey}>
      <Card className={styles.survey__card}>
        <div className={styles.survey__header}>
          <div className={styles['survey__header-content']}>
            <h2 className={styles.survey__title}>Khảo sát người dùng</h2>
            <p className={styles.survey__subtitle}>
              {currentStep === 3
                ? 'Cảm ơn bạn đã tham gia khảo sát'
                : 'Hãy chia sẻ thông tin để chúng tôi có thể tìm kiếm người cùng sở thích với bạn'}
            </p>
          </div>
          <div className={styles['survey__step-indicator']}>
            <span className={styles['survey__step-number']}>{currentStep}</span>
            <span className={styles['survey__step-total']}>/3</span>
          </div>
        </div>

        <div className={styles.survey__progress}>
          <div className={styles['survey__progress-bar']} style={{ width: `${(currentStep / 3) * 100}%` }} />
        </div>

        {currentStep === 1 && (
          <div className={styles['survey__step-content']}>
            <div className={styles.survey__field}>
              <label className={styles.survey__label}>
                Bạn đang sống tại đâu?
                <span className={styles['survey__label-hint']}>Chọn địa điểm hiện tại của bạn</span>
              </label>
              <div className={styles.survey__search}>
                <SearchOutlined className={styles['survey__search-icon']} />
                <Input placeholder="Tìm kiếm địa điểm..." />
              </div>
            </div>

            <div className={styles.survey__field}>
              <label className={styles.survey__label}>
                Khu vực bạn muốn trao đổi đồ?
                <span className={styles['survey__label-hint']}>Chọn tối đa 3 khu vực</span>
              </label>
              <div className={styles.survey__tags}>
                {areas.map(area => (
                  <div
                    key={area}
                    className={`${styles.survey__tag} ${
                      selectedAreas.includes(area) ? styles['survey__tag--selected'] : ''
                    }`}
                    onClick={() => handleAreaSelect(area)}
                  >
                    <span className={styles['survey__tag-text']}>{area}</span>
                    {selectedAreas.includes(area) && <CheckCircleOutlined className={styles['survey__tag-icon']} />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className={styles['survey__step-content']}>
            <div className={styles.survey__field}>
              <label className={styles.survey__label}>
                Bạn quan tâm đến loại đồ nào?
                <span className={styles['survey__label-hint']}>Chọn tối đa 3 loại</span>
              </label>
              <div className={styles.survey__categories}>
                {categories.map(category => (
                  <div
                    key={category.name}
                    className={`${styles.survey__category} ${styles[`survey__category--${category.color}`]} ${
                      selectedTags.includes(category.name) ? styles['survey__category--selected'] : ''
                    }`}
                    onClick={() => handleTagSelect(category.name)}
                  >
                    <span className={styles['survey__category-name']}>{category.name}</span>
                    {selectedTags.includes(category.name) && (
                      <CheckCircleOutlined className={styles['survey__category-check']} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.survey__field}>
              <label className={styles.survey__label}>
                Hình thức trao đổi mong muốn
                <span className={styles['survey__label-hint']}>Chọn một hoặc nhiều hình thức</span>
              </label>
              <div className={styles.survey__switches}>
                <div className={`${styles['survey__switch-item']} ${styles['survey__switch-item--large']}`}>
                  <div className={styles['survey__switch-info']}>
                    <div className={styles['survey__switch-content']}>
                      <span className={styles['survey__switch-text']}>Trao đổi đồ</span>
                      <span className={styles['survey__switch-description']}>Trao đổi đồ với người khác</span>
                    </div>
                  </div>
                  <Switch />
                </div>
                <div className={`${styles['survey__switch-item']} ${styles['survey__switch-item--large']}`}>
                  <div className={styles['survey__switch-info']}>
                    <div className={styles['survey__switch-content']}>
                      <span className={styles['survey__switch-text']}>Tặng đồ</span>
                      <span className={styles['survey__switch-description']}>Tặng đồ cho người khác</span>
                    </div>
                  </div>
                  <Switch />
                </div>
                <div className={`${styles['survey__switch-item']} ${styles['survey__switch-item--large']}`}>
                  <div className={styles['survey__switch-info']}>
                    <div className={styles['survey__switch-content']}>
                      <span className={styles['survey__switch-text']}>Nhận đồ</span>
                      <span className={styles['survey__switch-description']}>Nhận đồ từ người khác</span>
                    </div>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={styles.survey__actions}>
          <Button
            className={`${styles.survey__button} ${styles['survey__button--back']}`}
            icon={<LeftOutlined />}
            onClick={() => setCurrentStep(currentStep - 1)}
            disabled={currentStep === 1}
          >
            Quay lại
          </Button>
          <Button
            type="primary"
            className={`${styles.survey__button} ${styles['survey__button--next']}`}
            onClick={() => {
              if (currentStep < 3) {
                setCurrentStep(currentStep + 1)
              } else {
                console.log('Form submitted')
              }
            }}
          >
            {currentStep === 3 ? 'Hoàn thành' : 'Tiếp tục'}
            {currentStep < 3 && <RightOutlined />}
          </Button>
        </div>
      </Card>
    </div>
  )
}
