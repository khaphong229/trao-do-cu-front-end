import React from 'react'
import { Modal, Typography, Button, Divider } from 'antd'

const { Title, Paragraph, Text } = Typography

const PrivacyPolicy = ({ isOpen, handleCancel }) => {
  return (
    <Modal
      title={<Title level={4}>Chính Sách Bảo Mật</Title>}
      open={isOpen}
      onOk={handleCancel}
      onCancel={handleCancel}
      width={800}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Đóng
        </Button>,
        <Button key="ok" type="primary" onClick={handleCancel}>
          Tôi đồng ý
        </Button>
      ]}
    >
      <div style={{ maxHeight: '70vh', overflow: 'auto', padding: '0 16px' }}>
        <section>
          <Title level={5}>1. Giới thiệu</Title>
          <Paragraph>
            Chào mừng bạn đến với <Text strong>traodocu.vn</Text>, nền tảng hỗ trợ trao đổi, tặng đồ cũ miễn phí giữa
            cộng đồng. Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn và đảm bảo rằng mọi dữ liệu được thu thập, lưu
            trữ, xử lý đều tuân thủ quy định về quyền riêng tư và bảo mật thông tin.
          </Paragraph>
          <Paragraph>
            Chính sách bảo mật này giúp bạn hiểu cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ thông tin cá nhân
            của bạn khi sử dụng dịch vụ của chúng tôi.
          </Paragraph>
        </section>

        <Divider />

        <section>
          <Title level={5}>2. Thông tin chúng tôi thu thập</Title>
          <Title level={5}>2.1 Thông tin do bạn cung cấp</Title>
          <Paragraph>
            Khi đăng ký tài khoản và sử dụng dịch vụ, bạn có thể cần cung cấp:
            <ul>
              <li>
                <Text strong>Thông tin cá nhân</Text>: Họ tên, địa chỉ email, số điện thoại, ảnh đại diện.
              </li>
              <li>
                <Text strong>Thông tin bài đăng</Text>: Hình ảnh, mô tả sản phẩm, địa điểm giao dịch.
              </li>
              <li>
                <Text strong>Thông tin liên hệ</Text>: Khi bạn gửi yêu cầu hỗ trợ hoặc phản hồi.
              </li>
              <li>
                <Text strong>Thông tin xác thực</Text>: Nếu có xác minh danh tính.
              </li>
            </ul>
          </Paragraph>

          <Title level={5}>2.2 Thông tin thu thập tự động</Title>
          <Paragraph>
            <ul>
              <li>
                <Text strong>Dữ liệu thiết bị</Text>: Loại thiết bị, hệ điều hành, trình duyệt web, địa chỉ IP.
              </li>
              <li>
                <Text strong>Lịch sử hoạt động</Text>: Các bài đăng bạn xem, tìm kiếm, tương tác.
              </li>
              <li>
                <Text strong>Cookies và công nghệ theo dõi</Text>: Lưu thông tin cá nhân hóa trải nghiệm.
              </li>
            </ul>
          </Paragraph>
        </section>

        <Divider />

        <section>
          <Title level={5}>3. Cách chúng tôi sử dụng thông tin</Title>
          <Paragraph>
            Chúng tôi sử dụng thông tin cá nhân của bạn nhằm mục đích:
            <ul>
              <li>Cung cấp và duy trì dịch vụ: Đăng bài, tìm kiếm, tương tác trên nền tảng.</li>
              <li>Cải thiện trải nghiệm người dùng: Đề xuất bài đăng phù hợp với sở thích.</li>
              <li>Hỗ trợ khách hàng: Giải quyết các yêu cầu hỗ trợ, báo cáo vi phạm.</li>
              <li>Đảm bảo an toàn: Xác minh tài khoản, phát hiện gian lận.</li>
              <li>Tiếp thị và thông báo: Gửi email cập nhật, thông báo ưu đãi.</li>
            </ul>
          </Paragraph>
        </section>

        <Divider />

        <section>
          <Title level={5}>4. Chia sẻ thông tin với bên thứ ba</Title>
          <Paragraph>
            Chúng tôi chỉ chia sẻ thông tin trong các trường hợp:
            <ul>
              <li>Khi có sự đồng ý của bạn</li>
              <li>Tuân thủ quy định pháp luật</li>
              <li>Bảo vệ quyền lợi của traodocu.vn và người dùng</li>
              <li>Hợp tác với đối tác dịch vụ</li>
            </ul>
          </Paragraph>
        </section>

        <Divider />

        <section>
          <Title level={5}>5. Bảo vệ thông tin cá nhân</Title>
          <Paragraph>
            Các biện pháp bảo mật:
            <ul>
              <li>Mã hóa dữ liệu: Thông tin nhạy cảm được mã hóa.</li>
              <li>Kiểm soát quyền truy cập: Giới hạn người có quyền truy cập.</li>
              <li>Cảnh báo bảo mật: Phát hiện đăng nhập bất thường.</li>
              <li>Sao lưu và phục hồi dữ liệu: Bảo vệ trước sự cố.</li>
            </ul>
          </Paragraph>
        </section>

        <Divider />

        <section>
          <Title level={5}>6. Quyền lợi của bạn</Title>
          <Paragraph>
            Bạn có các quyền:
            <ul>
              <li>Truy cập và chỉnh sửa thông tin cá nhân</li>
              <li>Xóa tài khoản và dữ liệu</li>
              <li>Điều chỉnh quyền riêng tư</li>
              <li>Từ chối nhận thông báo</li>
            </ul>
          </Paragraph>
        </section>

        <Divider />

        <section>
          <Title level={5}>7. Lưu trữ dữ liệu</Title>
          <Paragraph>
            Chúng tôi lưu trữ thông tin cá nhân trong thời gian cần thiết để cung cấp dịch vụ và tuân thủ quy định pháp
            luật. Khi không còn cần thiết, chúng tôi sẽ xóa hoặc ẩn danh thông tin để bảo vệ quyền riêng tư của bạn.
          </Paragraph>
        </section>

        <Divider />

        <section>
          <Title level={5}>8. Thay đổi chính sách bảo mật</Title>
          <Paragraph>
            Chúng tôi có thể cập nhật chính sách bảo mật này theo thời gian. Bất kỳ thay đổi nào sẽ được thông báo trên
            website. Việc tiếp tục sử dụng dịch vụ sau khi chính sách được cập nhật có nghĩa là bạn đồng ý với các thay
            đổi đó.
          </Paragraph>
        </section>

        <Divider />

        <section>
          <Title level={5}>9. Liên hệ</Title>
          <Paragraph>
            Nếu có bất kỳ câu hỏi hoặc yêu cầu nào liên quan đến chính sách bảo mật, vui lòng liên hệ với chúng tôi:
            <br />
            <Text strong>Email</Text>: contact@traodocu.vn
            <br />
            <Text strong>Hotline</Text>: 0869 800 725
          </Paragraph>
        </section>
      </div>
    </Modal>
  )
}

export default PrivacyPolicy
