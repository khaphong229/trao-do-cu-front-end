import React, { useState, useMemo } from 'react'
import { Image, Input } from 'antd'
import EmojiPicker from 'emoji-picker-react'
import styles from '../scss/PostContent.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { updatePostData } from 'features/client/post/postSlice'
import { updateRequestData } from 'features/client/request/exchangeRequest/exchangeRequestSlice'
import { CloseOutlined } from '@ant-design/icons'
import { URL_SERVER_IMAGE } from '../../../../../config/url_server'
import debounce from 'lodash/debounce'

const { TextArea } = Input

const PostContent = props => {
  const { contentType, ref2 } = props

  if (contentType === 'exchange') {
    return <ExchangeRequestContent {...props} />
  } else {
    return <RegularPostContent {...props} ref2={ref2} />
  }
}

// Reusable function to create debounced update
const createDebouncedUpdate = updateAction => {
  return debounce(value => {
    updateAction({ title: value })
  }, 300) // 300ms delay before updating Redux
}

// Common file handling logic extracted to a hook
const useFileHandling = (imageUrlKey, updateAction, setUploadedImages) => {
  const dispatch = useDispatch()

  const handleRemoveFile = (indexToRemove, currentImageUrls) => {
    const updatedFiles = currentImageUrls.filter((_, index) => index !== indexToRemove)
    dispatch(updateAction({ [imageUrlKey]: updatedFiles }))

    // If setUploadedImages is provided, call it with the updated files
    if (setUploadedImages) {
      setUploadedImages(updatedFiles)
    }
  }

  const isVideoFile = file => {
    if (!file) return false

    if (typeof file === 'string') {
      const videoExtensions = ['.mp4', '.mov', '.avi']
      return videoExtensions.some(ext => file.toLowerCase().endsWith(ext))
    } else if (file.type) {
      // For File objects
      const videoTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo']
      return videoTypes.includes(file.type)
    }
    return false
  }

  const renderPreview = (file, index, currentImageUrls) => {
    // Handle both server URLs and File objects
    let fileUrl
    if (typeof file === 'string') {
      // String URLs from server
      fileUrl = `${URL_SERVER_IMAGE}${file}`
    } else if (file instanceof File) {
      // Direct File objects (or Blob)
      fileUrl = URL.createObjectURL(file)
    } else if (file && file.originFileObj) {
      // Ant Design Upload file objects
      fileUrl = URL.createObjectURL(file.originFileObj)
    } else {
      // Fallback
      console.warn('Unknown file type:', file)
      return null
    }

    const fileToCheck = file instanceof File ? file : file && file.originFileObj ? file.originFileObj : file

    if (isVideoFile(fileToCheck)) {
      return (
        <div key={index} className={styles.filePreviewContainer}>
          <div className={styles.videoWrapper}>
            <video className={styles.previewVideo} controls>
              <source src={fileUrl} type="video/mp4" />
              Trình duyệt của bạn không hỗ trợ video.
            </video>
          </div>
          <button className={styles.removeFileButton} onClick={() => handleRemoveFile(index, currentImageUrls)}>
            <CloseOutlined />
          </button>
        </div>
      )
    }

    return (
      <div key={index} className={styles.filePreviewContainer}>
        <Image src={fileUrl} alt={`Uploaded ${index + 1}`} className={styles.previewImage} />
        <button className={styles.removeFileButton} onClick={() => handleRemoveFile(index, currentImageUrls)}>
          <CloseOutlined />
        </button>
      </div>
    )
  }

  return { handleRemoveFile, isVideoFile, renderPreview }
}

// Component for regular posts
const RegularPostContent = ({ titleRef, imageRef, errorPost, setErrorPost, setUploadedImages, ref2 }) => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { isShowEmoji, dataCreatePost } = useSelector(state => state.post)

  // Local state for input
  const [localTitle, setLocalTitle] = useState(dataCreatePost.title || '')

  // Memoized debounced update function
  const debouncedUpdatePostData = useMemo(
    () => createDebouncedUpdate(data => dispatch(updatePostData(data))),
    [dispatch]
  )

  // File handling hooks
  const { renderPreview } = useFileHandling('image_url', updatePostData, setUploadedImages)

  // Handle title change
  const handleTitleChange = e => {
    const newValue = e.target.value
    setLocalTitle(newValue)

    // Clear previous error if present
    if (errorPost?.title) {
      setErrorPost(prev => (prev ? { ...prev, title: null } : null))
    }

    // Debounced Redux update
    debouncedUpdatePostData(newValue)
  }

  // Emoji click handler
  const handleEmojiClick = emojiObject => {
    const updatedDescription = (localTitle || '') + emojiObject.emoji
    setLocalTitle(updatedDescription)
    debouncedUpdatePostData(updatedDescription)
  }

  return (
    <div className={styles.contentWrapper} ref={ref2}>
      <div className={styles.titleWrap} ref={titleRef}>
        <TextArea
          status={errorPost?.title ? 'error' : ''}
          variant={errorPost?.title ? 'outlined' : 'borderless'}
          autoSize={{ minRows: 3, maxRows: 10 }}
          placeholder={
            errorPost?.title ? errorPost.title : `${user.name} ơi, bạn đang muốn trao đổi hay cho đi gì thế?`
          }
          value={localTitle}
          onChange={handleTitleChange}
          style={{ width: '100%', borderRadius: '0' }}
        />
      </div>

      <div ref={imageRef}>
        {dataCreatePost.image_url && dataCreatePost.image_url.length > 0 && (
          <div className={styles.uploadedFiles}>
            {dataCreatePost.image_url.map((file, index) => renderPreview(file, index, dataCreatePost.image_url))}
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

// Component for exchange requests (similar structure)
const ExchangeRequestContent = ({ titleRef, imageRef, errorPost, setErrorPost, uploadedImages, setUploadedImages }) => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { isShowEmoji, requestData } = useSelector(state => state.exchangeRequest)

  // Local state for input
  const [localTitle, setLocalTitle] = useState(requestData.title || '')

  // Memoized debounced update function
  const debouncedUpdateRequestData = useMemo(
    () => createDebouncedUpdate(data => dispatch(updateRequestData(data))),
    [dispatch]
  )

  // File handling hooks
  const { renderPreview } = useFileHandling('image_url', updateRequestData, setUploadedImages)

  // Handle title change
  const handleTitleChange = e => {
    const newValue = e.target.value
    setLocalTitle(newValue)

    // Clear previous error if present
    if (errorPost?.title) {
      setErrorPost(prev => (prev ? { ...prev, title: null } : null))
    }

    // Debounced Redux update
    debouncedUpdateRequestData(newValue)
  }

  // Emoji click handler
  const handleEmojiClick = emojiObject => {
    const updatedDescription = (localTitle || '') + emojiObject.emoji
    setLocalTitle(updatedDescription)
    debouncedUpdateRequestData(updatedDescription)
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
          value={localTitle}
          onChange={handleTitleChange}
          style={{ width: '100%', borderRadius: '0' }}
        />
      </div>

      <div ref={imageRef}>
        {requestData.image_url && requestData.image_url.length > 0 && (
          <div className={styles.uploadedFiles}>
            {requestData.image_url.map((file, index) => renderPreview(file, index, requestData.image_url))}
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
