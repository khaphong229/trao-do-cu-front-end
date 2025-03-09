import React from 'react'
import { Image, Input } from 'antd'
import EmojiPicker from 'emoji-picker-react'
import styles from '../scss/PostContent.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { updatePostData } from 'features/client/post/postSlice'
import { updateRequestData } from 'features/client/request/exchangeRequest/exchangeRequestSlice'
import { CloseOutlined } from '@ant-design/icons'
import { URL_SERVER_IMAGE } from '../../../../../config/url_server'

const { TextArea } = Input

// Main component that handles both post and exchange request content
const PostContent = props => {
  const { contentType, ref2 } = props

  // Check content type to determine which component to render
  if (contentType === 'exchange') {
    return <ExchangeRequestContent {...props} />
  } else {
    return <RegularPostContent {...props} ref2={ref2} />
  }
}

// Component for regular posts
const RegularPostContent = ({
  titleRef,
  imageRef,
  errorPost,
  setErrorPost,
  uploadedImages,
  setUploadedImages,
  ref2
}) => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { isShowEmoji, dataCreatePost } = useSelector(state => state.post)

  // Handle title change for regular post form
  const handleTitleChange = e => {
    dispatch(updatePostData({ title: e.target.value }))
    if (errorPost?.title) {
      setErrorPost(prev => (prev ? { ...prev, title: null } : null))
    }
  }

  const handleEmojiClick = emojiObject => {
    const updatedDescription = (dataCreatePost.title || '') + emojiObject.emoji
    dispatch(updatePostData({ title: updatedDescription }))
  }

  const handleRemoveFile = indexToRemove => {
    const updatedFiles = dataCreatePost.image_url.filter((_, index) => index !== indexToRemove)
    dispatch(updatePostData({ image_url: updatedFiles }))

    // If setUploadedImages is provided, call it with the updated files
    if (setUploadedImages) {
      setUploadedImages(updatedFiles)
    }
  }

  const isVideoFile = filename => {
    if (!filename) return false
    const videoExtensions = ['.mp4', '.mov', '.avi']
    return videoExtensions.some(ext => typeof filename === 'string' && filename.toLowerCase().endsWith(ext))
  }

  const renderPreview = (file, index) => {
    const fileUrl = typeof file === 'string' ? `${URL_SERVER_IMAGE}${file}` : URL.createObjectURL(file)

    if (isVideoFile(typeof file === 'string' ? file : file.name)) {
      return (
        <div key={index} className={styles.filePreviewContainer}>
          <div className={styles.videoWrapper}>
            <video className={styles.previewVideo} controls>
              <source src={fileUrl} type="video/mp4" />
              Trình duyệt của bạn không hỗ trợ video.
            </video>
          </div>
          <button className={styles.removeFileButton} onClick={() => handleRemoveFile(index)}>
            <CloseOutlined />
          </button>
        </div>
      )
    }

    return (
      <div key={index} className={styles.filePreviewContainer}>
        <Image src={fileUrl} alt={`Uploaded ${index + 1}`} className={styles.previewImage} />
        <button className={styles.removeFileButton} onClick={() => handleRemoveFile(index)}>
          <CloseOutlined />
        </button>
      </div>
    )
  }

  return (
    <div className={styles.contentWrapper} ref={ref2}>
      <div className={styles.titleWrap} ref={titleRef}>
        <TextArea
          status={errorPost?.title ? 'error' : ''}
          variant={errorPost?.title ? 'outlined' : 'borderless'}
          autoSize={{ minRows: 3, maxRows: 8 }}
          placeholder={
            errorPost?.title ? errorPost.title : `${user.name} ơi, bạn đang muốn trao đổi hay cho đi gì thế?`
          }
          value={dataCreatePost.title || ''}
          onChange={handleTitleChange}
          style={{ width: '100%', borderRadius: '0' }}
          ref={el => {
            setTimeout(() => el?.focus(), 0)
          }}
        />
      </div>

      <div ref={imageRef}>
        {dataCreatePost.image_url && dataCreatePost.image_url.length > 0 && (
          <div className={styles.uploadedFiles}>
            {dataCreatePost.image_url.map((file, index) => renderPreview(file, index))}
          </div>
        )}
      </div>

      {isShowEmoji && (
        <div className={styles.emojiPickerContainer}>
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
    </div>
  )
}

// Component for exchange requests
const ExchangeRequestContent = ({ titleRef, imageRef, errorPost, setErrorPost, uploadedImages, setUploadedImages }) => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { isShowEmoji, requestData } = useSelector(state => state.exchangeRequest)

  // Handle title change for exchange form
  const handleTitleChange = e => {
    dispatch(updateRequestData({ title: e.target.value }))
    if (errorPost?.title) {
      setErrorPost(prev => (prev ? { ...prev, title: null } : null))
    }
  }

  const handleEmojiClick = emojiObject => {
    const updatedDescription = (requestData.title || '') + emojiObject.emoji
    dispatch(updateRequestData({ title: updatedDescription }))
  }

  const handleRemoveFile = indexToRemove => {
    const updatedFiles = requestData.image_url.filter((_, index) => index !== indexToRemove)
    dispatch(updateRequestData({ image_url: updatedFiles }))

    // If setUploadedImages is provided, call it with the updated files
    if (setUploadedImages) {
      setUploadedImages(updatedFiles)
    }
  }

  const isVideoFile = filename => {
    if (!filename) return false
    const videoExtensions = ['.mp4', '.mov', '.avi']
    return videoExtensions.some(ext => typeof filename === 'string' && filename.toLowerCase().endsWith(ext))
  }

  const renderPreview = (file, index) => {
    const fileUrl = typeof file === 'string' ? `${URL_SERVER_IMAGE}${file}` : URL.createObjectURL(file)

    if (isVideoFile(typeof file === 'string' ? file : file.name)) {
      return (
        <div key={index} className={styles.filePreviewContainer}>
          <div className={styles.videoWrapper}>
            <video className={styles.previewVideo} controls>
              <source src={fileUrl} type="video/mp4" />
              Trình duyệt của bạn không hỗ trợ video.
            </video>
          </div>
          <button className={styles.removeFileButton} onClick={() => handleRemoveFile(index)}>
            <CloseOutlined />
          </button>
        </div>
      )
    }

    return (
      <div key={index} className={styles.filePreviewContainer}>
        <img src={fileUrl} alt={`Uploaded ${index + 1}`} className={styles.previewImage} />
        <button className={styles.removeFileButton} onClick={() => handleRemoveFile(index)}>
          <CloseOutlined />
        </button>
      </div>
    )
  }

  return (
    <div className={styles.contentWrapper}>
      <div className={styles.titleWrap} ref={titleRef}>
        <TextArea
          status={errorPost?.title ? 'error' : ''}
          variant={errorPost?.title ? 'outlined' : 'borderless'}
          autoSize={{ minRows: 3, maxRows: 8 }}
          placeholder={
            errorPost?.title ? errorPost.title : `${user.name} ơi, hãy điền nội dung mô tả đồ bạn muốn đổi nhé!`
          }
          value={requestData.title || ''}
          onChange={handleTitleChange}
          style={{ width: '100%', borderRadius: '0' }}
          ref={el => {
            setTimeout(() => el?.focus(), 0)
          }}
        />
      </div>

      <div ref={imageRef}>
        {requestData.image_url && requestData.image_url.length > 0 && (
          <div className={styles.uploadedFiles}>
            {requestData.image_url.map((file, index) => renderPreview(file, index))}
          </div>
        )}
      </div>

      {isShowEmoji && (
        <div className={styles.emojiPickerContainer}>
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
    </div>
  )
}

export default PostContent
