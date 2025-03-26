import React from 'react'
import { message, Upload } from 'antd'

function UploadCustom(props) {
  const {
    fileList,
    setFileList,
    uploadButton,
    disabled = false,
    maxCount = 5,
    onUploadSuccess,
    beforeUpload: propBeforeUpload
  } = props

  const beforeUpload = file => {
    // Existing validation logic remains the same
    if (propBeforeUpload) {
      const result = propBeforeUpload(file)
      if (result === false || result === Upload.LIST_IGNORE) {
        return result
      }
    }

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
      const isValidSize = file.size / 1024 / 1024 < 5
      if (!isValidSize) {
        message.error('Mỗi video phải nhỏ hơn 5MB!')
        return Upload.LIST_IGNORE
      }
    }

    return true
  }

  const uploadProps = {
    multiple: true,
    fileList: fileList || [],
    beforeUpload: beforeUpload,
    disabled: disabled,
    maxCount: maxCount,
    customRequest: ({ file, onSuccess }) => {
      // Just mark the file as done without actually uploading
      setTimeout(() => {
        onSuccess(null)
      }, 0)
    },
    showUploadList: false,
    onChange: info => {
      // Only trigger onUploadSuccess when all files are done
      const doneFiles = info.fileList.filter(f => f.status === 'done')

      // Update fileList
      setFileList(info.fileList)

      // If all files are processed, call onUploadSuccess with the done files
      if (doneFiles.length === info.fileList.length && onUploadSuccess) {
        const files = doneFiles.map(f => f.originFileObj)
        onUploadSuccess(files)
      }
    }
  }

  return <Upload {...uploadProps}>{uploadButton}</Upload>
}

export default UploadCustom
