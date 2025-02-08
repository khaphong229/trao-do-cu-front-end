import React, { useState, useEffect } from 'react'
import { Modal, Input, message, Form, Radio } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { updateUserProfile, getCurrentUser } from 'features/auth/authThunks'
import { setSocialLinkModalVisible } from 'features/client/request/exchangeRequest/exchangeRequestSlice'

const ContactModal = () => {
  const dispatch = useDispatch()
  const { isSocialLinkModalVisible } = useSelector(state => state.exchangeRequest)
  const { user } = useSelector(state => state.auth)

  const [form] = Form.useForm()
  const [linkType, setLinkType] = useState('facebook')

  useEffect(() => {
    if (isSocialLinkModalVisible && !user) {
      dispatch(getCurrentUser())
    }
  }, [dispatch, isSocialLinkModalVisible, user])

  useEffect(() => {
    if (user && isSocialLinkModalVisible) {
      const existingFacebook = user.social_media?.[0] || ''
      const existingPhone = user.phone || ''

      form.setFieldsValue({
        facebookLink: existingFacebook,
        phone: existingPhone
      })
    }
  }, [user, form, isSocialLinkModalVisible])

  const handleSave = () => {
    form
      .validateFields()
      .then(values => {
        const updateData = {
          name: user.name || '',
          email: user.email || '',
          social_media: [],
          phone: null
        }

        if (values.facebookLink) {
          updateData.social_media.push(values.facebookLink)
        } else if (user.social_media?.[0]) {
          updateData.social_media.push(user.social_media[0])
        }

        if (values.phone) {
          updateData.phone = values.phone
        } else {
          updateData.phone = user.phone
        }

        dispatch(updateUserProfile(updateData))
          .then(response => {
            if (response.meta.requestStatus === 'fulfilled') {
              message.success('Thông tin đã được cập nhật thành công!')
              dispatch(setSocialLinkModalVisible(false))
            } else {
              const errorDetails = response.payload?.detail || {}
              const errorMessages = Object.values(errorDetails)
              const errorMessage =
                errorMessages.length > 0
                  ? errorMessages[0]
                  : response.payload?.message || 'Cập nhật không thành công. Vui lòng thử lại.'

              message.error(errorMessage)
            }
          })
          .catch(error => {
            message.error(error || 'Đã có lỗi xảy ra. Vui lòng thử lại.')
          })
      })
      .catch(errorInfo => {
        const errorFields = errorInfo.errorFields.map(field => field.errors[0])
        if (errorFields.length > 0) {
          message.error(errorFields[0])
        }
      })
  }

  return (
    <Modal
      title="Cập nhật thông tin liên hệ"
      open={isSocialLinkModalVisible}
      onCancel={() => dispatch(setSocialLinkModalVisible(false))}
      onOk={handleSave}
      okText="Lưu"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical">
        <Form.Item label="Loại thông tin" name="linkType">
          <Radio.Group
            value={linkType}
            onChange={e => setLinkType(e.target.value)}
            defaultValue="facebook"
            buttonStyle="solid"
          >
            <Radio.Button value="facebook">Facebook</Radio.Button>
            <Radio.Button value="phone">Số điện thoại</Radio.Button>
          </Radio.Group>
        </Form.Item>

        {linkType === 'facebook' && (
          <Form.Item
            name="facebookLink"
            label="Link Facebook"
            rules={[
              {
                pattern: /^(https?:\/\/)?(www\.)?facebook\.com\/.+$/,
                message: 'Vui lòng nhập link Facebook hợp lệ'
              }
            ]}
          >
            <Input placeholder="Nhập link Facebook của bạn" />
          </Form.Item>
        )}

        {linkType === 'phone' && (
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              {
                pattern: /^(0[3|5|7|8|9])+([0-9]{8})$/,
                message: 'Vui lòng nhập số điện thoại hợp lệ'
              }
            ]}
          >
            <Input placeholder="Nhập số điện thoại của bạn" />
          </Form.Item>
        )}
      </Form>
    </Modal>
  )
}

export default ContactModal
