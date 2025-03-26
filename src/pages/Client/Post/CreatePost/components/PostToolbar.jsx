import React, { useState } from 'react'
import { Button, Spin } from 'antd'
import { UploadOutlined, LoadingOutlined } from '@ant-design/icons'
import styles from '../scss/PostToolbar.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import UploadCustom from 'components/common/UploadCustom'
import { updatePostData } from 'features/client/post/postSlice'
import { updateRequestData } from 'features/client/request/exchangeRequest/exchangeRequestSlice'

const PostToolbar = ({ contentType, imageRef }) => {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)
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

  const handleUploadSuccess = files => {
    setIsLoading(false)

    // Filter out duplicates and only add new files
    const newFiles = files.filter(
      file =>
        !imageUrls.some(existingUrl => (typeof existingUrl === 'string' ? existingUrl.includes(file.name) : false))
    )

    if (newFiles.length > 0) {
      if (contentType === 'exchange') {
        dispatch(
          updateRequestData({
            image_url: [...(imageUrls || []), ...newFiles]
          })
        )
      } else {
        dispatch(
          updatePostData({
            image_url: [...(imageUrls || []), ...newFiles]
          })
        )
      }
    }
  }

  const handleBeforeUpload = file => {
    setIsLoading(true)
    return true
  }

  const uploadButton = (
    <Button
      ref={imageRef}
      type="text"
      icon={isLoading ? <LoadingOutlined spin /> : <UploadOutlined />}
      disabled={maxImages <= 0 || isLoading}
    >
      {isLoading ? 'Đang xử lý...' : 'Tải ảnh/video sản phẩm'}
    </Button>
  )

  return (
    <div className={styles.postTools}>
      <div className={styles.toolsButtons}>
        <Spin
          spinning={isLoading}
          tip="Đang xử lý..."
          wrapperClassName={styles.uploadSpinner}
          indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
        >
          <UploadCustom
            fileList={fileList}
            setFileList={setFileList}
            uploadButton={uploadButton}
            maxCount={maxImages}
            disabled={maxImages <= 0 || isLoading}
            onUploadSuccess={handleUploadSuccess}
            beforeUpload={handleBeforeUpload}
            showUploadList={false}
          />
        </Spin>
      </div>
    </div>
  )
}

export default PostToolbar
