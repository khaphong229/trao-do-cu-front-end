import { useState, useRef, useEffect } from 'react'
import { message } from 'antd'
import { uploadExchangeImages, uploadPostImages } from 'features/upload/uploadThunks'
import useDefaultLocation from './useDefaultLocation'

export const usePostForm = ({ type, updateData, validateSubmit, formData, user, isModalVisible, dispatch }) => {
  const [errorPost, setErrorPost] = useState(null)
  const [formErrors, setFormErrors] = useState({})
  const [isMobile] = useState(window.innerWidth <= 768)
  const { addressDefault } = useDefaultLocation()

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
    if (isModalVisible && addressDefault) {
      const addressParts = addressDefault.split(', ')
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
          specificLocation: addressDefault
        }
      } else {
        dataExisting = {
          ...dataExisting,
          city,
          contact_address: addressDefault
        }
      }

      dispatch(updateData(dataExisting))
    }
  }, [isModalVisible, addressDefault, type, updateData, dispatch, user.phone, user.social_media?.facebook])

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
      if (!formData.specificLocation) {
        errors.specificLocation = 'Vui lòng nhập địa chỉ'
      }
    } else {
      if (!formData.contact_address) {
        errors.contact_address = 'Vui lòng nhập địa chỉ'
      }
    }

    if (type === 'post') {
      if (!formData.category_id) {
        errors.category_id = 'Vui lòng nhập danh mục'
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

      // If category error exists, open category modal immediately
      if (errors.category_id) {
        dispatch({ type: 'post/setCategoryModalVisibility', payload: true })
      } else {
        // Otherwise scroll to the first error as before
        scrollToFirstError(errors)
      }
      return
    }

    try {
      // Check which items in image_url are actual File objects
      const fileObjects = []
      const serverUrls = []

      // Filter and organize images
      if (formData.image_url && formData.image_url.length > 0) {
        formData.image_url.forEach(item => {
          if (typeof item === 'string') {
            // If it's already a server URL (not a blob URL)
            if (!item.startsWith('blob:')) {
              serverUrls.push(item)
            }
          } else if (item instanceof File) {
            // If it's a File object
            fileObjects.push(item)
          } else if (item && item.originFileObj) {
            // If it's an Ant Design Upload file object
            fileObjects.push(item.originFileObj)
          }
        })
      }

      // If there are files to upload
      let uploadedUrls = []
      if (fileObjects.length > 0) {
        message.loading('Đang tải ảnh lên...', 0)

        try {
          // Upload files using the appropriate field name based on type
          // This ensures the backend sees the field name 'post' or 'exchange'
          const uploadType = type === 'exchange' ? 'exchange' : 'post'

          if (type === 'exchange') {
            const response = await dispatch(uploadExchangeImages(fileObjects)).unwrap()
            // Extract the URLs from the response based on the backend structure
            uploadedUrls = response.files ? response.files.map(file => file.filepath) : []
          } else {
            const response = await dispatch(uploadPostImages(fileObjects)).unwrap()
            // Extract the URLs from the response based on the backend structure
            uploadedUrls = response.files ? response.files.map(file => file.filepath) : []
          }

          message.destroy()
        } catch (error) {
          message.destroy()
          message.error('Tải ảnh thất bại! Vui lòng thử lại.')
          return
        }
      }

      // Combine server URLs with newly uploaded URLs
      const allImageUrls = [...serverUrls, ...uploadedUrls]

      // Create updated formData with all image URLs
      const updatedFormData = {
        ...formData,
        image_url: allImageUrls
      }

      // Now proceed with the submission
      await validateSubmit(updatedFormData)
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
        console.error('Submission error:', error)
        message.error('Đã xảy ra lỗi. Vui lòng thử lại sau.')
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
      message.error('Tải ảnh thất bại! Vui lòng thử lại.')

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
    scrollToFirstError,
    handleFieldChange,
    handleImageUpload,
    handleLocationChange
  }
}
