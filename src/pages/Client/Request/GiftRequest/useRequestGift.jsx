import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { requestGift } from 'features/client/request/giftRequest/giftRequestThunks'
import { setInfoModalVisible, setAcceptModalVisible } from 'features/client/request/giftRequest/giftRequestSlice'
import { updateUserProfile } from 'features/auth/authThunks'
import { message } from 'antd'
import {
  resetRequestData,
  setExchangeFormModalVisible,
  setSelectedPostExchange
} from 'features/client/request/exchangeRequest/exchangeRequestSlice'
import { requestExchange } from 'features/client/request/exchangeRequest/exchangeRequestThunks'
import { updatePostStatus } from 'features/client/post/postSlice'

export const useGiftRequest = () => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const selectedPostExchange = useSelector(state => state.exchangeRequest?.selectedPostExchange) || null
  const [selectedPost, setSelectedPost] = useState(null)
  const checkUserContactInfo = () => {
    return (user?.phone || (user?.social_media && user?.social_media?.length > 0)) && user?.address
  }

  const handleGiftRequest = (post, type) => {
    setSelectedPost(post)
    dispatch(setSelectedPostExchange(post))
    if (!checkUserContactInfo()) {
      dispatch(setInfoModalVisible(true))
    } else {
      if (type === 'gift') {
        dispatch(setAcceptModalVisible(true))
      } else {
        dispatch(setExchangeFormModalVisible(true))
      }
    }
  }

  const handleInfoSubmit = async values => {
    try {
      const dataUserUpdate = {
        name: user.name,
        email: user.email,
        address: values.address
      }

      if (values.contact_method === 'phone') {
        dataUserUpdate.phone = values.phone
        dataUserUpdate.social_media = user.social_media || []
      } else {
        dataUserUpdate.social_media = [values.social_media]
        dataUserUpdate.phone = user.phone || ''
      }

      const response = await dispatch(updateUserProfile(dataUserUpdate)).unwrap()
      const { status, message: msg } = response
      if (status === 201) {
        message.success(msg)
        dispatch(setInfoModalVisible(false))
        dispatch(setAcceptModalVisible(true))
      }
    } catch (error) {
      message.error('Không thể cập nhật thông tin liên hệ')
    }
  }

  const handleRequestConfirm = async values => {
    if (!selectedPostExchange) return

    const requestData = {
      post_id: selectedPostExchange._id,
      user_req_id: user._id,
      reason_receive: values.reason_receive === undefined ? '' : values.reason_receive,
      status: 'pending',
      contact_phone: user.phone || '',
      contact_social_media: {
        facebook: user.social_media?.[0] || 'https://www.facebook.com/'
      },
      contact_address: user.address,
      contact_name: user.name
    }

    try {
      const response = await dispatch(requestGift(requestData)).unwrap()

      const { status, message: msg } = response
      if (status === 201) {
        message.success(msg)
        dispatch(
          updatePostStatus({
            postId: selectedPostExchange._id,
            isRequested: true
          })
        )
        dispatch(setAcceptModalVisible(false))
      }
    } catch (error) {
      const { status, message: msg } = error
      if (status === 400) {
        if (error?.detail) {
          Object.values(error?.detail).map(messageDetail => message.error(messageDetail))
        } else {
          message.error(msg || 'Có lỗi xảy ra khi gửi yêu cầu')
        }
      }
      dispatch(setAcceptModalVisible(false))
    }
  }

  const handleExchangeConfirm = async data => {
    if (!selectedPostExchange) {
      message.error('Không tìm thấy bài viết được chọn')
      return
    }

    const requestData = {
      post_id: selectedPostExchange._id,
      user_req_id: user._id,
      title: data.title,
      description: data.description,
      status: 'pending',
      image_url: data.image_url,
      contact_phone: user.phone || '',
      contact_social_media: {
        facebook: user.social_media?.[0] || 'https://www.facebook.com/'
      },
      contact_address: user.address
    }

    try {
      const response = await dispatch(requestExchange(requestData)).unwrap()
      const { status, message: msg } = response
      if (status === 201) {
        dispatch(
          updatePostStatus({
            postId: selectedPostExchange._id,
            isRequested: true
          })
        )
        message.success(msg)
        dispatch(setExchangeFormModalVisible(false))
        dispatch(resetRequestData())
      }
    } catch (error) {
      if (error.status === 400) {
        message.error(error.message)
        dispatch(setExchangeFormModalVisible(false))
      }
    }
  }

  return {
    handleGiftRequest,
    handleInfoSubmit,
    handleRequestConfirm,
    handleExchangeConfirm
  }
}
