import { useState, useRef, useEffect } from 'react'
import { message } from 'antd'
import { uploadPostImages } from 'features/upload/uploadThunks'

/**
 * Custom hook for handling post form logic
 * @param {Object} options - Configuration options
 * @param {Function} options.updateData - Function to update form data
 * @param {Function} options.validateSubmit - Function to handle form submission
 * @param {Object} options.formData - Current form data
 * @param {Object} options.user - Current user data
 * @param {boolean} options.isModalVisible - Is the modal visible
 * @param {Function} options.dispatch - Redux dispatch function
 * @returns {Object} Form handlers and state
 */
export const usePostForm = ({ updateData, validateSubmit, formData, user, isModalVisible, dispatch }) => {
  const [errorPost, setErrorPost] = useState(null)
  const [formErrors, setFormErrors] = useState({})
  const [isMobile] = useState(window.innerWidth <= 768)

  // Refs for scrolling to error fields
  const titleRef = useRef(null)
  const imageRef = useRef(null)
  const phoneRef = useRef(null)
  const facebookRef = useRef(null)
  const locationRef = useRef(null)
  const categoryRef = useRef(null)

  // Reset errors when modal closes
  useEffect(() => {
    if (!isModalVisible) {
      setFormErrors({})
      setErrorPost(null)
    }
  }, [isModalVisible])

  // Set user data when modal opens
  useEffect(() => {
    if (isModalVisible && user?.address) {
      dispatch(
        updateData({
          city: user.address.split(', ').pop(),
          specificLocation: user.address,
          phone: user.phone || '',
          facebookLink: user.social_media?.facebook || '' // Use optional chaining here
        })
      )
    }
  }, [isModalVisible, user, dispatch, updateData])

  // Form validation functions
  const isValidVietnamesePhone = phone => {
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
    if (!formData.title || !formData.title.trim()) {
      errors.title = 'Vui lòng nhập tiêu đề bài đăng'
    }

    // Check images
    if (!formData.image_url || formData.image_url.length === 0) {
      errors.image_url = 'Vui lòng tải lên ít nhất một hình ảnh'
    }

    // Make sure at least one contact method is provided
    const hasPhone = formData.phone && isValidVietnamesePhone(formData.phone)
    const hasFacebook = formData.social_media?.facebook && isValidFacebookLink(formData.social_media?.facebook)

    if (!hasPhone && !hasFacebook) {
      // Only show phone error if there's no valid Facebook link
      errors.phone = 'Vui lòng nhập số điện thoại hoặc liên kết Facebook'
    } else {
      // If phone is provided but invalid
      if (formData.phone && !hasPhone) {
        errors.phone = 'Số điện thoại không hợp lệ'
      }

      // Initialize social_media errors object if it doesn't exist
      if (!errors.social_media) {
        errors.social_media = {}
      }

      // If Facebook link is provided but invalid
      if (formData.social_media?.facebook && !hasFacebook) {
        errors.social_media.facebook = 'Liên kết Facebook không hợp lệ'
      }
    }

    // Check address
    if (!formData.specificLocation) {
      errors.specificLocation = 'Vui lòng thêm địa chỉ'
    }

    if (!formData.city) {
      errors.city = 'Vui lòng thêm thành phố'
    }

    // Check category
    if (!formData.category_id) {
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
    } else if (errors.social_media?.facebook) {
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
    setErrorPost(Object.keys(errors).length > 0 ? errors : null)

    // If there are errors, display them and stop submission
    if (Object.keys(errors).length > 0) {
      // Show error message for the first error
      message.error(String(Object.values(errors)[0])) // Ensure the message is a string
      // Scroll to the first error field
      scrollToFirstError(errors)
      return
    }

    try {
      await validateSubmit(formData)
    } catch (error) {
      if (error.status === 400) {
        // Map backend errors to form fields
        const newErrors = {}
        let hasDisplayedError = false

        Object.entries(error.detail || error.data || {}).forEach(([field, msg]) => {
          newErrors[field] = msg

          if (!hasDisplayedError) {
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
              message.error(String(msg)) // Ensure the message is a string
            }
            hasDisplayedError = true
          }
        })

        setFormErrors(newErrors)
        setErrorPost(error?.detail || error?.data)
        scrollToFirstError(newErrors)
      } else {
        message.error('Đã xảy ra lỗi. Vui lòng thử lại sau.')
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
    dispatch(updateData({ [field]: value }))

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

  // Handle location update specifically
  const handleLocationChange = specificLocation => {
    handleFieldChange('specificLocation', specificLocation)
    // Also update city if needed
    if (specificLocation) {
      const city = specificLocation.split(', ').pop()
      handleFieldChange('city', city)
    }
  }

  return {
    errorPost,
    setErrorPost,
    formErrors,
    isMobile,
    titleRef,
    imageRef,
    phoneRef,
    facebookRef,
    locationRef,
    categoryRef,
    handleSubmit,
    handleFieldChange,
    handleImageUpload,
    handleLocationChange
  }
}
