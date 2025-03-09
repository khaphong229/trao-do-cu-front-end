import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  updateRequestData,
  setExchangeFormModalVisible
} from 'features/client/request/exchangeRequest/exchangeRequestSlice'
import { useGiftRequest } from '../../GiftRequest/useRequestGift'
import PostForm from 'components/shared/PostForm'
import { usePostForm } from 'hooks/usePostForm'
import { message } from 'antd'

const FormExchangeModal = () => {
  const dispatch = useDispatch()
  const { requestData, isExchangeFormModalVisible, isLoading } = useSelector(state => state.exchangeRequest)
  const { user } = useSelector(state => state.auth)
  const { handleExchangeConfirm } = useGiftRequest()

  const validateSubmit = async formData => {
    try {
      const response = await handleExchangeConfirm(formData)

      const { status, message: msg } = response
      if (status === 201) {
        message.success(msg || 'Gửi biểu mẫu trao đổi thành công')
        dispatch(setExchangeFormModalVisible(false))
      }

      return response
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const formUtils = usePostForm({
    type: 'exchange',
    updateData: updateRequestData,
    validateSubmit,
    formData: requestData,
    user,
    isModalVisible: isExchangeFormModalVisible,
    dispatch
  })

  return (
    <PostForm
      title="Biểu mẫu trao đổi"
      isVisible={isExchangeFormModalVisible}
      onCancel={() => dispatch(setExchangeFormModalVisible(false))}
      formData={requestData}
      isLoading={isLoading}
      user={user}
      onSubmit={formUtils.handleSubmit}
      formUtils={formUtils}
      submitButtonText="Gửi"
    />
  )
}

export default FormExchangeModal
