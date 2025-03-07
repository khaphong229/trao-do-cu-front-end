import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, message, Modal } from 'antd'
import { CloseOutlined } from '@ant-design/icons'

import {
  updateRequestData,
  setExchangeFormModalVisible
} from 'features/client/request/exchangeRequest/exchangeRequestSlice'

import UserInfoSection from './components/UserInfo'
import PostContentEditor from './components/PostContent'
import PostToolbar from './components/PostToolbar'
import LocationModal from './components/Modal/Location'
import FacebookLinkModal from './components/Modal/Contact'

import styles from './scss/CreatePost.module.scss'
import { useGiftRequest } from '../../GiftRequest/useRequestGift'
import { uploadPostImages } from 'features/upload/uploadThunks'
import CategoryModal from './components/Modal/Category'
import { requestExchange } from 'features/client/request/exchangeRequest/exchangeRequestThunks'

const FormExchangeModal = () => {
  const dispatch = useDispatch()
  const { requestData, isExchangeFormModalVisible, isLoading } = useSelector(state => state.exchangeRequest)
  const { user } = useSelector(state => state.auth)
  const [isMobile] = useState(window.innerWidth <= 768)
  const [errorPost, setErrorPost] = useState({})
  const [formErrors, setFormErrors] = useState({})
  const { handleExchangeConfirm } = useGiftRequest()
  // Refs for scrolling to error fields
  const titleRef = useRef(null)
  const imageRef = useRef(null)
  const phoneRef = useRef(null)
  const facebookRef = useRef(null)
  const locationRef = useRef(null)
  const categoryRef = useRef(null)

  useEffect(() => {
    if (isExchangeFormModalVisible && user?.address) {
      const addressParts = user.address.split(', ')
      const city = addressParts[addressParts.length - 1]
      dispatch(
        updateRequestData({
          city,
          contact_address: user.address
        })
      )
    }

    // Reset error states when modal opens
    if (isExchangeFormModalVisible) {
      setFormErrors({})
      setErrorPost(null)
    }
  }, [isExchangeFormModalVisible, user?.address, dispatch])

  const validateForm = () => {
    const errors = {}

    // Check required fields
    if (!requestData.title || !requestData.title.trim()) {
      errors.title = 'Vui lòng nhập tiêu đề bài trao đổi của bạn'
      return errors // Chỉ trả về lỗi tiêu đề nếu có
    }

    // Sau khi tiêu đề đã hợp lệ, kiểm tra hình ảnh
    if (!requestData.image_url || requestData.image_url.length === 0) {
      errors.image_url = 'Vui lòng tải lên ít nhất một hình ảnh cho bài đăng trao đổi của bạn'
      return errors // Chỉ trả về lỗi hình ảnh nếu có
    }

    // Sau khi hình ảnh đã hợp lệ, kiểm tra địa chỉ
    if (!requestData.specificLocation) {
      errors.specificLocation = 'Vui lòng thêm địa chỉ'
      return errors
    }

    if (!requestData.city) {
      errors.city = 'Vui lòng thêm thành phố'
      return errors
    }

    // Sau khi địa chỉ đã hợp lệ, kiểm tra danh mục
    if (!requestData.category_id) {
      errors.category_id = 'Vui lòng chọn danh mục cho món đồ'
      return errors
    }

    return errors
  }

  const scrollToFirstError = errors => {
    if (errors.title) {
      titleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    } else if (errors.image_url) {
      imageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    } else if (errors.specificLocation || errors.city) {
      locationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    } else if (errors.category_id) {
      categoryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const handleImageUpload = async files => {
    try {
      await dispatch(uploadPostImages(files)).unwrap()

      // Clear image error if it exists
      if (formErrors.image_url) {
        setFormErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors.image_url
          return newErrors
        })

        if (errorPost && errorPost.image_url) {
          const newErrorPost = { ...errorPost }
          delete newErrorPost.image_url
          setErrorPost(Object.keys(newErrorPost).length > 0 ? newErrorPost : {})
        }
      }
    } catch (error) {
      message.error({
        content: 'Tải ảnh thất bại',
        duration: 4
      })

      // Set image error
      setFormErrors(prev => ({
        ...prev,
        image_url: 'Tải ảnh thất bại'
      }))
    }
  }

  const handleSubmit = async () => {
    // Validate form before submitting
    const errors = validateForm()

    if (Object.keys(errors).length > 0) {
      // Hiển thị lỗi đầu tiên tìm thấy
      if (errors.title) {
        message.error('Vui lòng nhập tiêu đề bài trao đổi của bạn')
      } else if (errors.image_url) {
        message.error('Vui lòng tải lên ít nhất một hình ảnh cho bài đăng trao đổi của bạn')
      } else if (errors.specificLocation || errors.city) {
        message.error('Vui lòng thêm địa chỉ')
      } else if (errors.category_id) {
        message.error('Vui lòng chọn danh mục cho món đồ')
      }

      // Update form errors state
      setFormErrors(errors)
      setErrorPost(errors)

      // Scroll to the first error
      scrollToFirstError(errors)
      return // Stop submission if there are errors
    }

    try {
      // Only proceed with submission if there are no validation errors
      await handleExchangeConfirm(requestData)
      message.success('Đã tạo bài đăng thành công')
      dispatch(setExchangeFormModalVisible(false))
    } catch (error) {
      if (error.status === 400 && error.data) {
        const newErrors = {}
        let hasDisplayedError = false

        // Ưu tiên hiển thị lỗi theo thứ tự
        if (error.data.title) {
          message.error('Vui lòng nhập tiêu đề bài trao đổi của bạn')
          hasDisplayedError = true
        } else if (error.data.image_url) {
          message.error('Vui lòng tải lên ít nhất một hình ảnh')
          hasDisplayedError = true
        } else if (error.data.specificLocation || error.data.city) {
          message.error('Vui lòng thêm địa chỉ')
          hasDisplayedError = true
        } else if (error.data.category_id) {
          message.error('Vui lòng chọn danh mục cho món đồ')
          hasDisplayedError = true
        }

        // Nếu không có lỗi nào trong số các lỗi ưu tiên, hiển thị lỗi đầu tiên tìm thấy
        if (!hasDisplayedError && Object.values(error.data).length > 0) {
          const firstError = Object.values(error.data)[0]
          message.error(firstError)
        }

        // Cập nhật trạng thái lỗi
        Object.entries(error.data).forEach(([field, msg]) => {
          newErrors[field] = msg
        })

        setFormErrors(newErrors)
        setErrorPost(error?.data)
        scrollToFirstError(newErrors)
      } else {
        message.error('Đã xảy ra lỗi khi tạo bài đăng. Vui lòng thử lại sau.')
      }
    }
  }

  const handleFieldChange = (field, value) => {
    // Update the post data
    dispatch(updateRequestData({ [field]: value }))

    // Clear the error for this field if it exists
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })

      // Also update errorPost for backward compatibility
      if (errorPost && errorPost[field]) {
        const newErrorPost = { ...errorPost }
        delete newErrorPost[field]
        setErrorPost(Object.keys(newErrorPost).length > 0 ? newErrorPost : {})
      }
    }
  }

  return (
    <>
      <Modal
        title="Tạo bài đăng"
        open={isExchangeFormModalVisible}
        onCancel={() => dispatch(setExchangeFormModalVisible(false))}
        footer={null}
        closeIcon={<CloseOutlined />}
        className={styles.createPostModal}
        width={isMobile ? '100%' : 600}
        style={isMobile ? { top: 0 } : {}}
        bodyStyle={isMobile ? { padding: '15px', display: 'flex', flexDirection: 'column', flexGrow: 1 } : {}}
      >
        <UserInfoSection errors={formErrors} />

        <PostContentEditor
          errorPost={errorPost}
          setErrorPost={setErrorPost}
          titleRef={titleRef}
          imageRef={imageRef}
          uploadedImages={requestData.image_url}
          setUploadedImages={handleImageUpload}
          onChange={handleFieldChange}
          errors={formErrors}
        />

        <PostToolbar
          phoneRef={phoneRef}
          facebookRef={facebookRef}
          locationRef={locationRef}
          categoryRef={categoryRef}
          errors={formErrors}
          onChange={handleFieldChange}
        />

        <Button
          type="primary"
          className={styles.postButton}
          onClick={handleSubmit}
          loading={isLoading}
          style={isMobile ? { marginTop: 'auto' } : {}}
        >
          Gửi
        </Button>
      </Modal>

      <LocationModal
        location={requestData.specificLocation || user?.address}
        setLocation={specificLocation => {
          handleFieldChange('specificLocation', specificLocation)
          if (specificLocation) {
            const city = specificLocation.split(', ').pop()
            handleFieldChange('city', city)
          }
        }}
        error={formErrors.specificLocation}
      />

      <FacebookLinkModal
        facebookLink={requestData.facebookLink || ''}
        setFacebookLink={facebookLink => handleFieldChange('facebookLink', facebookLink)}
        error={formErrors.facebookLink}
      />

      <CategoryModal
        categoryId={requestData.category_id}
        setCategory={categoryId => handleFieldChange('category_id', categoryId)}
        error={formErrors.category_id}
      />
    </>
  )
}

export default FormExchangeModal
