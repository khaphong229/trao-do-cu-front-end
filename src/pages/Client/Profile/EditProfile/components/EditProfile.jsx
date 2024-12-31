import React, { useState } from 'react'
import Sidebar from './Sidebar'
import Content from './Content'
import styles from '../scss/EditProfile.module.scss'
const PersonalInfo = () => {
  const [activeTab, setActiveTab] = useState('personal')

  return (
    <div className={styles['personal-info-wrapper']}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <Content activeTab={activeTab} />
    </div>
  )
}

export default PersonalInfo
