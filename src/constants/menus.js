import React from 'react'
import { Card, List, Avatar, Typography, Menu, Divider } from 'antd'
import avatar from '../assets/images/logo/avtDefault.jpg'
import { menuItems } from './data'
import { URL_SERVER_IMAGE } from 'config/url_server'
import { UseListNotification } from 'hooks/UseListNotification'

const { Text } = Typography

export const NotificationMenu = () => {
  const { listNotification } = UseListNotification()
  console.log(listNotification, 'okkk')

  return (
    <Card
      title="Thông báo"
      style={{
        width: 300,
        border: '1px solid #d9d9d9',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px'
      }}
    >
      {listNotification.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'gray', padding: '20px' }}>Không có thông báo mới</div>
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={listNotification}
          renderItem={(item, index) => (
            <List.Item key={index}>
              <List.Item.Meta title={item.title} description={item.time} />
            </List.Item>
          )}
        />
      )}
      {listNotification.length > 0 && (
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <a href="/">Xem tất cả thông báo</a>
        </div>
      )}
    </Card>
  )
}

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
        <Avatar size={40} src={user?.avatar ? `${URL_SERVER_IMAGE}${user.avatar}` : avatar} />
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
