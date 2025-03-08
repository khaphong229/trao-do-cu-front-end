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
  setShowEmoji,
  setSocialLinkModalVisibility,
  setCategoryModalVisibility
} from 'features/client/post/postSlice'

const PostToolbar = ({ ref3, ref4, ref5, ref6, phoneRef, facebookRef, locationRef, categoryRef, imageRef }) => {
  const { isShowEmoji, dataCreatePost, requestData } = useSelector(state => ({
    isShowEmoji: state.post.isShowEmoji || state.exchangeRequest.isShowEmoji,
    dataCreatePost: state.post.dataCreatePost || {},
    requestData: state.exchangeRequest.requestData || {}
  }))
  const dispatch = useDispatch()
  const [fileList, setFileList] = useState([])
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  const maxImages = 5 - (dataCreatePost.image_url?.length || requestData.image_url?.length || 0)

  const uploadButton = (
    <Button
      ref={ref3 || imageRef}
      type="text"
      icon={<PictureOutlined className={styles.iconPicture} />}
      disabled={maxImages <= 0}
    />
  )

  const icons = [
    {
      ref: imageRef || ref3,
      tooltip: 'Ảnh/Video',
      icon: <PictureOutlined className={styles.iconPicture} />,
      isUpload: true,
      onClick: null,
      disabled: maxImages <= 0
    },
    {
      ref: facebookRef || ref4,
      tooltip: 'Liên kết mạng xã hội',
      icon: <WhatsAppOutlined className={styles.customIcon} />,
      isUpload: false,
      onClick: () => dispatch(setSocialLinkModalVisibility(true))
    },
    {
      ref: null,
      tooltip: 'Emoji',
      icon: <SmileOutlined className={styles.iconSmile} />,
      isUpload: false,
      onClick: () => dispatch(setShowEmoji(!isShowEmoji))
    },
    {
      ref: locationRef || ref5,
      tooltip: 'Thêm vị trí',
      icon: <EnvironmentOutlined className={styles.iconEnvironment} />,
      isUpload: false,
      onClick: () => dispatch(setLocationModalVisibility(true))
    },
    {
      ref: categoryRef || ref6,
      tooltip: 'Chọn danh mục',
      icon: <AppstoreOutlined className={styles.iconCategory} />,
      isUpload: false,
      onClick: () => dispatch(setCategoryModalVisibility(true))
    }
  ]

  // Desktop version
  const renderDesktopToolbar = () => (
    <div className={styles.postTools}>
      <div className={styles.toolsText}>Thêm vào bài đăng của bạn</div>
      <div className={styles.toolsButtons}>
        {icons.map((item, index) => {
          if (item.isUpload) {
            return (
              <UploadCustom
                key={index}
                fileList={fileList}
                setFileList={({ fileList }) => setFileList(fileList)}
                uploadButton={uploadButton}
                maxCount={maxImages}
                disabled={item.disabled}
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

  // Mobile version
  const renderMobileToolbar = () => (
    <div className={styles.mobilePostTools}>
      <div className={styles.mobileToolsText}>Thêm vào bài đăng của bạn</div>
      <div className={styles.mobileToolsButtons}>
        {icons.map((item, index) => {
          if (item.isUpload) {
            return (
              <div className={styles.mobileToolItem} key={index}>
                <UploadCustom
                  fileList={fileList}
                  setFileList={({ fileList }) => setFileList(fileList)}
                  uploadButton={
                    <div className={styles.mobileIconWrapper}>
                      {item.icon}
                      <span className={styles.iconLabel}>{item.tooltip}</span>
                    </div>
                  }
                  maxCount={maxImages}
                  disabled={item.disabled}
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
