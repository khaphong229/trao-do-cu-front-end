import React, { useRef, useEffect, useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  updatePostData,
  resetPostData,
  setCreateModalVisibility,
  setShowTour
} from '../../../../features/client/post/postSlice'
import { createPost } from '../../../../features/client/post/postThunks'
import PostForm from 'components/shared/PostForm'
import { usePostForm } from 'hooks/usePostForm'
import omit from 'lodash/omit'
import { message } from 'antd'
import useCheckMobileScreen from 'hooks/useCheckMobileScreen'
import { setInfoModalVisible } from 'features/client/request/giftRequest/giftRequestSlice'
import ContactInfoModal from './components/Modal/Contact'

const TOUR_STORAGE_KEY = 'lastTourShownTime'
const TOUR_COOLDOWN_DAYS = 3

const CreatePostModal = () => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { dataCreatePost, isCreateModalVisible, isLoadingButton, isShowTour } = useSelector(state => state.post)
  const [pendingPostOpen, setPendingPostOpen] = useState(false)

  const userInfoRef = useRef(null)
  const contentRef = useRef(null)
  const imageRef = useRef(null)
  const socialLinkRef = useRef(null)
  const locationRef = useRef(null)
  const categoryRef = useRef(null)

  const validateSubmit = async formData => {
    const response = await dispatch(
      createPost(formData.category_id === null ? omit(formData, ['category_id']) : formData)
    ).unwrap()

    const { status, message: msg } = response
    if (status === 201) {
      message.success(msg)
      dispatch(setCreateModalVisibility(false))
      dispatch(resetPostData())
    }
    return response
  }

  const formUtils = usePostForm({
    type: 'post',
    updateData: updatePostData,
    validateSubmit,
    formData: dataCreatePost,
    user,
    isModalVisible: isCreateModalVisible,
    dispatch
  })

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

  // Kiểm tra xem user có đủ thông tin liên hệ hay chưa
  const hasRequiredContactInfo = useCallback(() => {
    if (!user) return false

    const hasPhone = !!user.phone
    const hasFacebook = !!(user.social_media && user.social_media.facebook)
    const hasAddress = !!user.address

    // Yêu cầu có số điện thoại HOẶC Facebook, và phải có địa chỉ
    return (hasPhone || hasFacebook) && hasAddress
  }, [user])

  useEffect(() => {
    if (pendingPostOpen && hasRequiredContactInfo()) {
      // Nếu đã đủ thông tin liên hệ, mở modal đăng bài
      dispatch(setCreateModalVisibility(true))
      setPendingPostOpen(false)
    }
  }, [user, pendingPostOpen, hasRequiredContactInfo, dispatch])

  // Hàm xử lý khi người dùng muốn tạo bài đăng
  const handleOpenCreatePostModal = useCallback(() => {
    if (hasRequiredContactInfo()) {
      // Nếu đã có đủ thông tin liên hệ, mở modal đăng bài
      dispatch(setCreateModalVisibility(true))
    } else {
      // Nếu chưa đủ thông tin liên hệ, mở modal cập nhật thông tin
      setPendingPostOpen(true)
      dispatch(setInfoModalVisible(true))
    }
  }, [hasRequiredContactInfo, dispatch])

  // Xử lý sau khi cập nhật thông tin liên hệ
  const handleContactInfoSubmit = async contactInfo => {
    try {
      // Giả sử bạn có một API để cập nhật thông tin người dùng
      // const response = await apiUpdateUserContactInfo(contactInfo);
      // Sau khi cập nhật thành công, mở modal đăng bài
      if (pendingPostOpen) {
        dispatch(setCreateModalVisibility(true))
        setPendingPostOpen(false)
      }
      return true
    } catch (error) {
      message.error('Có lỗi xảy ra khi cập nhật thông tin liên hệ')
      return false
    }
  }

  useEffect(() => {
    if (isCreateModalVisible) {
      checkAndShowTour()
    }
  }, [isCreateModalVisible, checkAndShowTour])

  const { isMobile } = useCheckMobileScreen()

  const steps = [
    {
      title: 'Trao tặng/ Trao đổi',
      description: 'Chọn chế độ cần thực hiện.',
      target: () => userInfoRef.current
    },
    {
      title: 'Nội dung',
      description: 'Nhập nội dung bài đăng.',
      target: () => contentRef.current
    },
    {
      title: 'Ảnh, Video',
      description: 'Tải lên ảnh, video.',
      target: () => imageRef.current
    },
    {
      title: 'Thông tin liên hệ',
      description: 'Nhập thông tin liên hệ.',
      target: () => socialLinkRef.current
    },
    {
      title: 'Địa điểm',
      description: 'Nhập địa điểm của bạn.',
      target: () => locationRef.current
    },
    {
      title: 'Danh mục',
      description: 'Nhập danh mục theo đồ của bạn.',
      target: () => categoryRef.current
    }
  ]

  return (
    <>
      <ContactInfoModal onSubmit={handleContactInfoSubmit} />

      <PostForm
        title="Tạo bài đăng"
        isVisible={isCreateModalVisible}
        onCancel={() => dispatch(setCreateModalVisibility(false))}
        formData={dataCreatePost}
        isLoading={isLoadingButton}
        isMobile={isMobile}
        user={user}
        onSubmit={formUtils.handleSubmit}
        formUtils={{
          ...formUtils,
          userInfoRef,
          contentRef,
          imageRef,
          socialLinkRef,
          locationRef,
          categoryRef
        }}
        submitButtonText="Đăng"
        tourRef={{
          ref1: userInfoRef,
          ref2: contentRef,
          ref3: imageRef,
          ref4: socialLinkRef,
          ref5: locationRef,
          ref6: categoryRef
        }}
        showTour={isShowTour}
        tourSteps={steps}
        onTourClose={() => dispatch(setShowTour(false))}
        onContactInfoSubmit={handleContactInfoSubmit}
      />
    </>
  )
}

export default CreatePostModal
