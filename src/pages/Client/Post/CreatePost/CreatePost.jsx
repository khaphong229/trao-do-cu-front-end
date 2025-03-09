import React, { useRef, useEffect, useCallback } from 'react'
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

const TOUR_STORAGE_KEY = 'lastTourShownTime'
const TOUR_COOLDOWN_DAYS = 3

const CreatePostModal = () => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { dataCreatePost, isCreateModalVisible, isLoadingButton, isShowTour } = useSelector(state => state.post)

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
    />
  )
}

export default CreatePostModal
