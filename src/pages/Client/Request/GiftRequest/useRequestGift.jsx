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
import omit from 'lodash/omit'
import { updatePostRequestStatus } from 'features/client/post/postSlice'
import useInteraction from 'hooks/useInteraction'
const isObject = require('lodash/isObject')

export const useGiftRequest = () => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const selectedPostExchange = useSelector(state => state.exchangeRequest?.selectedPostExchange) || null
  const { batchClick } = useInteraction()

  const checkUserContactInfo = () => {
    return (user?.phone || user?.social_media?.facebook) && user?.address
  }

  const handleGiftRequest = (post, type) => {
    batchClick(isObject(post.category_id) ? post.category_id._id : post.category_id)
    // setSelectedPost(post)
    dispatch(setSelectedPostExchange(post))
    if (!checkUserContactInfo()) {
      dispatch(setInfoModalVisible(true))
    } else {
      if (type === 'gift') {
        dispatch(setAcceptModalVisible(true))
      } else if (type === 'exchange') {
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

      // Xử lý trường hợp người dùng điền cả số điện thoại và mạng xã hội
      if (values.contact_method === 'phone') {
        // Nếu chọn phone làm phương thức chính, nhưng vẫn giữ thông tin social_media nếu có
        dataUserUpdate.phone = values.phone
        dataUserUpdate.social_media = {
          facebook: values.social_media || user.social_media?.facebook || '',
          zalo: user.social_media?.zalo || '',
          instagram: user.social_media?.instagram || ''
        }
      } else {
        // Nếu chọn social_media làm phương thức chính, nhưng vẫn giữ thông tin phone nếu có
        dataUserUpdate.social_media = {
          facebook: values.social_media || '',
          zalo: user.social_media?.zalo || '',
          instagram: user.social_media?.instagram || ''
        }
        dataUserUpdate.phone = values.phone || user.phone || ''
      }

      const response = await dispatch(updateUserProfile(dataUserUpdate)).unwrap()
      const { status, message: msg } = response
      if (status === 201) {
        message.success(msg)
        dispatch(setInfoModalVisible(false))
        if (selectedPostExchange) {
          if (selectedPostExchange.type === 'gift') {
            dispatch(setAcceptModalVisible(true))
          } else {
            dispatch(setExchangeFormModalVisible(true))
          }
        }
      }
    } catch (error) {
      message.error('Không thể cập nhật thông tin liên hệ')
    }
  }

  const handleRequestConfirm = async values => {
    batchClick(selectedPostExchange.category_id._id || '')

    if (!selectedPostExchange) return

    let requestData = {
      post_id: selectedPostExchange._id,
      user_req_id: user._id,
      reason_receive: values.reason_receive === undefined ? '' : values.reason_receive,
      status: 'pending',
      contact_phone: user?.phone ? user.phone : '',
      contact_social_media: {
        facebook: user.social_media?.facebook
      },
      contact_address: user?.address ? user.address : '',
      contact_name: user.name
    }

    if (user.social_media.length === 0) {
      requestData = omit(requestData, ['contact_social_media'])
    }

    try {
      const response = await dispatch(requestGift(requestData)).unwrap()

      const { status, message: msg } = response
      if (status === 201) {
        message.success(msg)

        dispatch(
          updatePostRequestStatus({
            postId: selectedPostExchange._id
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

    batchClick(selectedPostExchange.category_id._id || '')

    let requestData = {
      post_id: selectedPostExchange._id,
      user_req_id: user._id,
      title: data.title,
      description: data.description,
      status: 'pending',
      image_url: data.image_url,
      contact_phone: user?.phone ? user.phone : '',
      contact_social_media: {
        facebook: user.social_media?.[0] || ''
      },
      contact_address: user?.address ? user.address : ''
    }

    if (user.social_media.length === 0) {
      requestData = omit(requestData, ['contact_social_media'])
    }

    try {
      const response = await dispatch(requestExchange(requestData)).unwrap()

      const { status, message: msg } = response
      if (status === 201) {
        dispatch(
          updatePostRequestStatus({
            postId: selectedPostExchange._id
          })
        )
        message.success(msg)
        dispatch(setExchangeFormModalVisible(false))
        dispatch(resetRequestData())
      }
    } catch (error) {
      if (error.status === 400) {
        Object.values(error?.detail).forEach(err => {
          message.error(err)
        })
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
