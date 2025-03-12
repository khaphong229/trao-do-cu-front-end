import { Card, Button, Tabs } from 'antd'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Pie,
  PieChart,
  Cell,
  Legend
} from 'recharts'
import { SyncOutlined, ShoppingOutlined, ArrowUpOutlined, StarOutlined } from '@ant-design/icons'
import styles from './styles.module.scss'

const { TabPane } = Tabs

const exchangeData = [
  { name: 'Tháng 1', exchanges: 4 },
  { name: 'Tháng 2', exchanges: 3 },
  { name: 'Tháng 3', exchanges: 5 },
  { name: 'Tháng 4', exchanges: 7 },
  { name: 'Tháng 5', exchanges: 6 },
  { name: 'Tháng 6', exchanges: 8 }
]

const popularCategories = [
  { name: 'Electronics', value: 45 },
  { name: 'Books', value: 32 },
  { name: 'Furniture', value: 28 },
  { name: 'Clothing', value: 24 },
  { name: 'Sports', value: 18 }
]
const activityList = [
  { action: 'Yêu cầu trao đổi mới', item: 'Máy ảnh cổ điển', user: 'Alice', time: '2 giờ trước' },
  { action: 'Sản phẩm được đăng', item: 'Máy hát cổ', user: 'Bạn', time: '1 ngày trước' },
  { action: 'Hoàn thành trao đổi', item: 'Đồng hồ cổ', user: 'Bob', time: '3 ngày trước' },
  { action: 'Tin nhắn mới', item: 'Máy đánh chữ', user: 'Charlie', time: '1 tuần trước' },
  { action: 'Được yêu thích', item: 'Bộ sưu tập đĩa than', user: 'David', time: '1 tuần trước' }
]

const topItemLists = [
  { name: 'Máy ảnh Polaroid cổ điển', views: 245, likes: 52, value: 'Cho' },
  { name: 'Ghế hiện đại giữa thế kỷ', views: 198, likes: 43, value: 'Nhận' },
  { name: 'Bộ sưu tập đĩa vinyl hiếm', views: 176, likes: 38, value: 'Cho' },
  { name: 'Đồng hồ bỏ túi cổ', views: 154, likes: 29, value: 'Nhận' },
  { name: 'Máy chơi game retro', views: 132, likes: 27, value: 'Nhận' }
]
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

const DashboardUI = () => {
  return (
    <main className={styles['dashboard-content']}>
      <div className={styles['header']}>
        <h2 className={styles['title']}>Bảng điều khiển</h2>
        <Button icon={<ShoppingOutlined />} type="primary">
          Sản phẩm mới
        </Button>
      </div>

      <div className={styles['stats-grid']}>
        <Card>
          <Card.Meta
            title="Tổng bài đăng đã tạo"
            avatar={<ShoppingOutlined className={styles['icon']} style={{ color: '#FF5722' }} />}
            description={
              <div>
                <div className={styles['stat-value']}>124</div>
                <p className={styles['stat-note']}>+12 so với tháng trước</p>
              </div>
            }
          />
        </Card>
        <Card>
          <Card.Meta
            title="Trao đổi thành công"
            avatar={<SyncOutlined className={styles['icon']} style={{ color: '#4CAF50' }} />}
            description={
              <div>
                <div className={styles['stat-value']}>37</div>
                <p className={styles['stat-note']}>+8 so với tháng trước</p>
              </div>
            }
          />
        </Card>
        <Card>
          <Card.Meta
            title="Yêu cầu đang hoạt động"
            avatar={<ArrowUpOutlined className={styles['icon']} style={{ color: '#2196F3' }} />}
            description={
              <div>
                <div className={styles['stat-value']}>18</div>
                <p className={styles['stat-note']}>+5 yêu cầu mới</p>
              </div>
            }
          />
        </Card>
        <Card>
          <Card.Meta
            title="Đánh giá người dùng"
            avatar={<StarOutlined className={styles['icon']} style={{ color: '#FFC107' }} />}
            description={
              <div>
                <div className={styles['stat-value']}>4.8</div>
                <p className={styles['stat-note']}>Dựa trên 52 đánh giá</p>
              </div>
            }
          />
        </Card>
      </div>

      <div className={styles['charts-grid']}>
        <Card>
          <Card.Meta
            title="Hoạt động trao đổi"
            description={
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={exchangeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="exchanges" stroke="#23c686" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            }
          />
        </Card>

        <Card>
          <h3>Danh mục phổ biến</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={popularCategories}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label={entry => `${entry.name} ${entry.value}%`}
              >
                {popularCategories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" align="center" />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Tabs defaultActiveKey="1" className={styles['tabs']}>
        <TabPane tab="Hoạt động gần đây" key="1">
          <Card>
            <ul className={styles['activity-list']}>
              {activityList.map((activity, index) => (
                <li key={index} className={styles['activity-item']}>
                  <div>
                    <p className={styles['activity-action']}>{activity.action}</p>
                    <p className={styles['activity-details']}>
                      {activity.item} - với {activity.user}
                    </p>
                  </div>
                  <span className={styles['activity-time']}>{activity.time}</span>
                </li>
              ))}
            </ul>
          </Card>
        </TabPane>
        <TabPane tab="Bài đăng nổi bật" key="2">
          <Card>
            <ul className={styles['top-items-list']}>
              {topItemLists.map((item, index) => (
                <li key={index} className={styles['top-item']}>
                  <div>
                    <p className={styles['top-item-name']}>{item.name}</p>
                    <p className={styles['top-item-stats']}>
                      {item.views} lượt xem • {item.likes} lượt thích
                    </p>
                  </div>
                  <div className={styles['top-item-value']}>
                    <span className={styles['value']}>{item.value}</span>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </TabPane>
      </Tabs>
    </main>
  )
}
export default DashboardUI
