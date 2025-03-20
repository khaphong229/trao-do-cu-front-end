import React, { useState } from 'react'
import { Row, Col, Typography, Space, Divider } from 'antd'
import { MailOutlined, EnvironmentOutlined, PhoneOutlined } from '@ant-design/icons'
import styles from './styles.module.scss'
import { useNavigate } from 'react-router-dom'
import Policy from 'components/Policy'
import PrivacyPolicy from 'components/PrivacyPolicy'

const { Title, Text, Link } = Typography

function AppFooter() {
  const navigate = useNavigate()

  const goHome = () => {
    navigate('/')
  }

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false)
  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const handlePrivacyCancel = () => {
    setIsPrivacyOpen(false)
  }

  return (
    <div>
      <footer className={styles.footerWrap}>
        <Row gutter={[32, 0]}>
          {/* Cột đầu tiên */}
          <Col xs={24} sm={24} md={8}>
            <div style={{ textAlign: 'left' }}>
              <div>
                <span className={styles.textLogo} onClick={goHome}>
                  TRAO ĐỒ CŨ
                </span>
              </div>
              <Text className={styles.slogan}>
                Trao Đồ Cũ tự hào là nền tảng kết nối cộng đồng trao đổi đồ dễ dàng, nhanh chóng và hiệu quả.
              </Text>
              <Text className={styles.text}>
                <EnvironmentOutlined style={{ marginRight: 8 }} />
                Địa chỉ: 122 Hoàng Quốc Việt, Q.Cầu Giấy, Hà Nội
              </Text>
              <Text className={styles.text}>
                <MailOutlined style={{ marginRight: 8 }} />
                Email: contact@traodocu.vn
              </Text>
              <Text className={styles.text}>
                <PhoneOutlined style={{ marginRight: 8 }} />
                Hotline: 0869 800 725
              </Text>
              <Text className={styles.text}>Sản phẩm được bảo trợ bởi Đoàn Thanh Niên</Text>
            </div>
          </Col>

          {/* Cột thứ 2 */}
          <Col xs={24} sm={8} md={8}>
            <Title level={5} className={styles.title}>
              Về Chúng Tôi
            </Title>
            <Row gutter={[16, 8]}>
              <Col xs={24} sm={24} xl={6}>
                <Space direction="vertical" size={0} className={styles.linkContainer}>
                  <Link
                    href="https://www.facebook.com/photo?fbid=122106469844798247&set=a.122101845656798247"
                    className={styles.link}
                  >
                    Giới Thiệu
                  </Link>
                  <Link href="/post/category/all" className={styles.link}>
                    Sản Phẩm
                  </Link>
                  <Link href="https://www.facebook.com/profile.php?id=61573947424629" className={styles.link}>
                    Liên Hệ
                  </Link>
                </Space>
              </Col>
              <Col xs={24} sm={24} xl={18}>
                <div className={styles.facebookContainer}>
                  <iframe
                    src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fprofile.php%3Fid%3D61573947424629&tabs=timeline&width=340&height=130&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
                    width="100%"
                    height="130"
                    style={{ border: 'none', overflow: 'hidden' }}
                    scrolling="no"
                    frameBorder="0"
                    allowTransparency="true"
                    allow="encrypted-media"
                  ></iframe>
                </div>
              </Col>
            </Row>

            {/* Facebook Page Plugin */}
          </Col>

          {/* Cột thứ 3 */}
          <Col xs={24} sm={8} md={8}>
            <Title level={5} className={styles.title}>
              Hỗ Trợ Khách Hàng
            </Title>
            <Space direction="vertical" size={0} className={styles.linkContainer}>
              <Link href="https://help.traodocu.vn/" target="_blank" className={styles.link}>
                Câu Hỏi Thường Gặp (FAQ)
              </Link>
              <Link onClick={() => setIsPrivacyOpen(true)} className={styles.link}>
                Chính Sách Bảo Mật
              </Link>
              <Link onClick={() => setIsModalOpen(true)} className={styles.link}>
                Điều khoản sử dụng
              </Link>
            </Space>

            {/* Form đăng ký */}
            {/* <div className={styles.subscribeContainer}>
              <Title level={5} className={styles.subscribeTitle}>
                Đăng ký nhận tin
              </Title>
              <Form onFinish={handleSubscribe}>
                <Form.Item name="email" rules={[{ required: true, message: 'Vui lòng nhập email!' }]}>
                  <Input.Group compact>
                    <Input
                      placeholder="Nhập email của bạn"
                      className={styles.subscribeInput}
                      style={{ width: '200px' }}
                    />
                    <Button
                      type="primary"
                      htmlType="submit"
                      icon={<SendOutlined />}
                      className={styles.subscribeButton}
                      style={{ width: '40px' }}
                    />
                  </Input.Group>
                </Form.Item>
              </Form>
            </div> */}
          </Col>
        </Row>

        <Divider style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '30px 0 20px' }} />
        <Policy isOpen={isModalOpen} handleCancel={handleCancel} />
        <PrivacyPolicy isOpen={isPrivacyOpen} handleCancel={handlePrivacyCancel} />
        <div style={{ textAlign: 'center', fontSize: 14, color: '#adb5bd' }}>
          © {new Date().getFullYear()} TRAO ĐỒ CŨ. Tất cả các quyền được bảo lưu.
        </div>
      </footer>
    </div>
  )
}

export default AppFooter
