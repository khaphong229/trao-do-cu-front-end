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
  setLocationModalVisible,
  setShowEmoji,
  setSocialLinkModalVisible,
  setCategoryModalVisible
} from 'features/client/request/exchangeRequest/exchangeRequestSlice'

const PostToolbar = ({ phoneRef, facebookRef, locationRef, categoryRef, errors, onChange }) => {
  const { isShowEmoji, requestData } = useSelector(state => state.exchangeRequest)
  const dispatch = useDispatch()
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

  const handleFileChange = ({ fileList }) => {
    setFileList(fileList)
    // Extract the actual file objects and pass them to parent component for upload
    const files = fileList.filter(file => file.originFileObj).map(file => file.originFileObj)

    if (files.length > 0) {
      // Call the parent component's upload handler
      onChange('files', files)
    }
  }

  const uploadButton = (
    <Button
      type="text"
      icon={<PictureOutlined className={styles.iconPicture} />}
      disabled={requestData.image_url?.length >= 5}
    />
  )

  const icons = [
    {
      tooltip: 'Ảnh/Video',
      icon: <PictureOutlined className={styles.iconPicture} />,
      isUpload: true,
      onClick: null,
      disabled: requestData.image_url?.length >= 5,
      ref: null
    },
    {
      tooltip: 'Liên kết mạng xã hội',
      icon: <WhatsAppOutlined className={styles.customIcon} />,
      isUpload: false,
      onClick: () => dispatch(setSocialLinkModalVisible(true)),
      ref: facebookRef
    },
    {
      tooltip: 'Emoji',
      icon: <SmileOutlined className={styles.iconSmile} />,
      isUpload: false,
      onClick: () => dispatch(setShowEmoji(!isShowEmoji)),
      ref: null
    },
    {
      tooltip: 'Thêm vị trí',
      icon: <EnvironmentOutlined className={styles.iconEnvironment} />,
      isUpload: false,
      onClick: () => dispatch(setLocationModalVisible(true)),
      ref: locationRef
    },
    {
      tooltip: 'Chọn danh mục',
      icon: <AppstoreOutlined className={styles.iconCategory} />,
      isUpload: false,
      onClick: () => dispatch(setCategoryModalVisible(true)),
      ref: categoryRef
    }
  ]

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
                setFileList={handleFileChange}
                uploadButton={uploadButton}
                maxCount={5 - (requestData.image_url?.length || 0)}
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
                  setFileList={handleFileChange}
                  uploadButton={
                    <div className={styles.mobileIconWrapper}>
                      {item.icon}
                      <span className={styles.iconLabel}>{item.tooltip}</span>
                    </div>
                  }
                  maxCount={5 - (requestData.image_url?.length || 0)}
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
