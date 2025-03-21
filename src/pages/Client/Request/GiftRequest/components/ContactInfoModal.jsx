import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Form, Modal, Input, message, Tooltip, Typography, Checkbox } from 'antd'
import { setInfoModalVisible } from 'features/client/request/giftRequest/giftRequestSlice'
import { getCurrentUser } from 'features/auth/authThunks'
import AddressSelection from 'components/common/AddressSelection'
import styles from './styles.module.scss'
const { Text } = Typography

export const ContactInfoModal = ({ onSubmit }) => {
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  const [fullAddress, setFullAddress] = useState('')
  const [addressTouched, setAddressTouched] = useState(false)
  const [isPtiterChecked, setIsPtiterChecked] = useState(false)

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
      const wasPtiter = user.isPtiter

      setFullAddress(user?.address || '')
      setAddressTouched(false)
      setIsPtiterChecked(wasPtiter || false)

      form.setFieldsValue({
        phone: existingPhone || '',
        social_media: existingFacebook || '',
        isPtiter: wasPtiter || false
      })
    }
  }, [user, isInfoModalVisible, form])

  const handleAddressChange = address => {
    setFullAddress(address)
    setAddressTouched(true)
  }

  // Hàm kiểm tra số điện thoại Việt Nam
  const validatePhoneNumber = phone => {
    // Kiểm tra định dạng số điện thoại Việt Nam (bắt đầu bằng 0, có 10 số)
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/
    return phoneRegex.test(phone)
  }

  // Kiểm tra link Facebook
  const validateFacebookLink = link => {
    if (!link) return true
    // Kiểm tra link có chứa facebook.com hoặc fb.com
    return link.includes('facebook.com') || link.includes('fb.com')
  }

  // Kiểm tra xem có ít nhất một phương thức liên hệ
  const validateContactMethod = (phone, facebook) => {
    return !!(phone || facebook)
  }

  const handleCheckboxChange = e => {
    setIsPtiterChecked(e.target.checked)
    form.setFieldsValue({ isPtiter: e.target.checked })
  }

  const handleSubmit = async values => {
    try {
      setAddressTouched(true)
      let hasError = false

      // Kiểm tra địa chỉ
      if (!fullAddress) {
        message.error('Vui lòng nhập địa chỉ đầy đủ')
        hasError = true
        return
      }

      // Kiểm tra số điện thoại nếu đã nhập
      if (values.phone) {
        if (!validatePhoneNumber(values.phone)) {
          message.error('Số điện thoại không đúng định dạng (VD: 0912345678)')
          hasError = true
          return
        }
      }

      // Kiểm tra link Facebook nếu đã nhập
      if (values.social_media) {
        if (!validateFacebookLink(values.social_media)) {
          message.error('Link Facebook không hợp lệ, phải chứa facebook.com hoặc fb.com')
          hasError = true
          return
        }
      }

      // Kiểm tra có ít nhất một phương thức liên hệ
      if (!validateContactMethod(values.phone, values.social_media)) {
        message.error('Vui lòng cung cấp ít nhất một phương thức liên hệ (Số điện thoại hoặc Facebook)')
        hasError = true
        return
      }

      if (hasError) {
        return
      }

      // Tạo dữ liệu gửi đi
      const submissionData = {
        phone: values.phone,
        isPtiter: isPtiterChecked, // Use the state variable instead of form value
        address: [
          {
            address: fullAddress,
            isDefault: true
          }
        ],
        social_media: {
          facebook: values.social_media,
          zalo: user.social_media?.zalo || '',
          instagram: user.social_media?.instagram || ''
        }
      }

      await onSubmit(submissionData)
    } catch (error) {
      message.error('Có lỗi xảy ra khi cập nhật thông tin')
    }
  }

  const handleCancel = () => {
    form.resetFields()
    setFullAddress('')
    setAddressTouched(false)
    setIsPtiterChecked(false)
    dispatch(setInfoModalVisible(false))
  }

  return (
    <Modal title="Cập nhật thông tin" open={isInfoModalVisible} onCancel={handleCancel} footer={null}>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item name="isPtiter" label={null} valuePropName="checked">
          <Checkbox onChange={handleCheckboxChange} checked={isPtiterChecked}>
            Là sinh viên PTIT
          </Checkbox>
        </Form.Item>
        <div style={{ marginBottom: 10 }}>
          <span style={{ color: '#ff4d4f', marginRight: 4 }}>*</span>
          <Tooltip title="Cung cấp ít nhất một phương thức liên hệ của bạn">Phương thức liên hệ</Tooltip>
        </div>
        <div style={{ paddingLeft: 20 }}>
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              {
                required: false,
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

          <div className={styles.note} style={{ marginTop: -8, marginBottom: 16 }}>
            <Text type="secondary" style={{ fontSize: '12px', color: '#2E8B57' }}>
              * Chọn ít nhất 1 trong 2 phương thức liên hệ
            </Text>
          </div>
        </div>

        <Form.Item
          label="Địa chỉ"
          required
          validateStatus={addressTouched && !fullAddress ? 'error' : ''}
          help={addressTouched && !fullAddress ? 'Vui lòng nhập địa chỉ đầy đủ' : null}
        >
          <AddressSelection
            initialAddress={user?.address?.address}
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
