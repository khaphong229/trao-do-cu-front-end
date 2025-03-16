import React, { useState } from 'react'
import { Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import styles from '../scss/PostToolbar.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import UploadCustom from 'components/common/UploadCustom'
import { updatePostData } from 'features/client/post/postSlice'
import { updateRequestData } from 'features/client/request/exchangeRequest/exchangeRequestSlice'

const PostToolbar = ({
  contentType,
  imageRef,
  // New tour-specific refs
  imageToolRef
}) => {
  const dispatch = useDispatch()

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

  const [fileList, setFileList] = useState([])
  const maxImages = 10 - (imageUrls?.length || 0)

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

  const uploadButton = (
    <Button ref={imageToolRef || imageRef} type="text" icon={<UploadOutlined />} disabled={maxImages <= 0}>
      Tải ảnh/video sản phẩm
    </Button>
  )

  return (
    <div className={styles.postTools}>
      <div className={styles.toolsButtons}>
        <UploadCustom
          fileList={fileList}
          setFileList={handleFileUpload}
          uploadButton={uploadButton}
          maxCount={maxImages}
          disabled={maxImages <= 0}
          type={contentType === 'exchange' ? 'exchange' : 'post'}
          onUploadSuccess={handleUploadSuccess}
        />
      </div>
    </div>
  )
}

export default PostToolbar
