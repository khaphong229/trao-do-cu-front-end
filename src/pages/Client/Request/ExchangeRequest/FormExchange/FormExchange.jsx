import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Modal } from 'antd'
import { CloseOutlined } from '@ant-design/icons'

import {
  updateRequestData,
  setExchangeFormModalVisible
} from 'features/client/request/exchangeRequest/exchangeRequestSlice'

import UserInfoSection from './components/UserInfo'
import PostContentEditor from './components/PostContent'
import PostToolbar from './components/PostToolbar'
import LocationModal from './components/Modal/Location'
import FacebookLinkModal from './components/Modal/Contact'

import styles from './scss/CreatePost.module.scss'
import { useGiftRequest } from '../../GiftRequest/useRequestGift'

const FormExchangeModal = () => {
  const dispatch = useDispatch()
  const { requestData, isExchangeFormModalVisible, isLoading } = useSelector(state => state.exchangeRequest)
  const { user } = useSelector(state => state.auth)
  const { handleExchangeConfirm } = useGiftRequest()
  const handleSubmit = async () => {
    try {
      await handleExchangeConfirm(requestData)
    } catch (error) {}
  }

  return (
    <>
      <Modal
        title="Thông tin đồ trao đổi"
        open={isExchangeFormModalVisible}
        onCancel={() => dispatch(setExchangeFormModalVisible(false))}
        footer={null}
        closeIcon={<CloseOutlined />}
        className={styles.createPostModal}
        width={600}
      >
        <UserInfoSection />

        <PostContentEditor />

        <PostToolbar />

        <Button
          type="primary"
          className={styles.postButton}
          onClick={handleSubmit}
          loading={isLoading}
          disabled={!requestData.title.trim() || requestData.image_url.length === 0}
        >
          Gửi
        </Button>
      </Modal>

      <LocationModal
        location={user?.address}
        setLocation={contact_address => dispatch(updateRequestData({ contact_address }))}
      />

      <FacebookLinkModal
        facebookLink={requestData.facebookLink || ''}
        setFacebookLink={facebookLink => dispatch(updateRequestData({ facebookLink }))}
      />
    </>
  )
}

export default FormExchangeModal
