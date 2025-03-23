import React, { useState, useEffect } from 'react'
import { Alert, Button, Checkbox, message, Modal, Steps, theme } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { updatePostData } from 'features/client/post/postSlice'
import { updateRequestData } from 'features/client/request/exchangeRequest/exchangeRequestSlice'
import { setCategoryModalVisibility } from 'features/client/post/postSlice'
import Marquee from 'react-fast-marquee'
import UserInfoSection from 'pages/Client/Post/CreatePost/components/UserInfo'
import PostContentEditor from 'pages/Client/Post/CreatePost/components/PostContent'
import PostToolbar from 'pages/Client/Post/CreatePost/components/PostToolbar'
import LocationModal from 'pages/Client/Post/CreatePost/components/Modal/Location'
import CategoryModal from 'pages/Client/Post/CreatePost/components/Modal/Category'

import styles from 'pages/Client/Post/CreatePost/scss/CreatePost.module.scss'
import { useGiftRequest } from 'pages/Client/Request/GiftRequest/useRequestGift'
import useDefaultLocation from 'hooks/useDefaultLocation'

const PostForm = ({
  title,
  isVisible,
  onCancel,
  formData,
  isLoading,
  user,
  onSubmit,
  formUtils,
  submitButtonText,
  onContactInfoSubmit
}) => {
  const { token } = theme.useToken()
  const { selectedPostExchange } = useSelector(state => state.exchangeRequest)
  const [current, setCurrent] = useState(0)
  const dispatch = useDispatch()
  const {
    errorPost,
    setErrorPost,
    formErrors,
    setFormErrors,
    isMobile,
    titleRef,
    imageRef,
    phoneRef,
    facebookRef,
    locationRef,
    categoryRef,
    validateForm,
    handleSubmit,
    scrollToFirstError
  } = formUtils
  const { addressDefault } = useDefaultLocation()
  const { isEdittingAddress } = useSelector(state => state.post)

  const safeFormData = formData || {}

  const isExchangeForm = title === 'Biểu mẫu trao đổi'
  const contentType = isExchangeForm ? 'exchange' : 'post'

  // Reset current step when modal opens/closes
  useEffect(() => {
    if (isVisible) {
      setCurrent(0)
    }
  }, [isVisible])

  const handleFormSubmit = () => {
    // Validate các trường khác trước
    const errors = validateForm()
    setFormErrors(errors)
    setErrorPost(Object.keys(errors).length > 0 ? errors : null)

    // Kiểm tra các lỗi khác ngoài category_id trước
    const otherErrors = { ...errors }
    delete otherErrors.category_id

    // Nếu có lỗi ở các trường khác, hiển thị lỗi đó trước
    if (Object.keys(otherErrors).length > 0) {
      // Hiển thị message lỗi đầu tiên
      message.error(String(Object.values(otherErrors)[0])) // Ensure this is a string
      // Cuộn đến trường lỗi đầu tiên
      scrollToFirstError(otherErrors)
      return
    }

    // Chỉ khi các trường khác đều OK, nếu thiếu category_id thì mới hiện modal danh mục
    if (errors.category_id) {
      dispatch(setCategoryModalVisibility(true))
      return
    }

    // Nếu không có lỗi nào, tiếp tục submit
    handleSubmit()
  }

  const handleModalCancel = () => {
    setCurrent(0) // Reset step when canceling
    onCancel() // Call original onCancel prop
  }

  const handleFieldChange = (field, value) => {
    if (isExchangeForm) {
      dispatch(updateRequestData({ [field]: value }))
    } else {
      dispatch(updatePostData({ [field]: value }))
    }

    if (formErrors && formErrors[field]) {
      const newErrors = { ...formErrors }
      delete newErrors[field]
      setFormErrors && setFormErrors(newErrors)
    }
  }

  const handleImageUpload = images => {
    if (isExchangeForm) {
      dispatch(updateRequestData({ image_url: images }))
    } else {
      dispatch(updatePostData({ image_url: images }))
    }
  }

  const handleLocationChange = location => {
    if (isExchangeForm) {
      dispatch(updateRequestData({ specificLocation: location }))
    } else {
      dispatch(updatePostData({ specificLocation: location }))
    }

    if (formErrors && formErrors.specificLocation) {
      const newErrors = { ...formErrors }
      delete newErrors.specificLocation
      setFormErrors && setFormErrors(newErrors)
    }
  }

  const { handleInfoSubmit } = useGiftRequest()

  const validateStepOne = () => {
    // Validate first step (main content, title, etc.)
    const errors = validateForm()
    setFormErrors(errors)
    setErrorPost(Object.keys(errors).length > 0 ? errors : null)

    // Filter errors to only check fields relevant to step 1
    // For example, title and content
    const stepOneFields = ['title', 'content', 'image_url']
    const stepOneErrors = {}

    stepOneFields.forEach(field => {
      if (errors[field]) stepOneErrors[field] = errors[field]
    })

    if (Object.keys(stepOneErrors).length > 0) {
      // Show error message for step 1
      message.error(String(Object.values(stepOneErrors)[0])) // Ensure this is a string
      scrollToFirstError(stepOneErrors)
      return false
    }

    return true
  }

  const validateStepTwo = () => {
    // Validate category selection (step 2)
    const errors = validateForm()

    if (errors.category_id) {
      message.error(errors.category_id) // Ensure this is a string
      return false
    }

    return true
  }

  const handleNextStep = () => {
    if (current === 0) {
      // Validate step 1 before proceeding
      if (validateStepOne()) {
        setCurrent(current + 1)
      }
    } else if (current === 1) {
      // Validate step 2 before proceeding
      if (validateStepTwo()) {
        setCurrent(current + 2)
      }
    }
  }

  const handlePrevStep = () => {
    setCurrent(current - 1)
  }

  const handleFinish = () => {
    // Hiển thị modal xác nhận trước khi đăng bài

    handleSubmit()
  }

  let steps = [
    {
      title: 'Thông tin',
      content: (
        <>
          {!isEdittingAddress ? (
            <>
              <UserInfoSection contentType={contentType} errors={formErrors} />

              <PostContentEditor
                contentType={contentType}
                errorPost={errorPost}
                setErrorPost={setErrorPost}
                titleRef={titleRef}
                imageRef={imageRef}
                uploadedImages={safeFormData.image_url || []}
                setUploadedImages={handleImageUpload}
                onChange={handleFieldChange}
                errors={formErrors}
              />

              <PostToolbar
                contentType={contentType}
                phoneRef={phoneRef}
                facebookRef={facebookRef}
                errors={formErrors}
                onChange={handleFieldChange}
                showLocationCategoryTools={false}
              />
            </>
          ) : (
            <>
              <LocationModal
                embeddedMode={true}
                location={
                  safeFormData.isPtiterOnly
                    ? 'Km10, Đường Nguyễn Trãi, Q. Hà Đông, Hà Nội'
                    : safeFormData.specificLocation || addressDefault || ''
                }
                setLocation={handleLocationChange}
                error={formErrors.specificLocation}
                isPtiterOnly={safeFormData.isPtiterOnly}
              />
            </>
          )}
        </>
      )
    }
  ]

  if (contentType === 'post') {
    steps = [
      ...steps,
      {
        title: 'Danh mục',
        content: (
          <CategoryModal
            embeddedMode={false}
            categoryId={safeFormData.category_id}
            setCategory={categoryId => handleFieldChange('category_id', categoryId)}
            error={formErrors.category_id}
            onComplete={() => setCurrent(current + 1)}
          />
        )
      }
    ]
  }

  const contentStyle = {
    marginTop: 16
  }

  const renderText = () => {
    if (selectedPostExchange?.pcoin_config) {
      if (
        selectedPostExchange?.pcoin_config?.required_amount === 0 ||
        selectedPostExchange?.pcoin_config?.required_amount === undefined
      ) {
        return 'Sản phẩm này miễn phí nhé bạn!'
      } else {
        return `Để đổi sản phẩm này bạn phải có ít nhất ${selectedPostExchange?.pcoin_config?.required_amount} P-Coin`
      }
    }
  }

  return (
    <>
      <Modal
        title={title}
        open={isVisible}
        onCancel={handleModalCancel}
        footer={null}
        closeIcon={<CloseOutlined />}
        className={styles.createPostModal}
        width={isMobile.isMobile ? '70%' : 600}
        style={isMobile ? { padding: '15px', display: 'flex', flexDirection: 'column', flexGrow: 1 } : {}}
        onSubmit={onContactInfoSubmit}
      >
        <Steps
          current={current}
          // items={steps.map(item => ({
          //   key: item.title,
          //   title: item.title
          // }))}
        />

        {contentType === 'exchange' &&
          selectedPostExchange?.pcoin_config?.required_amount !== 0 &&
          selectedPostExchange?.pcoin_config?.required_amount !== undefined && (
            <Alert
              style={{
                marginBottom: 10
              }}
              banner
              message={
                <Marquee pauseOnHover gradient={false}>
                  {renderText()}
                </Marquee>
              }
            />
          )}

        <div style={contentStyle}>{steps[current].content}</div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, width: '100%' }}>
          {current > 0 && <Button onClick={handlePrevStep}>Quay lại</Button>}
          {current === 0 && contentType === 'post' && user?.isPtiter && (
            <Checkbox
              style={{
                display: 'flex',
                alignItems: 'center'
              }}
              onChange={e => {
                const isPtiterOnly = e.target.checked
                dispatch(
                  updatePostData({
                    isPtiterOnly,
                    specificLocation: isPtiterOnly
                      ? 'Km10, Đường Nguyễn Trãi, Q. Hà Đông, Hà Nội'
                      : addressDefault || '',
                    city: isPtiterOnly ? 'Hà Nội' : addressDefault ? addressDefault.split(', ').pop() : ''
                  })
                )
              }}
            >
              Dành cho sinh viên PTIT
            </Checkbox>
          )}
          {current < steps.length - 1 && (
            <Button type="primary" onClick={handleNextStep} style={{ marginLeft: 'auto' }} disabled={isEdittingAddress}>
              Tiếp theo
            </Button>
          )}

          {current === steps.length - 1 && (
            <Button
              type="primary"
              // className={styles.postButton}
              style={{
                ...(isMobile ? { marginTop: 'auto' } : {}),
                ...(contentType === 'exchange' ? { width: '100%' } : {})
              }}
              onClick={handleFinish}
              loading={isLoading}
            >
              {submitButtonText}
            </Button>
          )}
        </div>
        {current === steps.length - 1 && !isExchangeForm && (
          <div style={{ marginTop: 16, color: '#666', fontSize: '13px' }}>
            <p>* Lưu ý: Bài đăng sẽ được admin xét duyệt trước khi hiển thị công khai.</p>
            <p>* Thời gian duyệt bài thường trong vòng 24h.</p>
          </div>
        )}
      </Modal>
    </>
  )
}

export default PostForm
