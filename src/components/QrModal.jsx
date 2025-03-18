import React from 'react'
import { Modal, Button, Image } from 'antd'
import { URL_SERVER_IMAGE } from 'config/url_server'
import { CircleAlert } from 'lucide-react'

const QRImageModal = ({ isOpen, handleCancelQR, qrImageUrl }) => {
  return (
    <Modal
      title="Mã QR Code"
      open={isOpen}
      onOk={handleCancelQR}
      onCancel={handleCancelQR}
      footer={[
        <Button key="back" onClick={handleCancelQR}>
          Đóng
        </Button>
      ]}
      centered
    >
      <p>
        <CircleAlert width={16} height={16} style={{ marginRight: 6 }} />
        Vui lòng đưa QR này cho Ban Tổ Chức kiểm tra bạn đã trao đồ thành công!
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
        <Image src={`${URL_SERVER_IMAGE}${qrImageUrl}`} alt="QR Code" width={200} preview={false} />
      </div>
    </Modal>
  )
}

export default QRImageModal
