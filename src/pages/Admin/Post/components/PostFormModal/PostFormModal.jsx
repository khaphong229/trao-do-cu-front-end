import React, { useEffect, useState } from 'react'
import { Modal, Form, Input, Select, Button, Row, Col, message, Upload, InputNumber, Switch } from 'antd'
import {
  FileImageOutlined,
  TagOutlined,
  EnvironmentOutlined,
  GiftOutlined,
  WalletOutlined,
  ShoppingOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import styles from '../../styles.module.scss'
import { URL_SERVER_IMAGE } from 'config/url_server'
import { approvalStatus, getPostAdminPagination } from 'features/admin/post/postAdminThunks'

const { Option } = Select
const { TextArea } = Input
const { Dragger } = Upload

// Custom styles to remove dotted lines
const customStyles = {
  noDottedLines: {
    border: 'none',
    outline: 'none',
    background: 'transparent'
  },
  uploadArea: {
    border: '2px dashed #d9d9d9',
    borderRadius: '8px',
    background: '#fafafa',
    transition: 'border-color 0.3s'
  },
  uploadAreaHover: {
    borderColor: '#40a9ff'
  },
  imageGallery: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  imageGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  imageContainer: {
    width: '200px',
    height: '200px',
    margin: '8px',
    overflow: 'hidden',
    borderRadius: '4px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
  },
  editButton: {
    marginTop: '16px'
  }
}

const PostFormModal = ({ visible, isEditing, initialPost, onClose, categories, onSuccessUpdate }) => {
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const [imageFiles, setImageFiles] = useState([])
  const [imagePreview, setImagePreview] = useState([])
  const [isEditingImages, setIsEditingImages] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { current, pageSize } = useSelector(state => state.postManagement)

  // Set form values when editing
  useEffect(() => {
    if (visible && initialPost && isEditing) {
      // Prepare form values
      const formValues = {
        ...initialPost,
        title: initialPost.title || '',
        itemCode: initialPost.itemCode || '',
        type: initialPost.type || 'exchange',
        category_id: initialPost.category_id?._id || '',
        specificLocation: initialPost.specificLocation || '',
        isPtiterOnly: initialPost.isPtiterOnly || false,
        content: initialPost.content || '',
        pcoin_config: {
          reward_amount: initialPost.pcoin_config?.reward_amount || 0,
          required_amount: initialPost.pcoin_config?.required_amount || 0
        }
      }

      form.setFieldsValue(formValues)

      // Handle image preview
      if (initialPost.image_url && initialPost.image_url.length > 0) {
        const imageUrlArray = initialPost.image_url.map((url, index) => {
          const fullUrl = url.startsWith('http') ? url : `${URL_SERVER_IMAGE || ''}${url}`
          return {
            uid: `-${index}`,
            name: `image-${index}.jpg`,
            status: 'done',
            url: fullUrl,
            thumbUrl: fullUrl,
            response: 'ok'
          }
        })

        setImagePreview(imageUrlArray)
      }
    } else if (!visible) {
      form.resetFields()
      setImageFiles([])
      setImagePreview([])
      setIsSubmitting(false)
    }
  }, [visible, initialPost, form, isEditing])

  const handleSubmit = async values => {
    try {
      setIsSubmitting(true)

      if (isEditing && initialPost) {
        const { pcoin_config } = values

        const requestData = {
          id: initialPost._id,
          rewardAmount: pcoin_config.reward_amount,
          requiredAmount: pcoin_config.required_amount,
          isApproved: true,
          reason: ''
        }

        const result = await dispatch(approvalStatus(requestData)).unwrap()

        message.success('Cập nhật bài đăng thành công')
        await dispatch(getPostAdminPagination({ current, pageSize, forceRefresh: true })).unwrap()
        if (onSuccessUpdate) {
          onSuccessUpdate(result)
        }
        onClose()
      }
    } catch (error) {
      console.error('Update failed:', error)
      message.error('Cập nhật bài đăng thất bại: ' + (error.message || 'Đã xảy ra lỗi'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUpload = info => {
    // Filter out files with error or uploading status
    let fileList = info.fileList.filter(file => file.status !== 'error')

    // For each file waiting to be uploaded, immediately set the status to 'done'
    fileList = fileList.map(file => {
      if (file.status === 'uploading') {
        return { ...file, status: 'done', percent: 100 }
      }
      return file
    })

    setImagePreview(fileList)

    // Only add new files to imageFiles
    const newFile = info.file
    if (newFile.status === 'done' && newFile.originFileObj) {
      setImageFiles(prevFiles => {
        // Only add if not already in the array
        if (!prevFiles.some(f => f.uid === newFile.uid)) {
          return [...prevFiles, newFile.originFileObj]
        }
        return prevFiles
      })
    }
  }

  // Remove file from both preview and upload list
  const handleRemove = file => {
    setImagePreview(preview => preview.filter(item => item.uid !== file.uid))
    setImageFiles(files => files.filter(item => item.uid !== file.uid))
    return true
  }

  // Custom file list that can handle both existing and new uploads
  const normFile = e => {
    if (Array.isArray(e)) {
      return e
    }
    return e && e.fileList
  }

  // Add new function to handle edit mode toggle
  const toggleEditMode = () => {
    setIsEditingImages(!isEditingImages)
  }

  // Modify the image display section
  const renderImageSection = () => {
    return (
      <div className={styles.imageGallery}>
        <div className={styles.imageGrid}>
          {imagePreview.map((image, index) => (
            <div key={image.uid} className={styles.imageContainer}>
              <img src={image.url || image.thumbUrl} alt={`Product ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <Modal
      title="Chỉnh sửa bài đăng"
      open={visible}
      onCancel={onClose}
      width={800}
      footer={null}
      className={styles.postFormModal}
      maskClosable={!isSubmitting}
      closable={!isSubmitting}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit} className={styles.postForm}>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item name="title" label="Tên sản phẩm">
              <Input prefix={<ShoppingOutlined />} disabled />
            </Form.Item>
          </Col>
        </Row>

        <div style={{ marginBottom: '24px' }}>
          <div className="ant-form-item-label">
            <label>Ảnh sản phẩm</label>
          </div>
          {renderImageSection()}
        </div>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item name="type" label="Loại giao dịch">
              <Select disabled>
                <Option value="exchange">Trao đổi</Option>
                <Option value="gift">Trao tặng</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="category_id" label="Thể loại">
              <Select placeholder="Chọn thể loại" disabled>
                {categories?.map(category => (
                  <Option key={category._id} value={category._id}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="specificLocation" label="Địa chỉ">
          <Input prefix={<EnvironmentOutlined />} disabled />
        </Form.Item>

        <div className={styles.configSection}>
          <h3>Quản lý Pcoin</h3>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name={['pcoin_config', 'reward_amount']}
                label={
                  <span>
                    <GiftOutlined style={{ color: '#52c41a' }} /> Số Pcoin thưởng
                  </span>
                }
                rules={[{ required: true, message: 'Vui lòng nhập số Pcoin thưởng' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name={['pcoin_config', 'required_amount']}
                label={
                  <span>
                    <WalletOutlined style={{ color: '#1890ff' }} /> Số Pcoin yêu cầu
                  </span>
                }
                rules={[{ required: true, message: 'Vui lòng nhập số Pcoin yêu cầu' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </div>

        <Form.Item name="isPtiterOnly" label="Sản phẩm góc PTIT" valuePropName="checked">
          <Switch disabled />
        </Form.Item>

        <Form.Item className={styles.submitButton}>
          <Button type="primary" htmlType="submit" block loading={isSubmitting} disabled={isSubmitting}>
            Cập nhật
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default PostFormModal
