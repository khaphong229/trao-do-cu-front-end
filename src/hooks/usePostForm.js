import { useState, useRef, useEffect } from 'react'
import { message } from 'antd'
import { uploadPostImages } from 'features/upload/uploadThunks'

export const usePostForm = ({ type, updateData, validateSubmit, formData, user, isModalVisible, dispatch }) => {
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

  useEffect(() => {
    if (isModalVisible) {
      const addressParts = user.address.split(', ')
      const city = addressParts.pop()

      let dataExisting = {
        contact_phone: user.phone || '',
        contact_social_media: {
          facebook: user.social_media?.facebook || '',
          zalo: '',
          instagram: ''
        }
      }

      if (type === 'post') {
        dataExisting = {
          ...dataExisting,
          city,
          specificLocation: user.address
        }
      } else {
        dataExisting = {
          ...dataExisting,
          city,
          contact_address: user.address
        }
      }

      dispatch(updateData(dataExisting))
    }
  }, [isModalVisible, user?.address, type, updateData, dispatch, user.phone, user.social_media?.facebook])

  const validateForm = () => {
    const errors = {}

    // Only check title and images as required
    if (!formData.title || !formData.title.trim()) {
      errors.title = 'Vui lòng nhập tiêu đề bài đăng'
    }

    if (!formData.image_url || formData.image_url.length === 0) {
      errors.image_url = 'Vui lòng tải lên ít nhất một hình ảnh'
    }

    if (type === 'post') {
      if (!formData.category_id) {
        errors.category_id = 'Vui lòng nhập danh mục'
      }
    }

    if (type === 'post') {
      if (!formData.specificLocation) {
        errors.specificLocation = 'Vui lòng nhập địa chỉ'
      }
    } else {
      if (!formData.contact_address) {
        errors.contact_address = 'Vui lòng nhập địa chỉ'
      }
    }

    return errors
  }

  const scrollToFirstError = errors => {
    if (errors.title) {
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
    const errors = validateForm()
    setFormErrors(errors)
    setErrorPost(Object.keys(errors).length > 0 ? errors : null)

    if (Object.keys(errors).length > 0) {
      message.error(String(Object.values(errors)[0]))
      scrollToFirstError(errors)
      return
    }

    try {
      await validateSubmit(formData)
    } catch (error) {
      if (error.status === 400) {
        const newErrors = {}
        let hasDisplayedError = false

        Object.entries(error.detail || error.data || {}).forEach(([field, msg]) => {
          newErrors[field] = msg

          if (!hasDisplayedError) {
            message.error(String(msg))
            hasDisplayedError = true
          }
        })

        setFormErrors(newErrors)
        setErrorPost(error?.detail || error?.data)
        scrollToFirstError(newErrors)
      } else {
        // console.error('Đã xảy ra lỗi. Vui lòng thử lại sau.')
      }
    }
  }

  const handleImageUpload = async files => {
    try {
      // Upload the images and get the URLs back
      const uploadedUrls = await dispatch(uploadPostImages(files)).unwrap()

      // Check if the result is in the expected format (array of strings)
      if (Array.isArray(uploadedUrls) && uploadedUrls.length > 0) {
        // Update form data with the new image URLs
        if (formData.image_url && Array.isArray(formData.image_url)) {
          // Add new URLs to existing ones
          dispatch(updateData({ image_url: [...formData.image_url, ...uploadedUrls] }))
        } else {
          // Set new URLs
          dispatch(updateData({ image_url: uploadedUrls }))
        }
      }

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
    updateData({ [field]: value })

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
