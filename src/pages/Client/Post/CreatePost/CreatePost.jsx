import React, { useRef, useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Modal, Tour, message } from 'antd'
import { CloseOutlined } from '@ant-design/icons'

import {
  updatePostData,
  resetPostData,
  setCreateModalVisibility,
  setShowTour
} from '../../../../features/client/post/postSlice'
import { createPost } from '../../../../features/client/post/postThunks'

import UserInfoSection from './components/UserInfo'
import PostContentEditor from './components/PostContent'
import PostToolbar from './components/PostToolbar'
import LocationModal from './components/Modal/Location'
import FacebookLinkModal from './components/Modal/Contact'

import styles from './scss/CreatePost.module.scss'
import { uploadPostImages } from 'features/upload/uploadThunks'
import CategoryModal from './components/Modal/Category'
import omit from 'lodash/omit'

const TOUR_STORAGE_KEY = 'lastTourShownTime'
const TOUR_COOLDOWN_DAYS = 3

const CreatePostModal = () => {
  const dispatch = useDispatch()
  const [errorPost, setErrorPost] = useState(null)
  const [formErrors, setFormErrors] = useState({})
  const { user } = useSelector(state => state.auth)
  const { dataCreatePost, isCreateModalVisible, isLoadingButton, isShowTour } = useSelector(state => state.post)
  const [isMobile] = useState(window.innerWidth <= 768)

  const ref1 = useRef(null)
  const ref2 = useRef(null)
  const ref3 = useRef(null)
  const ref4 = useRef(null)
  const ref5 = useRef(null)
  const ref6 = useRef(null)

  // Refs for scrolling to error fields
  const titleRef = useRef(null)
  const imageRef = useRef(null)
  const phoneRef = useRef(null)
  const facebookRef = useRef(null)
  const locationRef = useRef(null)
  const categoryRef = useRef(null)

  const checkAndShowTour = useCallback(() => {
    const lastShownTime = localStorage.getItem(TOUR_STORAGE_KEY)
    const currentTime = new Date().getTime()

    if (!lastShownTime) {
      dispatch(setShowTour(true))
      localStorage.setItem(TOUR_STORAGE_KEY, currentTime.toString())
    } else {
      const daysSinceLastShown = (currentTime - parseInt(lastShownTime)) / (1000 * 60 * 60 * 24)

      if (daysSinceLastShown >= TOUR_COOLDOWN_DAYS) {
        dispatch(setShowTour(true))
        localStorage.setItem(TOUR_STORAGE_KEY, currentTime.toString())
      } else {
        dispatch(setShowTour(false))
      }
    }
  }, [dispatch])

  const handleTourClose = () => {
    dispatch(setShowTour(false))
  }

  useEffect(() => {
    if (isCreateModalVisible) {
      checkAndShowTour()
    }
  }, [isCreateModalVisible, checkAndShowTour])

  useEffect(() => {
    if (isCreateModalVisible && user?.address) {
      dispatch(
        updatePostData({
          city: user.address.split(', ').pop(),
          specificLocation: user.address
        })
      )
    }
  }, [isCreateModalVisible, user?.address, dispatch])

  useEffect(() => {
    if (isCreateModalVisible && user) {
      dispatch(
        updatePostData({
          city: user.address?.split(', ').pop() || '',
          specificLocation: user.address || '',
          phone: user.phone || '',
          facebookLink: user.facebookLink || ''
        })
      )
    }
  }, [isCreateModalVisible, user, dispatch])

  // Clear form errors when modal closes
  useEffect(() => {
    if (!isCreateModalVisible) {
      setFormErrors({})
      setErrorPost(null)
    }
  }, [isCreateModalVisible])

  const steps = [
    {
      title: 'Trao tặng/ Trao đổi',
      description: 'Chọn chế độ cần thực hiện.',
      target: () => ref1.current
    },
    {
      title: 'Nội dung',
      description: 'Nhập nội dung bài đăng.',
      target: () => ref2.current
    },
    {
      title: 'Ảnh, Video',
      description: 'Tải lên ảnh, video.',
      target: () => ref3.current
    },
    {
      title: 'Thông tin liên hệ',
      description: 'Nhập thông tin liên hệ.',
      target: () => ref4.current
    },
    {
      title: 'Địa điểm',
      description: 'Nhập địa điểm của bạn.',
      target: () => ref5.current
    },
    {
      title: 'Danh mục',
      description: 'Nhập danh mục theo đồ của bạn.',
      target: () => ref6.current
    }
  ]

  // Kiểm tra tính hợp lệ của số điện thoại Việt Nam
  const isValidVietnamesePhone = phone => {
    // Kiểm tra định dạng số điện thoại Việt Nam
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/
    return phoneRegex.test(phone)
  }
  const isValidFacebookLink = link => {
    const facebookRegex = /(?:http(?:s)?:\/\/)?(?:www\.)?facebook.com\/.+/g
    return facebookRegex.test(link)
  }

  const validateForm = () => {
    const errors = {}

    // Check required fields
    if (!dataCreatePost.title || !dataCreatePost.title.trim()) {
      errors.title = 'Vui lòng nhập tiêu đề bài đăng'
    }

    // Kiểm tra hình ảnh
    if (!dataCreatePost.image_url || dataCreatePost.image_url.length === 0) {
      errors.image_url = 'Vui lòng tải lên ít nhất một hình ảnh'
    }

    // Kiểm tra thông tin liên hệ
    if (!dataCreatePost.phone) {
      errors.phone = 'Vui lòng nhập số điện thoại liên hệ'
    } else if (!isValidVietnamesePhone(dataCreatePost.phone)) {
      errors.phone = 'Số điện thoại không hợp lệ'
    }

    // Kiểm tra Facebook link nếu có
    if (dataCreatePost.facebookLink && !isValidFacebookLink(dataCreatePost.facebookLink)) {
      errors.facebookLink = 'Liên kết Facebook không hợp lệ'
    }

    // Kiểm tra địa chỉ
    if (!dataCreatePost.specificLocation) {
      errors.specificLocation = 'Vui lòng thêm địa chỉ'
    }

    if (!dataCreatePost.city) {
      errors.city = 'Vui lòng thêm thành phố'
    }

    // Kiểm tra danh mục
    if (!dataCreatePost.category_id) {
      errors.category_id = 'Vui lòng chọn danh mục cho món đồ'
    }

    return errors
  }

  const scrollToFirstError = errors => {
    if (errors.title || errors.content) {
      titleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    } else if (errors.image_url) {
      imageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    } else if (errors.phone) {
      phoneRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    } else if (errors.facebookLink) {
      facebookRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    } else if (errors.specificLocation || errors.city) {
      locationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    } else if (errors.category_id) {
      categoryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const handleSubmit = async () => {
    // Validate form first
    const errors = validateForm()
    setFormErrors(errors)

    // Set errorPost for backward compatibility
    if (Object.keys(errors).length > 0) {
      setErrorPost(errors)
    } else {
      setErrorPost(null)
    }

    // If there are errors, display them and stop submission
    if (Object.keys(errors).length > 0) {
      // Show error message for the first error
      message.error(Object.values(errors)[0])
      // Scroll to the first error field
      scrollToFirstError(errors)
      return
    }

    try {
      const response = await dispatch(
        createPost(dataCreatePost.category_id === null ? omit(dataCreatePost, ['category_id']) : dataCreatePost)
      ).unwrap()
      const { status, message: msg } = response
      if (status === 201) {
        message.success(msg)
        dispatch(setCreateModalVisibility(false))
        dispatch(resetPostData())
      }
    } catch (error) {
      if (error.status === 400) {
        // Map backend errors to form fields
        const newErrors = {}

        Object.entries(error.detail).forEach(([field, msg]) => {
          newErrors[field] = msg

          if (field === 'category_id') {
            message.error('Vui lòng chọn danh mục cho món đồ!')
          } else if (field === 'specificLocation' || field === 'city') {
            message.error('Vui lòng thêm địa chỉ')
          } else if (field === 'image_url') {
            message.error('Vui lòng tải lên ít nhất một hình ảnh')
          } else if (field === 'phone') {
            message.error('Vui lòng nhập số điện thoại hợp lệ')
          } else if (field === 'facebookLink') {
            message.error('Vui lòng nhập liên kết Facebook hợp lệ')
          } else {
            message.error(msg)
          }
        })

        setFormErrors(newErrors)
        setErrorPost(error?.detail) // Set errorPost for backward compatibility
        scrollToFirstError(newErrors)
      }
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
          setErrorPost(Object.keys(newErrorPost).length > 0 ? newErrorPost : null)
        }
      }
    } catch (error) {
      message.error('Tải ảnh thất bại')

      // Set image error
      setFormErrors(prev => ({
        ...prev,
        image_url: 'Tải ảnh thất bại'
      }))

      setErrorPost(prev => ({
        ...(prev || {}),
        image_url: 'Tải ảnh thất bại'
      }))
    }
  }

  // Handler to clear error when field is updated
  const handleFieldChange = (field, value) => {
    // Update the post data
    dispatch(updatePostData({ [field]: value }))

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
        setErrorPost(Object.keys(newErrorPost).length > 0 ? newErrorPost : null)
      }
    }
  }

  return (
    <>
      <Modal
        title="Tạo bài đăng"
        open={isCreateModalVisible}
        onCancel={() => dispatch(setCreateModalVisibility(false))}
        footer={null}
        closeIcon={<CloseOutlined />}
        className={styles.createPostModal}
        width={isMobile ? '100%' : 600}
        style={isMobile ? { top: 0 } : {}}
        bodyStyle={isMobile ? { padding: '15px', display: 'flex', flexDirection: 'column', flexGrow: 1 } : {}}
      >
        <UserInfoSection ref1={ref1} errors={formErrors} />

        <PostContentEditor
          errorPost={errorPost}
          setErrorPost={setErrorPost}
          ref2={ref2}
          titleRef={titleRef}
          imageRef={imageRef}
          uploadedImages={dataCreatePost.image_url}
          setUploadedImages={handleImageUpload}
          onChange={handleFieldChange}
        />

        <PostToolbar
          ref3={ref3}
          ref4={ref4}
          ref5={ref5}
          ref6={ref6}
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
          loading={isLoadingButton}
          style={isMobile ? { marginTop: 'auto' } : {}}
        >
          Đăng
        </Button>
      </Modal>

      <LocationModal
        location={dataCreatePost.specificLocation || user?.address}
        setLocation={specificLocation => {
          handleFieldChange('specificLocation', specificLocation)
          // Also update city if needed
          if (specificLocation) {
            const city = specificLocation.split(', ').pop()
            handleFieldChange('city', city)
          }
        }}
        error={formErrors.specificLocation}
      />

      <FacebookLinkModal
        facebookLink={dataCreatePost.facebookLink || ''}
        setFacebookLink={facebookLink => handleFieldChange('facebookLink', facebookLink)}
        error={formErrors.facebookLink}
      />

      <CategoryModal
        categoryId={dataCreatePost.category_id}
        setCategory={categoryId => handleFieldChange('category_id', categoryId)}
        error={formErrors.category_id}
      />

      <Tour open={isShowTour} onClose={handleTourClose} steps={steps} />
    </>
  )
}

export default CreatePostModal
