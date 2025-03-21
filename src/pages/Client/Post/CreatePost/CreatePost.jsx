import React, { useEffect, useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updatePostData, resetPostData, setCreateModalVisibility } from '../../../../features/client/post/postSlice'
import { createPost } from '../../../../features/client/post/postThunks'
import PostForm from 'components/shared/PostForm'
import { usePostForm } from 'hooks/usePostForm'
import omit from 'lodash/omit'
import { message } from 'antd'
import useCheckMobileScreen from 'hooks/useCheckMobileScreen'
import { setInfoModalVisible } from 'features/client/request/giftRequest/giftRequestSlice'
import ContactInfoModal from './components/Modal/Contact'
import RequestNotificationModal from 'components/RequestNotificationModal'

const CreatePostModal = () => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { dataCreatePost, isCreateModalVisible, isLoadingButton } = useSelector(state => state.post)
  const [pendingPostOpen, setPendingPostOpen] = useState(false)

  // Reset form data when modal is opened
  useEffect(() => {
    if (isCreateModalVisible) {
      // Only reset certain fields that should be cleared on reopen
      // Keep user contact info if it exists
      dispatch(
        updatePostData({
          title: '',
          content: '',
          image_url: [],
          category_id: null
        })
      )
    }
  }, [isCreateModalVisible, dispatch])

  const validateSubmit = async formData => {
    const postData = {
      ...formData,
      isApproved: false // Mặc định bài đăng chưa được duyệt
    }

    const response = await dispatch(
      createPost(postData.category_id === null ? omit(postData, ['category_id']) : postData)
    ).unwrap()

    const { status, message: msg } = response
    if (status === 201) {
      // Thay đổi message thành thông báo chi tiết hơn
      message.success('Bài đăng đã được gửi và đang chờ admin phê duyệt')
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

  // Kiểm tra xem user có đủ thông tin liên hệ hay chưa
  const hasRequiredContactInfo = useCallback(() => {
    if (!user) return false

    const hasPhone = !!user.phone
    const hasFacebook = !!(user.social_media && user.social_media.facebook)
    const hasAddress = user?.address?.length !== 0 ? true : false

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

  const handleCancelModal = () => {
    dispatch(setCreateModalVisibility(false))
    // Full reset when modal is closed manually
    dispatch(resetPostData())
  }

  const { isMobile } = useCheckMobileScreen()

  return (
    <>
      <ContactInfoModal onSubmit={handleContactInfoSubmit} />

      <PostForm
        title="Tạo bài đăng sản phẩm"
        isVisible={isCreateModalVisible}
        onCancel={handleCancelModal}
        formData={dataCreatePost}
        isLoading={isLoadingButton}
        isMobile={isMobile}
        user={user}
        onSubmit={formUtils.handleSubmit}
        formUtils={{
          ...formUtils
        }}
        submitButtonText="Đăng"
        onContactInfoSubmit={handleContactInfoSubmit}
      />
      <RequestNotificationModal />
    </>
  )
}

export default CreatePostModal
