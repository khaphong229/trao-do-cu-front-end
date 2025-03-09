import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Form, Modal, Radio, Input, message, Tooltip } from 'antd'
import { setInfoModalVisible } from 'features/client/request/giftRequest/giftRequestSlice'
import { getCurrentUser } from 'features/auth/authThunks'
import AddressSelection from 'components/common/AddressSelection'

export const ContactInfoModal = ({ onSubmit }) => {
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  const [contactMethod, setContactMethod] = useState('')
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

      const initialMethod = existingPhone ? 'phone' : 'social_media'
      setContactMethod(initialMethod)
      setFullAddress(user?.address || '')
      setAddressTouched(false)

      form.setFieldsValue({
        contact_method: initialMethod,
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

      // Luôn bao gồm cả phone và social_media trong dữ liệu gửi đi,
      // bất kể phương thức liên hệ được chọn là gì
      const submissionData = {
        ...values,
        address: fullAddress,
        phone: values.phone || '', // Luôn gửi phone nếu có
        social_media: values.social_media || '' // Luôn gửi social_media nếu có
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
        <Form.Item
          name="contact_method"
          label={<Tooltip title="Tùy chọn 1 trong 2 cách thức liên hệ chính">Phương thức liên hệ chính</Tooltip>}
          rules={[{ required: true, message: 'Vui lòng chọn phương thức liên hệ chính' }]}
        >
          <Radio.Group onChange={e => setContactMethod(e.target.value)}>
            <Radio value="phone">Số điện thoại</Radio>
            <Radio value="social_media">Facebook</Radio>
          </Radio.Group>
        </Form.Item>

        {/* Hiển thị cả hai trường nhưng chỉ yêu cầu bắt buộc cho phương thức được chọn */}
        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[
            {
              required: contactMethod === 'phone',
              message: 'Vui lòng nhập số điện thoại của bạn'
            }
          ]}
        >
          <Input placeholder="Nhập số điện thoại của bạn" />
        </Form.Item>

        <Form.Item
          name="social_media"
          label="Link mạng xã hội Facebook"
          rules={[
            {
              required: contactMethod === 'social_media',
              message: 'Vui lòng nhập link mạng xã hội của bạn'
            }
          ]}
        >
          <Input placeholder="Nhập link mạng xã hội của bạn" />
        </Form.Item>

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
