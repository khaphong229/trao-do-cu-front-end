import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setAcceptModalVisible } from 'features/client/request/giftRequest/giftRequestSlice'
import { Alert, Form, Input, Modal, Spin } from 'antd'
import Marquee from 'react-fast-marquee'
export const GiftRequestConfirmModal = ({ onConfirm }) => {
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  const { isAcceptModalVisible, isLoading } = useSelector(state => state.giftRequest)
  const [localLoading, setLocalLoading] = React.useState(false)
  const { selectedPostExchange } = useSelector(state => state.exchangeRequest)
  const handleOk = async () => {
    try {
      setLocalLoading(true)
      const values = await form.validateFields()
      await onConfirm(values)
      form.resetFields()
    } catch (error) {
      // Handle error if needed
    } finally {
      setLocalLoading(false)
    }
  }

  const handleCancel = () => {
    dispatch(setAcceptModalVisible(false))
    form.resetFields()
  }

  const renderText = () => {
    if (selectedPostExchange?.pcoin_config) {
      if (
        selectedPostExchange?.pcoin_config?.required_amount === 0 ||
        selectedPostExchange?.pcoin_config?.required_amount === undefined
      ) {
        return 'Sản phẩm này miễn phí nhé bạn!'
      } else {
        return `Để nhận sản phẩm này bạn phải có ít nhất ${selectedPostExchange?.pcoin_config?.required_amount} P-Coin`
      }
    }
  }

  return (
    <Modal
      title="Xác nhận nhận đồ"
      open={isAcceptModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={isLoading || localLoading}
      okText={isLoading || localLoading ? <Spin size="small" /> : 'Xác nhận'}
      cancelText="Hủy"
    >
      {selectedPostExchange?.pcoin_config?.required_amount !== 0 &&
        selectedPostExchange?.pcoin_config?.required_amount !== undefined && (
          <Alert
            style={{
              marginBottom: 10
            }}
            banner
            message={
              <Marquee pauseOnHover gradient={false}>
                {renderText()}
              </Marquee>
            }
          />
        )}

      <Form form={form} layout="vertical">
        <Form.Item name="reason_receive" label={`Lý do muốn nhận (Không bắt buộc)`}>
          <Input.TextArea rows={4} placeholder="Nhập lý do bạn muốn nhận món đồ này" />
        </Form.Item>
      </Form>
    </Modal>
  )
}
