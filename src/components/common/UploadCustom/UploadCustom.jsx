import React from 'react'
import { message, Upload } from 'antd'
import { useDispatch } from 'react-redux'
import { uploadExchangeImages, uploadPostImages } from '../../../features/upload/uploadThunks'

function UploadCustom(props) {
  const {
    type = 'oke',
    fileList,
    setFileList,
    uploadButton,
    disabled = false,
    maxCount = 5,
    onUploadSuccess,
    beforeUpload: propBeforeUpload,
    setIsLoading
  } = props

  const dispatch = useDispatch()

  const handleUploadFile = async ({ file }) => {
    try {
      let response
      if (type !== 'exchange') {
        response = await dispatch(uploadPostImages(file)).unwrap()
      } else {
        response = await dispatch(uploadExchangeImages(file)).unwrap()
      }

      message.success('Tải ảnh/video thành công!') // Changed to "Tải ảnh thành công"

      // Check if this is the last file uploading
      const updatedFileList = fileList.map(f => (f.uid === file.uid ? { ...f, status: 'done' } : f))

      if (updatedFileList.every(f => f.status === 'done' || f.status === 'error')) {
        setIsLoading(false) // Force loading to false when all uploads complete
      }
    } catch (error) {
      message.error('Tải ảnh/video lên thất bại! Vui lòng thử lại.') // Changed to "Tải ảnh thất bại"

      // Check if all files are now either done or error
      const updatedFileList = fileList.map(f => (f.uid === file.uid ? { ...f, status: 'error' } : f))

      if (updatedFileList.every(f => f.status === 'done' || f.status === 'error')) {
        setIsLoading(false) // Force loading to false when all uploads complete with some errors
      }
    }
  }

  const beforeUpload = file => {
    // Call beforeUpload from props if available
    if (propBeforeUpload) {
      const result = propBeforeUpload(file)
      if (result === false || result === Upload.LIST_IGNORE) {
        setIsLoading(false)
        return result
      }
    }

    const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    const videoTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo']

    const isImage = imageTypes.includes(file.type)
    const isVideo = videoTypes.includes(file.type)

    if (!isImage && !isVideo) {
      message.error('Chỉ được tải JPG/PNG/GIF/WEBP hoặc video MP4/MOV/AVI!')
      setIsLoading(false)
      return Upload.LIST_IGNORE
    }

    if (isImage) {
      const isValidSize = file.size / 1024 / 1024 < 5
      if (!isValidSize) {
        message.error('Mỗi ảnh phải nhỏ hơn 5MB!')
        setIsLoading(false)
        return Upload.LIST_IGNORE
      }
    }

    if (isVideo) {
      const isValidSize = file.size / 1024 / 1024 < 5
      if (!isValidSize) {
        message.error('Mỗi video phải nhỏ hơn 5MB!')
        setIsLoading(false)
        return Upload.LIST_IGNORE
      }
    }

    return true
  }

  const uploadProps = {
    multiple: true,
    fileList: fileList.fileList || [],
    beforeUpload: beforeUpload,
    disabled: disabled,
    maxCount: maxCount,
    customRequest: handleUploadFile,
    showUploadList: false,
    onChange: info => {
      // Update the fileList with current status
      setFileList(info)

      if (info.file.status === 'done') {
        message.success(`${info.file.name} tải ảnh thành công`) // Changed message here too
        if (onUploadSuccess) {
          onUploadSuccess([info.file.response])
        }

        // Check if all files are complete
        if (info.fileList.every(file => file.status === 'done' || file.status === 'error')) {
          setIsLoading(false) // Ensure loading state is turned off when all files complete
        }
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} tải ảnh thất bại`) // Changed message here too

        // Check if all files are complete
        if (info.fileList.every(file => file.status === 'done' || file.status === 'error')) {
          setIsLoading(false) // Ensure loading state is turned off when all files complete with some errors
        }
      }
    }
  }

  return <Upload {...uploadProps}>{uploadButton}</Upload>
}

export default UploadCustom
