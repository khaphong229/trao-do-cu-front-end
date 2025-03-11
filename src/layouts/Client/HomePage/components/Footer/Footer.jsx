import React from 'react'
// import Container from '../../../../../pages/Client/Home/components/Container'
import { Row, Col, Typography, Space } from 'antd'
import { MailOutlined } from '@ant-design/icons'
import styles from './styles.module.scss'
import { useNavigate } from 'react-router-dom'
const { Title, Text, Link } = Typography
function AppFooter() {
  const navigate = useNavigate()
  const goHome = () => {
    navigate('/')
  }
  return (
    <div>
      <footer className={styles.footerWrap}>
        <Row gutter={[32, 32]}>
          <Col xs={24} sm={24} md={6}>
            <div style={{ textAlign: 'left' }}>
              <div>
                <span className={styles.textLogo} onClick={goHome}>
                  TRAO ĐỒ CŨ
                </span>
              </div>
              <Text className={styles.text}>Địa chỉ: 122 Hoàng Quốc Việt, Q.Cầu Giấy, Hà Nội.</Text>
              <Text className={styles.text}>
                <MailOutlined /> Email: axtralab.ptit@gmail.com
              </Text>
              {/* <Text className={styles.text}>Hotline: 1900 1819</Text> */}
            </div>
          </Col>

          <Col xs={12} sm={8} md={6}>
            <Title level={5} className={styles.title}>
              Thông Tin
            </Title>
            <Space direction="vertical">
              <Link href="#" className={styles.link}>
                Dịch Vụ Tùy Chỉnh
              </Link>
              <Link href="#" className={styles.link}>
                Câu Hỏi Thường Gặp
              </Link>
              <Link href="#" className={styles.link}>
                Liên Hệ
              </Link>
              <Link href="#" className={styles.link}>
                Phổ Biến
              </Link>
            </Space>
          </Col>

          <Col xs={12} sm={8} md={6}>
            <Title level={5} className={styles.title}>
              Dịch Vụ Của Chúng Tôi
            </Title>
            <Space direction="vertical">
              <Link href="#" className={styles.link}>
                Chính Sách Bảo Mật
              </Link>
              <Link href="#" className={styles.link}>
                Tài Khoản Của Bạn
              </Link>
              <Link href="#" className={styles.link}>
                Tìm Kiếm Nâng Cao
              </Link>
              <Link href="#" className={styles.link}>
                Liên Hệ Chúng Tôi
              </Link>
            </Space>
          </Col>

          <Col xs={12} sm={8} md={6}>
            <Title level={5} className={styles.title}>
              Tài Khoản Của Tôi
            </Title>
            <Space direction="vertical">
              <Link href="#" className={styles.link}>
                Về Chúng Tôi
              </Link>
              <Link href="#" className={styles.link}>
                Dịch Vụ Tùy Chỉnh
              </Link>
              <Link href="#" className={styles.link}>
                Điều Khoản & Điều Kiện
              </Link>
            </Space>
          </Col>
        </Row>
      </footer>
    </div>
  )
}

export default AppFooter
