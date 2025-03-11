import React from 'react'
import { Button, Modal, Tour } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import { updatePostData } from 'features/client/post/postSlice'
import { updateRequestData } from 'features/client/request/exchangeRequest/exchangeRequestSlice'

import UserInfoSection from 'pages/Client/Post/CreatePost/components/UserInfo'
import PostContentEditor from 'pages/Client/Post/CreatePost/components/PostContent'
import PostToolbar from 'pages/Client/Post/CreatePost/components/PostToolbar'
import LocationModal from 'pages/Client/Post/CreatePost/components/Modal/Location'
import { ContactInfoModal } from 'pages/Client/Post/CreatePost/components/Modal/Contact'
import CategoryModal from 'pages/Client/Post/CreatePost/components/Modal/Category'

import styles from 'pages/Client/Post/CreatePost/scss/CreatePost.module.scss'
import { useGiftRequest } from 'pages/Client/Request/GiftRequest/useRequestGift'

const PostForm = ({
  title,
  isVisible,
  onCancel,
  formData,
  isLoading,
  user,
  onSubmit,
  formUtils,
  submitButtonText,
  tourRef = {},
  showTour = false,
  tourSteps = [],
  onTourClose = () => {},
  onContactInfoSubmit
}) => {
  const dispatch = useDispatch()
  const {
    errorPost,
    setErrorPost,
    formErrors,
    isMobile,
    titleRef,
    imageRef,
    phoneRef,
    facebookRef,
    locationRef,
    categoryRef
  } = formUtils

  const safeFormData = formData || {}

  const isExchangeForm = title === 'Biểu mẫu trao đổi'
  const contentType = isExchangeForm ? 'exchange' : 'post'

  const handleFieldChange = (field, value) => {
    if (isExchangeForm) {
      dispatch(updateRequestData({ [field]: value }))
    } else {
      dispatch(updatePostData({ [field]: value }))
    }

    if (formErrors && formErrors[field]) {
      const newErrors = { ...formErrors }
      delete newErrors[field]
      formUtils.setFormErrors && formUtils.setFormErrors(newErrors)
    }
  }

  const handleImageUpload = images => {
    if (isExchangeForm) {
      dispatch(updateRequestData({ image_url: images }))
    } else {
      dispatch(updatePostData({ image_url: images }))
    }
  }

  const handleLocationChange = location => {
    if (isExchangeForm) {
      dispatch(updateRequestData({ specificLocation: location }))
    } else {
      dispatch(updatePostData({ specificLocation: location }))
    }

    if (formErrors && formErrors.specificLocation) {
      const newErrors = { ...formErrors }
      delete newErrors.specificLocation
      formUtils.setFormErrors && formUtils.setFormErrors(newErrors)
    }
  }

  const { handleInfoSubmit } = useGiftRequest()

  return (
    <>
      <Modal
        title={title}
        open={isVisible}
        onCancel={onCancel}
        footer={null}
        closeIcon={<CloseOutlined />}
        className={styles.createPostModal}
        width={isMobile ? '90%' : 600}
        style={isMobile ? { padding: '15px', display: 'flex', flexDirection: 'column', flexGrow: 1 } : {}}
        onSubmit={onContactInfoSubmit}
      >
        <UserInfoSection contentType={contentType} ref1={tourRef.ref1} errors={formErrors} />

        <PostContentEditor
          contentType={contentType}
          errorPost={errorPost}
          setErrorPost={setErrorPost}
          titleRef={titleRef}
          imageRef={imageRef}
          uploadedImages={safeFormData.image_url || []}
          setUploadedImages={handleImageUpload}
          onChange={handleFieldChange}
          errors={formErrors}
          ref2={tourRef.ref2}
        />

        <PostToolbar
          contentType={contentType}
          phoneRef={phoneRef}
          facebookRef={facebookRef}
          locationRef={locationRef}
          categoryRef={categoryRef}
          imageRef={imageRef}
          errors={formErrors}
          onChange={handleFieldChange}
          imageToolRef={tourRef.ref3}
          socialLinkToolRef={tourRef.ref4}
          locationToolRef={tourRef.ref5}
          categoryToolRef={tourRef.ref6}
        />

        <Button
          type="primary"
          className={styles.postButton}
          onClick={onSubmit}
          loading={isLoading}
          style={isMobile ? { marginTop: 'auto' } : {}}
        >
          {submitButtonText}
        </Button>
      </Modal>

      <LocationModal
        location={safeFormData.specificLocation || user?.address || ''}
        setLocation={handleLocationChange}
        error={formErrors.specificLocation}
      />

      <ContactInfoModal
        facebookLink={safeFormData.facebookLink || ''}
        setFacebookLink={facebookLink => handleFieldChange('facebookLink', facebookLink)}
        error={formErrors.facebookLink}
      />

      <CategoryModal
        categoryId={safeFormData.category_id}
        setCategory={categoryId => handleFieldChange('category_id', categoryId)}
        error={formErrors.category_id}
      />

      {showTour && tourSteps.length > 0 && (
        <Tour
          open={showTour}
          onClose={onTourClose}
          steps={tourSteps.map(step => ({
            title: step.title,
            description: step.description,
            target: () => step.ref?.current
          }))}
        />
      )}
    </>
  )
}

export default PostForm
