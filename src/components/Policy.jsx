import React from 'react'
import { Modal, Typography, Button, List, Divider } from 'antd'

const { Title, Paragraph, Text } = Typography

const Policy = ({ isOpen, handleCancel }) => {
  const termsData = [
    'Giả mạo danh tính hoặc mạo danh người khác để lừa đảo.',
    'Dùng từ ngữ thiếu văn minh khi trao đổi trên nền tảng.',
    'Gửi spam, quảng cáo trái phép hoặc phát tán virus, mã độc.',
    'Lợi dụng nền tảng để thu thập dữ liệu cá nhân của người khác.',
    'Người dùng phải đủ 15 tuổi trở lên hoặc có sự giám sát của phụ huynh/người giám hộ khi tham gia nền tảng.',
    'Cấm mọi hành vi gian lận, lạm dụng hệ thống hoặc thực hiện các hoạt động gây ảnh hưởng tiêu cực đến cộng đồng.',
    'Không sử dụng nền tảng để quảng cáo hoặc trao đổi các mặt hàng vi phạm pháp luật (ví dụ: chất cấm, vũ khí, động vật quý hiếm…).',
    'Người tặng phải mô tả chính xác tình trạng món đồ. Không được đăng tin giả mạo hoặc lừa đảo.',
    'Ảnh sản phẩm phải rõ ràng, không chứa nội dung phản cảm hoặc vi phạm quyền riêng tư của người khác.',
    'Nếu món đồ đã được trao đi, người tặng có trách nhiệm đánh dấu bài đăng là "Đã hoàn thành" để tránh gây hiểu lầm.',
    'Người dùng phải cung cấp thông tin đúng sự thật khi đăng ký tài khoản.',
    'Mỗi người chỉ được phép sở hữu một tài khoản duy nhất. Nghiêm cấm tạo nhiều tài khoản để trục lợi.',
    'Nếu phát hiện hành vi gian lận, tài khoản có thể bị tạm khóa hoặc xóa vĩnh viễn.',
    'Chúng tôi không chịu trách nhiệm với các tranh chấp giữa người dùng trong quá trình trao đổi đồ.',
    'Nếu có hành vi vi phạm nghiêm trọng, chúng tôi có quyền báo cáo cơ quan chức năng để xử lý theo pháp luật.',
    'Chúng tôi có thể cập nhật các điều khoản sử dụng theo thời gian. Nếu có thay đổi quan trọng, người dùng sẽ được thông báo trước khi áp dụng.'
  ]

  return (
    <>
      <Modal
        title={<Title level={4}>Điều khoản sử dụng Trao Đồ Cũ</Title>}
        open={isOpen}
        onOk={handleCancel}
        onCancel={handleCancel}
        width={700}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Đóng
          </Button>,
          <Button key="ok" type="primary" onClick={handleCancel}>
            Tôi đồng ý
          </Button>
        ]}
      >
        <Paragraph>
          <Text strong>Chào mừng bạn đến với nền tảng Trao Đồ Cũ!</Text> Khi sử dụng nền tảng của chúng tôi, bạn đồng ý
          tuân thủ các điều khoản sau đây:
        </Paragraph>

        <Divider />

        <List
          dataSource={termsData}
          renderItem={item => (
            <List.Item>
              <Text>{item}</Text>
            </List.Item>
          )}
          size="small"
          bordered
        />

        <Divider />

        <Paragraph>
          <Text type="secondary">
            Bằng cách nhấn "Tôi đồng ý", bạn xác nhận đã đọc và chấp nhận tất cả các điều khoản sử dụng của Trao Đồ Cũ.
          </Text>
        </Paragraph>
      </Modal>
    </>
  )
}

export default Policy
