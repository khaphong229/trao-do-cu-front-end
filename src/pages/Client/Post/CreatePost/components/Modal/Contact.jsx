import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Form, Modal, Radio, Input, message, Tooltip } from 'antd'
import { setInfoModalVisible } from 'features/client/request/giftRequest/giftRequestSlice'
import { getCurrentUser } from 'features/auth/authThunks'
import AddressSelection from 'components/common/AddressSelection'
import { setSocialLinkModalVisibility } from 'features/client/post/postSlice'

export const ContactInfoModal = ({ onSubmit }) => {
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  const [contactMethod, setContactMethod] = useState('')
  const [fullAddress, setFullAddress] = useState('')
  const [addressTouched, setAddressTouched] = useState(false)

  const { isInfoModalVisible, isLoading } = useSelector(state => state.giftRequest)
  const { isSocialLinkModalVisible } = useSelector(state => state.post)
  const { user } = useSelector(state => state.auth)

  useEffect(() => {
    if (isSocialLinkModalVisible && !user) {
      dispatch(getCurrentUser())
    }
  }, [isSocialLinkModalVisible, user, dispatch])

  useEffect(() => {
    if (user && isSocialLinkModalVisible) {
      const existingFacebook = user.social_media?.facebook || ''
      const existingPhone = user.phone

      const initialMethod = existingPhone ? 'phone' : 'social_media'
      setContactMethod(initialMethod)
      setFullAddress(user?.address || '')
      setAddressTouched(false)

      form.setFieldsValue({
        contact_method: initialMethod,
        phone: existingPhone || '',
        facebook: existingFacebook
      })
    }
  }, [user, isSocialLinkModalVisible, form])

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

      // Create the proper social_media structure based on contact method
      const submissionData = {
        ...values,
        address: fullAddress
      }

      // Handle social media data structure correctly
      if (values.contact_method === 'social_media') {
        submissionData.social_media = {
          facebook: values.facebook || '',
          zalo: user?.social_media?.zalo || '',
          instagram: user?.social_media?.instagram || ''
        }
        // Remove the individual facebook field
        delete submissionData.facebook
      } else {
        // For phone contact method, ensure social_media is preserved if it exists
        if (user?.social_media) {
          submissionData.social_media = { ...user.social_media }
        }
      }

      await onSubmit(submissionData)
      dispatch(setSocialLinkModalVisibility(false))
    } catch (error) {
      message.error('Có lỗi xảy ra khi cập nhật thông tin')
    }
  }

  const handleCancel = () => {
    form.resetFields()
    setFullAddress('')
    setAddressTouched(false)
    dispatch(setSocialLinkModalVisibility(false))
  }

  return (
    <Modal title="Cập nhật thông tin liên hệ" open={isSocialLinkModalVisible} onCancel={handleCancel} footer={null}>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          name="contact_method"
          label={<Tooltip title="Tùy chọn 1 trong 2 cách thức liên hệ">Phương thức liên hệ</Tooltip>}
          rules={[{ required: true, message: 'Vui lòng chọn phương thức liên hệ' }]}
        >
          <Radio.Group onChange={e => setContactMethod(e.target.value)}>
            <Radio value="phone">Số điện thoại</Radio>
            <Radio value="social_media">Facebook</Radio>
          </Radio.Group>
        </Form.Item>

        {contactMethod === 'phone' && (
          <Form.Item name="phone" label="Số điện thoại">
            <Input placeholder="Nhập số điện thoại của bạn" />
          </Form.Item>
        )}

        {contactMethod === 'social_media' && (
          <Form.Item name="facebook" label="Link mạng xã hội Facebook">
            <Input placeholder="Nhập link Facebook của bạn" />
          </Form.Item>
        )}

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
