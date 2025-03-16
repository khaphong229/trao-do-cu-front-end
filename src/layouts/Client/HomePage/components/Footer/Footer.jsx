import React from 'react'
import { Row, Col, Typography, Space, Divider } from 'antd'
import { MailOutlined, EnvironmentOutlined, PhoneOutlined } from '@ant-design/icons'
import styles from './styles.module.scss'
import { useNavigate } from 'react-router-dom'

const { Title, Text, Link } = Typography

function AppFooter() {
  const navigate = useNavigate()

  const goHome = () => {
    navigate('/')
  }

  const handleSubscribe = values => {
    console.log('Submitted email:', values.email)
    // Implement subscription logic here
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
                Email: axtralab.ptit@gmail.com
              </Text>
              <Text className={styles.text}>
                <PhoneOutlined style={{ marginRight: 8 }} />
                Hotline: 0869 800 725
              </Text>
            </div>
          </Col>

          {/* Cột thứ 2 */}
          <Col xs={24} sm={8} md={8}>
            <Title level={5} className={styles.title}>
              Về Chúng Tôi
            </Title>
            <Row gutter={[16, 8]}>
              <Col span={12}>
                <Space direction="vertical" size={0} className={styles.linkContainer}>
                  <Link href="/" className={styles.link}>
                    Trang Chủ
                  </Link>
                  <Link href="/" className={styles.link}>
                    Giới Thiệu
                  </Link>
                  <Link href="/" className={styles.link}>
                    Sản Phẩm
                  </Link>
                </Space>
              </Col>
              <Col span={12}>
                <Space direction="vertical" size={0} className={styles.linkContainer}>
                  <Link href="/" className={styles.link}>
                    Điều khoản
                  </Link>
                  <Link href="/" className={styles.link}>
                    Tin Tức
                  </Link>
                  <Link href="/" className={styles.link}>
                    Liên Hệ
                  </Link>
                </Space>
              </Col>
            </Row>

            {/* Facebook Page Plugin */}
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

          {/* Cột thứ 3 */}
          <Col xs={24} sm={8} md={8}>
            <Title level={5} className={styles.title}>
              Hỗ Trợ Khách Hàng
            </Title>
            <Space direction="vertical" size={0} className={styles.linkContainer}>
              <Link href="/" className={styles.link}>
                Trang Chủ
              </Link>
              <Link href="/" className={styles.link}>
                Giới Thiệu
              </Link>
              <Link href="/" className={styles.link}>
                Sản Phẩm
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

        <div style={{ textAlign: 'center', fontSize: 14, color: '#adb5bd' }}>
          © {new Date().getFullYear()} TRAO ĐỒ CŨ. Tất cả các quyền được bảo lưu.
        </div>
      </footer>
    </div>
  )
}

export default AppFooter
