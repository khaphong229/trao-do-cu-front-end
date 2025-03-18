import React from 'react'
import { Modal, Button, Image } from 'antd'
import { URL_SERVER_IMAGE } from 'config/url_server'

const QRImageModal = ({ isOpen, handleOpenQr, handleCancelQR, qrImageUrl }) => {
  return (
    <Modal
      title="Mã QR Code Thành Công"
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
      <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
        <Image src={`${URL_SERVER_IMAGE}${qrImageUrl}`} alt="QR Code" width={200} preview={false} />
      </div>
    </Modal>
  )
}

export default QRImageModal
