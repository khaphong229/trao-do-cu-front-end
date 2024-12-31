import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setAcceptModalVisible } from 'features/client/request/giftRequest/giftRequestSlice'
import { Form, Input, Modal } from 'antd'

export const GiftRequestConfirmModal = ({ onConfirm }) => {
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  const { isAcceptModalVisible, isLoading } = useSelector(state => state.giftRequest)

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      await onConfirm(values)
      form.resetFields()
    } catch (error) {}
  }

  const handleCancel = () => {
    dispatch(setAcceptModalVisible(false))
    form.resetFields()
  }

  return (
    <Modal
      title="Xác nhận nhận đồ"
      open={isAcceptModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={isLoading}
      okText="Xác nhận"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical">
        <Form.Item name="reason_receive" label={`Lý do muốn nhận (Không bắt buộc)`}>
          <Input.TextArea rows={4} placeholder="Nhập lý do bạn muốn nhận món đồ này" />
        </Form.Item>
      </Form>
    </Modal>
  )
}
