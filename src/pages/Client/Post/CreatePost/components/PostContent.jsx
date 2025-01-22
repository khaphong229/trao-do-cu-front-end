import React from 'react'
import { Image, Input } from 'antd'
import EmojiPicker from 'emoji-picker-react'
import styles from '../scss/PostContent.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { updatePostData } from 'features/client/post/postSlice'
import { CloseOutlined } from '@ant-design/icons'
import { URL_SERVER_IMAGE } from '../../../../../config/url_server'

const { TextArea } = Input

const PostContent = ({ ref2, errorPost, setErrorPost }) => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { isShowEmoji, dataCreatePost } = useSelector(state => state.post)

  const handleEmojiClick = emojiObject => {
    const updatedDescription = (dataCreatePost.description || '') + emojiObject.emoji
    dispatch(updatePostData({ description: updatedDescription }))
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
        <Input
          status={errorPost?.title ? 'error' : ''}
          variant={errorPost?.title ? 'outlined' : 'borderless'}
          placeholder={errorPost?.title ? errorPost.title : 'Nhập tiêu đề bài đăng *'}
          value={dataCreatePost.title}
          onChange={e => {
            dispatch(updatePostData({ title: e.target.value }))
            setErrorPost(null)
          }}
          style={{ width: '100%', borderRadius: '0' }}
        />
      </div>

      <div className={styles.postContent}>
        <TextArea
          placeholder={`${user.name} ơi, bạn đang muốn trao đổi hay cho đi gì thế?`}
          autoSize={{ minRows: 3, maxRows: 8 }}
          bordered={false}
          value={dataCreatePost.description}
          onChange={e => dispatch(updatePostData({ description: e.target.value }))}
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

export default PostContent
