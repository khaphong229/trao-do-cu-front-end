import React, { useState, useEffect } from 'react'
import { Button, Spin } from 'antd'
import { UploadOutlined, LoadingOutlined } from '@ant-design/icons'
import styles from '../scss/PostToolbar.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import UploadCustom from 'components/common/UploadCustom'
import { updatePostData } from 'features/client/post/postSlice'
import { updateRequestData } from 'features/client/request/exchangeRequest/exchangeRequestSlice'

const PostToolbar = ({ contentType, imageRef, imageToolRef }) => {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [fileList, setFileList] = useState([])

  const { imageUrls } = useSelector(state => {
    if (contentType === 'exchange') {
      return {
        imageUrls: state.exchangeRequest.requestData?.image_url || []
      }
    } else {
      return {
        imageUrls: state.post.dataCreatePost?.image_url || []
      }
    }
  })

  const maxImages = 10 - (imageUrls?.length || 0)

  // Handle successful upload
  const handleUploadSuccess = uploadedUrls => {
    setUploadedFiles(uploadedUrls)
    setIsLoading(false)
  }
  // Only update Redux after the loading is complete
  useEffect(() => {
    if (uploadedFiles.length > 0 && !isLoading) {
      if (contentType === 'exchange') {
        dispatch(
          updateRequestData({
            image_url: [...(imageUrls || []), ...uploadedFiles]
          })
        )
      } else {
        dispatch(
          updatePostData({
            image_url: [...(imageUrls || []), ...uploadedFiles]
          })
        )
      }
      setUploadedFiles([])
    }
  }, [uploadedFiles, isLoading])

  const handleFileUpload = ({ fileList }) => {
    setFileList(fileList)
  }

  const handleBeforeUpload = () => {
    setIsLoading(true)
    return true
  }
  const uploadButton = (
    <Button
      ref={imageToolRef || imageRef}
      type="text"
      icon={isLoading ? <LoadingOutlined spin /> : <UploadOutlined />}
      disabled={maxImages <= 0 || isLoading}
    >
      {isLoading ? 'Đang tải...' : 'Tải ảnh/video sản phẩm'}
    </Button>
  )

  return (
    <div className={styles.postTools}>
      <div className={styles.toolsButtons}>
        <Spin
          spinning={isLoading}
          tip="Đang tải ảnh lên..."
          wrapperClassName={styles.uploadSpinner}
          indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
        >
          <UploadCustom
            fileList={fileList}
            setFileList={handleFileUpload}
            uploadButton={uploadButton}
            maxCount={maxImages}
            disabled={maxImages <= 0 || isLoading}
            type={contentType === 'exchange' ? 'exchange' : 'post'}
            onUploadSuccess={handleUploadSuccess}
            beforeUpload={handleBeforeUpload}
          />
        </Spin>
      </div>
    </div>
  )
}

export default PostToolbar
