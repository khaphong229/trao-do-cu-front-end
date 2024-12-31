import React from 'react'
import { Card, List, Avatar, Typography, Menu, Divider, Empty, Button, Space, Input } from 'antd'
import { UserOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import avatar from '../assets/images/logo/avtDefault.jpg'
import { cartItems, menuItems, notifications } from './data'

const { Text } = Typography

export const notificationMenu = (
  <Card
    title="Thông báo"
    style={{
      width: 300,
      border: '1px solid #d9d9d9',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      borderRadius: '8px'
    }}
  >
    <List
      itemLayout="horizontal"
      dataSource={notifications}
      renderItem={(item, index) => (
        <List.Item key={index}>
          {' '}
          {/* Add key here for each item */}
          <List.Item.Meta avatar={<Avatar icon={<UserOutlined />} />} title={item.title} description={item.time} />
        </List.Item>
      )}
    />
    <div style={{ textAlign: 'center', marginTop: '10px' }}>
      <a href="/">Xem tất cả thông báo</a>
    </div>
  </Card>
)

export const cartMenu = (
  <Card title="There are items in your cart" bordered={false} style={{ width: 450 }}>
    {cartItems.length > 0 ? (
      <List
        itemLayout="horizontal"
        dataSource={cartItems} // Danh sách sản phẩm
        renderItem={item => (
          <List.Item key={item.id} style={{ alignItems: 'center' }}>
            <Avatar shape="square" size={64} src={item.image || '150x150'} />
            <Space direction="vertical" style={{ marginLeft: 10, flex: 1 }}>
              <Text strong>{item.name}</Text>
              <Input
                type="number"
                min={1}
                value={item.quantity}
                style={{ width: 60 }}
                onChange={e => console.log('Update quantity', e.target.value)}
              />
            </Space>
            <div style={{ textAlign: 'right', margin: '0 10px' }}>
              <Text style={{ margin: '0 10px' }}>${item.price}</Text>
              <Space size="small" style={{ marginTop: 10 }}>
                <Button icon={<EditOutlined />} onClick={() => console.log('Edit item', item.id)} size="small" />
                <Button
                  icon={<DeleteOutlined />}
                  onClick={() => console.log('Remove item', item.id)}
                  danger
                  size="small"
                />
              </Space>
            </div>
          </List.Item>
        )}
      />
    ) : (
      <Empty description="Your cart is empty" />
    )}
    <div style={{ textAlign: 'right', marginTop: 20 }}>
      <Text strong style={{ fontSize: 16 }}>
        TOTAL: ${cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
      </Text>
      <Space style={{ marginTop: 10 }}>
        <Button type="default">VIEW CART</Button>
        <Button type="primary">CHECK OUT</Button>
      </Space>
    </div>
  </Card>
)

export const menu = user => {
  return (
    <Menu style={{ width: 200 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '10px',
          gap: '10px'
        }}
      >
        <Avatar size={40} src={user.avatar || avatar} />
        <Text level={5}>{user.name || 'Tài khoản'}</Text>
      </div>
      <Divider
        style={{
          margin: '10px'
        }}
      />
      {menuItems.map((section, index) => (
        <Menu.ItemGroup key={index} title={section.title}>
          {section.items.map((item, i) => (
            <Menu.Item key={`${index}-${i}`} icon={item.icon}>
              {item.name || item.label}
            </Menu.Item>
          ))}
        </Menu.ItemGroup>
      ))}
    </Menu>
  )
}
