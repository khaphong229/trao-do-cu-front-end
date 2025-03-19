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

  // Clear loading state when fileList is empty or all files are done
  useEffect(() => {
    const allCompleted = fileList.every(file => file.status === 'done' || file.status === 'error')

    if (fileList.length === 0 || allCompleted) {
      setIsLoading(false)
    } else {
      setIsLoading(true)
    }
  }, [fileList])

  const handleUploadSuccess = uploadedUrls => {
    setUploadedFiles(prev => [...prev, ...uploadedUrls])
  }

  // Process uploaded files only when they're available and not loading
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

      // Reset uploaded files list after processing
      setUploadedFiles([])
    }
  }, [uploadedFiles, isLoading, dispatch, contentType, imageUrls])

  const handleFileUpload = newFileList => {
    setFileList(newFileList.fileList)
  }

  const handleBeforeUpload = file => {
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
        <Spin spinning={isLoading} tip="Đang tải ảnh lên..." wrapperClassName={styles.uploadSpinner}>
          <UploadCustom
            fileList={fileList}
            setFileList={handleFileUpload}
            uploadButton={uploadButton}
            maxCount={maxImages}
            disabled={maxImages <= 0 || isLoading}
            type={contentType === 'exchange' ? 'exchange' : 'post'}
            onUploadSuccess={handleUploadSuccess}
            beforeUpload={handleBeforeUpload}
            setIsLoading={setIsLoading} // Pass down setIsLoading function
            showUploadList={false} // Always set to false to hide the filename display
          />
        </Spin>
      </div>
    </div>
  )
}

export default PostToolbar
