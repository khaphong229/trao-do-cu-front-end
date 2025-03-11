import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Form, Modal, Input, message, Tooltip, Typography } from 'antd'
import { setInfoModalVisible } from 'features/client/request/giftRequest/giftRequestSlice'
import { getCurrentUser } from 'features/auth/authThunks'
import AddressSelection from 'components/common/AddressSelection'

const { Text } = Typography

export const ContactInfoModal = ({ onSubmit }) => {
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  const [fullAddress, setFullAddress] = useState('')
  const [addressTouched, setAddressTouched] = useState(false)

  const { isInfoModalVisible, isLoading } = useSelector(state => state.giftRequest)
  const { user } = useSelector(state => state.auth)

  useEffect(() => {
    if (isInfoModalVisible && !user) {
      dispatch(getCurrentUser())
    }
  }, [isInfoModalVisible, user, dispatch])

  useEffect(() => {
    if (user && isInfoModalVisible) {
      const existingFacebook = user.social_media?.facebook
      const existingPhone = user.phone

      setFullAddress(user?.address || '')
      setAddressTouched(false)

      form.setFieldsValue({
        phone: existingPhone || '',
        social_media: existingFacebook || ''
      })
    }
  }, [user, isInfoModalVisible, form])

  const handleAddressChange = address => {
    setFullAddress(address)
    setAddressTouched(true)
  }

  const handleSubmit = async values => {
    try {
      setAddressTouched(true)

      if (!fullAddress) {
        message.error('Vui lòng nhập địa chỉ đầy đủ')
        return
      }

      // Tạo dữ liệu gửi đi
      const submissionData = {
        ...values,
        address: fullAddress,
        social_media: {
          facebook: values.social_media,
          zalo: user.social_media?.zalo || '',
          instagram: user.social_media?.instagram || ''
        }
      }

      await onSubmit(submissionData)
      dispatch(setInfoModalVisible(false))
    } catch (error) {
      message.error('Có lỗi xảy ra khi cập nhật thông tin')
    }
  }

  const handleCancel = () => {
    form.resetFields()
    setFullAddress('')
    setAddressTouched(false)
    dispatch(setInfoModalVisible(false))
  }

  return (
    <Modal title="Cập nhật thông tin liên hệ" open={isInfoModalVisible} onCancel={handleCancel} footer={null}>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <div style={{ marginBottom: 16 }}>
          <span style={{ color: '#ff4d4f', marginRight: 4 }}>*</span>
          <Tooltip title="Cung cấp thông tin liên hệ của bạn">Phương thức liên hệ</Tooltip>
        </div>

        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập số điện thoại của bạn'
            }
          ]}
          style={{ marginTop: 0, marginBottom: 16 }}
        >
          <Input placeholder="Nhập số điện thoại của bạn" />
        </Form.Item>

        <Form.Item
          name="social_media"
          label="Link mạng xã hội Facebook"
          rules={[
            {
              required: false,
              message: 'Vui lòng nhập link mạng xã hội của bạn'
            }
          ]}
          style={{ marginBottom: 8 }}
        >
          <Input placeholder="Nhập link mạng xã hội của bạn" />
        </Form.Item>

        <div style={{ marginTop: -8, marginBottom: 16 }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            * Chọn 1 trong 2 phương thức liên hệ
          </Text>
        </div>

        <Form.Item
          label="Địa chỉ"
          required
          validateStatus={addressTouched && !fullAddress ? 'error' : ''}
          help={addressTouched && !fullAddress ? 'Vui lòng nhập địa chỉ đầy đủ' : null}
        >
          <AddressSelection
            initialAddress={user?.address}
            onAddressChange={handleAddressChange}
            showEditButton={true}
          />
        </Form.Item>

        <Form.Item className="form-actions">
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Cập nhật
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ContactInfoModal
