import React from 'react'
import { message, Upload } from 'antd'
import { useDispatch } from 'react-redux'
import { uploadExchangeImages, uploadPostImages } from '../../../features/upload/uploadThunks'

function UploadCustom(props) {
  const { type = 'oke', fileList, setFileList, uploadButton, disabled = false, maxCount = 5 } = props

  const dispatch = useDispatch()

  const handleUploadFile = async ({ file, onSuccess, onError }) => {
    try {
      if (type !== 'exchange') {
        await dispatch(uploadPostImages(file)).unwrap()
      } else {
        await dispatch(uploadExchangeImages(file)).unwrap()
      }
    } catch (error) {
      message.error(error?.message || 'Tải file thất bại')
    }
  }

  const beforeUpload = file => {
    const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    const videoTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo']

    const isImage = imageTypes.includes(file.type)
    const isVideo = videoTypes.includes(file.type)

    if (!isImage && !isVideo) {
      message.error('Chỉ được tải JPG/PNG/GIF/WEBP hoặc video MP4/MOV/AVI!')
      return Upload.LIST_IGNORE
    }

    if (isImage) {
      const isValidSize = file.size / 1024 / 1024 < 2
      if (!isValidSize) {
        message.error('Mỗi ảnh phải nhỏ hơn 2MB!')
        return Upload.LIST_IGNORE
      }
    }

    if (isVideo) {
      const isValidSize = file.size / 1024 / 1024 < 10
      if (!isValidSize) {
        message.error('Mỗi video phải nhỏ hơn 10MB!')
        return Upload.LIST_IGNORE
      }
    }

    return true
  }

  const uploadProps = {
    multiple: true,
    fileList: fileList,
    beforeUpload: beforeUpload,
    disabled: disabled,
    maxCount: maxCount,
    customRequest: handleUploadFile,
    showUploadList: false,
    onChange: info => {
      setFileList(info)
      if (info.file.status === 'done') {
        // Additional handling if needed
      } else if (info.file.status === 'error') {
        // Additional error handling if needed
      }
    }
  }

  return <Upload {...uploadProps}>{uploadButton}</Upload>
}

export default UploadCustom
