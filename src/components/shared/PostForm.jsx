import React from 'react'
import { Button, Modal, Tour } from 'antd'
import { CloseOutlined } from '@ant-design/icons'

import UserInfoSection from 'pages/Client/Post/CreatePost/components/UserInfo'
import PostContentEditor from 'pages/Client/Post/CreatePost/components/PostContent'
import PostToolbar from 'pages/Client/Post/CreatePost/components/PostToolbar'
import LocationModal from 'pages/Client/Post/CreatePost/components/Modal/Location'
import { ContactInfoModal } from 'pages/Client/Post/CreatePost/components/Modal/Contact'
import CategoryModal from 'pages/Client/Post/CreatePost/components/Modal/Category'

import styles from 'pages/Client/Post/CreatePost/scss/CreatePost.module.scss'

const PostForm = ({
  title,
  isVisible,
  onCancel,
  formData,
  isLoading,
  user,
  onSubmit,
  formUtils,
  submitButtonText = 'Đăng',
  tourRef = {},
  showTour = false,
  tourSteps = [],
  onTourClose = () => {}
}) => {
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
    categoryRef,
    handleFieldChange,
    handleImageUpload,
    handleLocationChange
  } = formUtils

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
        bodyStyle={isMobile ? { padding: '15px', display: 'flex', flexDirection: 'column', flexGrow: 1 } : {}}
      >
        <UserInfoSection title={title} ref1={tourRef.ref1} errors={formErrors} />

        <PostContentEditor
          errorPost={errorPost}
          setErrorPost={setErrorPost}
          ref2={tourRef.ref2}
          titleRef={titleRef}
          imageRef={imageRef}
          uploadedImages={formData.image_url}
          setUploadedImages={handleImageUpload}
          onChange={handleFieldChange}
          errors={formErrors}
        />

        <PostToolbar
          ref3={tourRef.ref3}
          ref4={tourRef.ref4}
          ref5={tourRef.ref5}
          ref6={tourRef.ref6}
          phoneRef={phoneRef}
          facebookRef={facebookRef}
          locationRef={locationRef}
          categoryRef={categoryRef}
          errors={formErrors}
          onChange={handleFieldChange}
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
        location={formData.specificLocation || user?.address}
        setLocation={handleLocationChange}
        error={formErrors.specificLocation}
      />

      <ContactInfoModal
        facebookLink={formData.facebookLink || ''}
        setFacebookLink={facebookLink => handleFieldChange('facebookLink', facebookLink)}
        error={formErrors.facebookLink}
      />

      <CategoryModal
        categoryId={formData.category_id}
        setCategory={categoryId => handleFieldChange('category_id', categoryId)}
        error={formErrors.category_id}
      />

      {showTour && tourSteps.length > 0 && <Tour open={showTour} onClose={onTourClose} steps={tourSteps} />}
    </>
  )
}

export default PostForm
