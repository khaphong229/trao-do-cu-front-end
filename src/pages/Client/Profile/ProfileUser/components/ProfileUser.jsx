import { Button, Card, Tabs, Badge, Tooltip, Image } from 'antd'
import {
  ShareAltOutlined,
  EditOutlined,
  MessageOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  EnvironmentOutlined,
  FacebookOutlined,
  TwitterOutlined,
  MailOutlined
} from '@ant-design/icons'
import Avatar from 'assets/images/logo/avtDefault.jpg'
import styles from '../scss/ProfileUser.module.scss'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import dayjs from 'dayjs'
import { setCreateModalVisibility } from 'features/client/post/postSlice'

const { TabPane } = Tabs
const ProfilePage = () => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  return (
    <main className={styles['profile-page']}>
      <div className={styles.container}>
        <Card className={styles.card}>
          <div className={styles['profile-header']}>
            <Image src={user?.avatar ? user.avatar : Avatar} alt="Profile picture" className={styles.avatar} />
            <div className={styles['profile-info']}>
              <h1>{user?.name ? user.name : 'Tài khoản'}</h1>
              <p className="text-muted">Chưa có đánh giá</p>
              <div className={styles.followers}>
                Người theo dõi: <strong>0</strong> • Đang theo dõi: <strong>0</strong>
              </div>
            </div>
            <div className={styles['button-group']}>
              <Button type="primary" icon={<ShareAltOutlined />}>
                Chia sẻ trang của bạn
              </Button>
              <Button icon={<EditOutlined />}>
                <Link to="/edit-profile">Chỉnh sửa trang cá nhân</Link>
              </Button>
            </div>
          </div>
        </Card>

        <Card className={styles.card}>
          <div className={styles['badges-section']}>
            <Tooltip title="Phản hồi chat">
              <Badge className={styles.badge}>
                <MessageOutlined /> Chưa có thông tin
              </Badge>
            </Tooltip>

            <Tooltip title="Thời gian tham gia">
              <Badge className={styles.badge}>
                <ClockCircleOutlined />{' '}
                {`Đã tham gia: ${
                  dayjs(user.created_at).isValid() ? dayjs(user.created_at).fromNow() : 'Không rõ thời gian'
                }`}
              </Badge>
            </Tooltip>

            <Tooltip title="Xác thực">
              <Badge className={styles.badge}>
                <CheckCircleOutlined />
                Đã xác thực:{' '}
                <div className={styles.icons}>
                  <FacebookOutlined style={{ color: '#1877f2' }} />
                  <TwitterOutlined style={{ color: '#1da1f2' }} />
                  <MailOutlined style={{ color: '#f56a00' }} />
                </div>
              </Badge>
            </Tooltip>

            <Tooltip title="Địa chỉ">
              <Badge className={styles.badge}>
                <EnvironmentOutlined />
                {`Địa chỉ: ${user?.address ? user.address : 'Chưa cung cấp'}`}
              </Badge>
            </Tooltip>
          </div>
        </Card>

        <Card className={styles.card}>
          <Tabs defaultActiveKey="1" className={styles.tabs}>
            <TabPane tab="Đang hiển thị (0)" key="1">
              <div className={styles['tab-content']}>
                <svg viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="fade" x1="50%" y1="0%" x2="50%" y2="100%">
                      <stop offset="0%" stopColor="#f2f4f7" stopOpacity="1" />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  <ellipse cx="400" cy="250" rx="400" ry="120" fill="url(#fade)" />

                  <rect
                    x="360"
                    y="40"
                    rx="20"
                    ry="20"
                    width="120"
                    height="200"
                    stroke="#dce1ea"
                    strokeWidth="3"
                    fill="none"
                  />
                  <circle cx="370" cy="50" r="3" fill="#ffcc4d" />

                  <rect
                    x="380"
                    y="90"
                    rx="5"
                    ry="5"
                    width="90"
                    height="20"
                    fill="#fff"
                    stroke="#dce1ea"
                    strokeWidth="1"
                  />
                  <rect x="460" y="90" rx="3" ry="3" width="15" height="20" fill="#ffcc4d" />
                  <line x1="385" y1="100" x2="440" y2="100" stroke="#dce1ea" strokeWidth="2" />

                  <rect
                    x="370"
                    y="130"
                    rx="5"
                    ry="5"
                    width="90"
                    height="40"
                    fill="#fff"
                    stroke="#dce1ea"
                    strokeWidth="1"
                  />
                  <circle cx="380" cy="150" r="3" fill="#ffcc4d" />
                  <text x="390" y="155" fontFamily="Arial, sans-serif" fontSize="10" fill="#b0b8c4">
                    Tai Ji Chi Minh
                  </text>

                  {/* Clouds */}
                  <path
                    d="M100 140 a20 15 0 0 1 40 0 a10 8 0 0 1 20 0 a15 12 0 0 1 30 0 q0 15-40 15-30 0-50-15z"
                    fill="#f2f4f7"
                  />
                  <path
                    d="M550 80 a25 18 0 0 1 50 0 a12 10 0 0 1 25 0 a20 15 0 0 1 40 0 q0 20-60 20-40 0-55-20z"
                    fill="#f2f4f7"
                  />

                  {/* Dotted Line */}
                  <path d="M470 180 q20 0 40 15 t0 30" stroke="#dce1ea" strokeDasharray="5,5" fill="none" />

                  {/* Small Decorations */}
                  <path d="M220 90 q5-10 15-5 q-10 5-15 5z" fill="#dce1ea" />
                  <path d="M470 200 q5-5 10 0 q-5 5-10 0z" fill="#dce1ea" />
                </svg>
                <h3>Bạn chưa có bài đăng nào</h3>
                <Button size="large" type="primary" onClick={() => dispatch(setCreateModalVisibility(true))}>
                  Đăng bài
                </Button>
              </div>
            </TabPane>
            <TabPane tab="Thành công (0)" key="2">
              <div className={styles['tab-content']}>
                <svg viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg">
                  {/* Gradient */}
                  <defs>
                    <linearGradient id="fade" x1="50%" y1="0%" x2="50%" y2="100%">
                      <stop offset="0%" stopColor="#f2f4f7" stopOpacity="1" />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Ellipse Background */}
                  <ellipse cx="400" cy="250" rx="400" ry="120" fill="url(#fade)" />

                  {/* Phone Frame */}
                  <rect
                    x="360"
                    y="40"
                    rx="20"
                    ry="20"
                    width="120"
                    height="200"
                    stroke="#dce1ea"
                    strokeWidth="3"
                    fill="none"
                  />
                  <circle cx="370" cy="50" r="3" fill="#ffcc4d" />

                  {/* Chat Bubbles */}
                  <rect
                    x="380"
                    y="90"
                    rx="5"
                    ry="5"
                    width="90"
                    height="20"
                    fill="#fff"
                    stroke="#dce1ea"
                    strokeWidth="1"
                  />
                  <rect x="460" y="90" rx="3" ry="3" width="15" height="20" fill="#ffcc4d" />
                  <line x1="385" y1="100" x2="440" y2="100" stroke="#dce1ea" strokeWidth="2" />

                  <rect
                    x="370"
                    y="130"
                    rx="5"
                    ry="5"
                    width="90"
                    height="40"
                    fill="#fff"
                    stroke="#dce1ea"
                    strokeWidth="1"
                  />
                  <circle cx="380" cy="150" r="3" fill="#ffcc4d" />
                  <text x="390" y="155" fontFamily="Arial, sans-serif" fontSize="10" fill="#b0b8c4">
                    Trao Đồ Cũ
                  </text>

                  {/* Clouds */}
                  <path
                    d="M100 140 a20 15 0 0 1 40 0 a10 8 0 0 1 20 0 a15 12 0 0 1 30 0 q0 15-40 15-30 0-50-15z"
                    fill="#f2f4f7"
                  />
                  <path
                    d="M550 80 a25 18 0 0 1 50 0 a12 10 0 0 1 25 0 a20 15 0 0 1 40 0 q0 20-60 20-40 0-55-20z"
                    fill="#f2f4f7"
                  />

                  {/* Dotted Line */}
                  <path d="M470 180 q20 0 40 15 t0 30" stroke="#dce1ea" strokeDasharray="5,5" fill="none" />

                  {/* Small Decorations */}
                  <path d="M220 90 q5-10 15-5 q-10 5-15 5z" fill="#dce1ea" />
                  <path d="M470 200 q5-5 10 0 q-5 5-10 0z" fill="#dce1ea" />
                </svg>
                <h3>Chưa có bài đăng nào thành công</h3>
              </div>
            </TabPane>
            <TabPane tab="Đã ẩn (0)" key="3">
              <div className={styles['tab-content']}>
                <svg viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg">
                  {/* Gradient */}
                  <defs>
                    <linearGradient id="fade" x1="50%" y1="0%" x2="50%" y2="100%">
                      <stop offset="0%" stopColor="#f2f4f7" stopOpacity="1" />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Ellipse Background */}
                  <ellipse cx="400" cy="250" rx="400" ry="120" fill="url(#fade)" />

                  {/* Phone Frame */}
                  <rect
                    x="360"
                    y="40"
                    rx="20"
                    ry="20"
                    width="120"
                    height="200"
                    stroke="#dce1ea"
                    strokeWidth="3"
                    fill="none"
                  />
                  <circle cx="370" cy="50" r="3" fill="#ffcc4d" />

                  {/* Chat Bubbles */}
                  <rect
                    x="380"
                    y="90"
                    rx="5"
                    ry="5"
                    width="90"
                    height="20"
                    fill="#fff"
                    stroke="#dce1ea"
                    strokeWidth="1"
                  />
                  <rect x="460" y="90" rx="3" ry="3" width="15" height="20" fill="#ffcc4d" />
                  <line x1="385" y1="100" x2="440" y2="100" stroke="#dce1ea" strokeWidth="2" />

                  <rect
                    x="370"
                    y="130"
                    rx="5"
                    ry="5"
                    width="90"
                    height="40"
                    fill="#fff"
                    stroke="#dce1ea"
                    strokeWidth="1"
                  />
                  <circle cx="380" cy="150" r="3" fill="#ffcc4d" />
                  <text x="390" y="155" fontFamily="Arial, sans-serif" fontSize="10" fill="#b0b8c4">
                    Trao Đồ Cũ
                  </text>

                  {/* Clouds */}
                  <path
                    d="M100 140 a20 15 0 0 1 40 0 a10 8 0 0 1 20 0 a15 12 0 0 1 30 0 q0 15-40 15-30 0-50-15z"
                    fill="#f2f4f7"
                  />
                  <path
                    d="M550 80 a25 18 0 0 1 50 0 a12 10 0 0 1 25 0 a20 15 0 0 1 40 0 q0 20-60 20-40 0-55-20z"
                    fill="#f2f4f7"
                  />

                  {/* Dotted Line */}
                  <path d="M470 180 q20 0 40 15 t0 30" stroke="#dce1ea" strokeDasharray="5,5" fill="none" />

                  {/* Small Decorations */}
                  <path d="M220 90 q5-10 15-5 q-10 5-15 5z" fill="#dce1ea" />
                  <path d="M470 200 q5-5 10 0 q-5 5-10 0z" fill="#dce1ea" />
                </svg>
                <h3>Chưa có bài đã ẩn</h3>
              </div>
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </main>
  )
}
export default ProfilePage
