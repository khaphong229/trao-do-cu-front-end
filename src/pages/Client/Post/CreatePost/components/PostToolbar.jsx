import React, { useEffect, useState } from 'react'
import { Button, Tooltip } from 'antd'
import {
  PictureOutlined,
  SmileOutlined,
  EnvironmentOutlined,
  WhatsAppOutlined,
  AppstoreOutlined
} from '@ant-design/icons'
import styles from '../scss/PostToolbar.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import UploadCustom from 'components/common/UploadCustom'
import {
  setLocationModalVisibility,
  setShowEmoji as setPostShowEmoji,
  setSocialLinkModalVisibility,
  setCategoryModalVisibility
} from 'features/client/post/postSlice'
import { setShowEmoji as setExchangeShowEmoji } from 'features/client/request/exchangeRequest/exchangeRequestSlice'
import { updatePostData } from 'features/client/post/postSlice'
import { updateRequestData } from 'features/client/request/exchangeRequest/exchangeRequestSlice'

const PostToolbar = ({
  contentType,
  onChange,
  phoneRef,
  facebookRef,
  locationRef,
  categoryRef,
  imageRef,
  // New tour-specific refs
  imageToolRef,
  socialLinkToolRef,
  locationToolRef,
  categoryToolRef
}) => {
  const dispatch = useDispatch()

  const { isShowEmoji, imageUrls } = useSelector(state => {
    if (contentType === 'exchange') {
      return {
        isShowEmoji: state.exchangeRequest.isShowEmoji || false,
        imageUrls: state.exchangeRequest.requestData?.image_url || []
      }
    } else {
      return {
        isShowEmoji: state.post.isShowEmoji || false,
        imageUrls: state.post.dataCreatePost?.image_url || []
      }
    }
  })

  const [fileList, setFileList] = useState([])
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const maxImages = 5 - (imageUrls?.length || 0)

  // Handle successful upload
  const handleUploadSuccess = uploadedUrls => {
    if (contentType === 'exchange') {
      dispatch(
        updateRequestData({
          image_url: [...(imageUrls || []), ...uploadedUrls]
        })
      )
    } else {
      dispatch(
        updatePostData({
          image_url: [...(imageUrls || []), ...uploadedUrls]
        })
      )
    }
  }

  const handleFileUpload = ({ fileList }) => {
    setFileList(fileList)
  }

  const toggleEmojiPicker = () => {
    if (contentType === 'exchange') {
      dispatch(setExchangeShowEmoji(!isShowEmoji))
    } else {
      dispatch(setPostShowEmoji(!isShowEmoji))
    }
  }

  const uploadButton = (
    <Button
      ref={imageToolRef || imageRef}
      type="text"
      icon={<PictureOutlined className={styles.iconPicture} />}
      disabled={maxImages <= 0}
    />
  )

  let icons = [
    {
      ref: imageToolRef || imageRef,
      tooltip: 'Ảnh/Video',
      icon: <PictureOutlined className={styles.iconPicture} />,
      isUpload: true,
      onClick: null,
      disabled: maxImages <= 0
    }
    // {
    //   ref: socialLinkToolRef || facebookRef,
    //   tooltip: 'Liên kết mạng xã hội',
    //   icon: <WhatsAppOutlined className={styles.customIcon} />,
    //   isUpload: false,
    //   onClick: () => dispatch(setSocialLinkModalVisibility(true))
    // },
    // {
    //   ref: locationToolRef || locationRef,
    //   tooltip: 'Thêm vị trí',
    //   icon: <EnvironmentOutlined className={styles.iconEnvironment} />,
    //   isUpload: false,
    //   onClick: () => dispatch(setLocationModalVisibility(true))
    // }
  ]

  if (contentType === 'post') {
    icons.push({
      ref: categoryToolRef || categoryRef,
      tooltip: 'Chọn danh mục',
      icon: <AppstoreOutlined className={styles.iconCategory} />,
      isUpload: false,
      onClick: () => dispatch(setCategoryModalVisibility(true))
    })
  }

  const renderDesktopToolbar = () => (
    <div className={styles.postTools}>
      <div className={styles.toolsText}>
        {contentType === 'post' ? 'Thêm vào bài đăng của bạn' : 'Thêm vào biểu mẫu của bạn'}
      </div>
      <div className={styles.toolsButtons}>
        {icons.map((item, index) => {
          if (item.isUpload) {
            return (
              <UploadCustom
                key={index}
                fileList={fileList}
                setFileList={handleFileUpload}
                uploadButton={uploadButton}
                maxCount={maxImages}
                disabled={item.disabled}
                type={contentType === 'exchange' ? 'exchange' : 'post'}
                onUploadSuccess={handleUploadSuccess}
              />
            )
          }
          return (
            <Button key={index} ref={item.ref} type="text" onClick={item.onClick}>
              <Tooltip title={item.tooltip} placement="top">
                {item.icon}
              </Tooltip>
            </Button>
          )
        })}
      </div>
    </div>
  )

  const renderMobileToolbar = () => (
    <div className={styles.mobilePostTools}>
      <div className={styles.mobileToolsText}>
        {contentType === 'post' ? 'Thêm vào bài đăng của bạn' : 'Thêm vào biểu mẫu của bạn'}
      </div>
      <div className={styles.mobileToolsButtons}>
        {icons.map((item, index) => {
          if (item.isUpload) {
            return (
              <div className={styles.mobileToolItem} key={index}>
                <UploadCustom
                  fileList={fileList}
                  setFileList={handleFileUpload}
                  uploadButton={
                    <div className={styles.mobileIconWrapper} ref={item.ref}>
                      {item.icon}
                      <span className={styles.iconLabel}>{item.tooltip}</span>
                    </div>
                  }
                  maxCount={maxImages}
                  disabled={item.disabled}
                  type={contentType === 'exchange' ? 'exchange' : 'post'}
                  onUploadSuccess={handleUploadSuccess}
                />
              </div>
            )
          }
          return (
            <div key={index} className={styles.mobileToolItem} onClick={item.onClick} ref={item.ref}>
              <div className={styles.mobileIconWrapper}>
                {item.icon}
                <span className={styles.iconLabel}>{item.tooltip}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  return isMobile ? renderMobileToolbar() : renderDesktopToolbar()
}

export default PostToolbar
