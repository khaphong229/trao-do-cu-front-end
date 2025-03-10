import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Form, Modal, Radio, Input, message, Tooltip } from 'antd'
import { getCurrentUser } from 'features/auth/authThunks'
import { setSocialLinkModalVisibility } from 'features/client/post/postSlice'

export const ContactInfoModal = ({ onSubmit }) => {
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  const [contactMethod, setContactMethod] = useState('')

  const { isLoading } = useSelector(state => state.giftRequest)
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

      form.setFieldsValue({
        contact_method: initialMethod,
        phone: existingPhone || '',
        facebook: existingFacebook
      })
    }
  }, [user, isSocialLinkModalVisible, form])

  const handleSubmit = async values => {
    try {
      const submissionData = {
        ...values
      }

      if (values.contact_method === 'social_media') {
        submissionData.social_media = values.facebook || user?.social_media?.facebook || ''
      } else {
        submissionData.phone = values.phone || user?.phone || ''
      }

      if (typeof onSubmit === 'function') {
        await onSubmit(submissionData)
        dispatch(setSocialLinkModalVisibility(false))
      } else {
        message.error('Có lỗi xảy ra khi cập nhật thông tin: onSubmit is not a function')
      }
    } catch (error) {
      message.error('Có lỗi xảy ra khi cập nhật thông tin')
    }
  }

  const handleCancel = () => {
    form.resetFields()
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
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
          >
            <Input placeholder="Nhập số điện thoại của bạn" />
          </Form.Item>
        )}

        {contactMethod === 'social_media' && (
          <Form.Item
            name="facebook"
            label="Link mạng xã hội Facebook"
            rules={[{ required: true, message: 'Vui lòng nhập link Facebook' }]}
          >
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
