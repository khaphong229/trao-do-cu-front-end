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
  // Extract all props to determine which handler to use
  const { contentType } = props

  // Create a post handler or exchange request handler based on contentType
  if (contentType === 'exchangeRequest') {
    return <ExchangeRequestContent {...props} />
  }

  // Default to regular post content
  return <RegularPostContent {...props} />
}

// Component for regular posts
const RegularPostContent = ({ ref2, errorPost, setErrorPost }) => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { isShowEmoji, dataCreatePost } = useSelector(state => state.post)

  const handleEmojiClick = emojiObject => {
    const updatedDescription = (dataCreatePost.title || '') + emojiObject.emoji
    dispatch(updatePostData({ title: updatedDescription }))
  }

  const handleRemoveFile = indexToRemove => {
    const updatedFiles = dataCreatePost.image_url.filter((_, index) => index !== indexToRemove)

    dispatch(
      updatePostData({
        image_url: updatedFiles
      })
    )
  }

  const isVideoFile = filename => {
    const videoExtensions = ['.mp4', '.mov', '.avi']
    return videoExtensions.some(ext => filename.toLowerCase().endsWith(ext))
  }

  const renderPreview = (file, index) => {
    const fileUrl = `${URL_SERVER_IMAGE}${file}`

    if (isVideoFile(file)) {
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
    <div className={styles.contentWrapper}>
      <div className={styles.titleWrap} ref={ref2}>
        <TextArea
          status={errorPost?.title ? 'error' : ''}
          variant={errorPost?.title ? 'outlined' : 'borderless'}
          autoSize={{ minRows: 3, maxRows: 8 }}
          placeholder={
            errorPost?.title ? errorPost.title : `${user.name} ơi, bạn đang muốn trao đổi hay cho đi gì thế?`
          }
          value={dataCreatePost.title}
          onChange={e => {
            dispatch(updatePostData({ title: e.target.value }))
            setErrorPost(null)
          }}
          style={{ width: '100%', borderRadius: '0' }}
          ref={el => {
            setTimeout(() => el?.focus(), 0)
          }}
        />
      </div>

      {dataCreatePost.image_url && dataCreatePost.image_url.length > 0 && (
        <div className={styles.uploadedFiles}>
          {dataCreatePost.image_url.map((file, index) => renderPreview(file, index))}
        </div>
      )}

      {isShowEmoji && (
        <div className={styles.emojiPickerContainer}>
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
    </div>
  )
}

// Component for exchange requests
const ExchangeRequestContent = ({ errorPost, setErrorPost, uploadedImages }) => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { isShowEmoji, requestData } = useSelector(state => state.exchangeRequest)

  const handleEmojiClick = emojiObject => {
    const updatedDescription = (requestData.description || '') + emojiObject.emoji
    dispatch(updateRequestData({ description: updatedDescription }))
  }

  const handleRemoveFile = indexToRemove => {
    const updatedFiles = requestData.image_url.filter((_, index) => index !== indexToRemove)

    dispatch(
      updateRequestData({
        image_url: updatedFiles
      })
    )
  }

  const isVideoFile = filename => {
    const videoExtensions = ['.mp4', '.mov', '.avi']
    return videoExtensions.some(ext => filename.toLowerCase().endsWith(ext))
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
      <div className={styles.titleWrap}>
        <TextArea
          status={errorPost?.title ? 'error' : ''}
          variant={errorPost?.title ? 'outlined' : 'borderless'}
          autoSize={{ minRows: 3, maxRows: 8 }}
          placeholder={
            errorPost?.title ? errorPost.title : `${user.name} ơi, hãy điền nội dung mô tả đồ bạn muốn đổi nhé!`
          }
          value={requestData.title}
          onChange={e => {
            dispatch(updateRequestData({ title: e.target.value }))
            setErrorPost(prev => (prev ? { ...prev, title: null } : null))
          }}
          style={{ width: '100%', borderRadius: '0' }}
          ref={el => {
            setTimeout(() => el?.focus(), 0)
          }}
        />
      </div>

      {requestData.image_url && requestData.image_url.length > 0 && (
        <div className={styles.uploadedFiles}>
          {requestData.image_url.map((file, index) => renderPreview(file, index))}
        </div>
      )}

      {isShowEmoji && (
        <div className={styles.emojiPickerContainer}>
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
    </div>
  )
}

export default PostContent
