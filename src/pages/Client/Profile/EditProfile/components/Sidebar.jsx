import React from 'react'
import '../scss/EditProfile.module.scss'
const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <div
      className="sidebar"
      style={{
        padding: '20px 0',
        width: '300px',
        backgroundColor: '#ffffff',
        height: '200px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        borderRadius: '5px',
        marginRight: '15px'
      }}
    >
      <div
        className={`menu-item ${activeTab === 'personal' ? 'active' : ''}`}
        onClick={() => setActiveTab('personal')}
        style={{ padding: '10px', cursor: 'pointer' }}
      >
        Thông tin cá nhân
      </div>
      <div
        className={`menu-item ${activeTab === 'security' ? 'active' : ''}`}
        onClick={() => setActiveTab('security')}
        style={{ borderTop: '1px solid #e8e8e8', padding: '10px', cursor: 'pointer' }}
      >
        Cài đặt tài khoản
      </div>
      <div
        className={`menu-item ${activeTab === 'linksocialmedia' ? 'active' : ''}`}
        onClick={() => setActiveTab('linksocialmedia')}
        style={{ borderTop: '1px solid #e8e8e8', padding: '10px', cursor: 'pointer' }}
      >
        Liên kết tài mạng xã hội
      </div>
    </div>
  )
}

export default Sidebar
