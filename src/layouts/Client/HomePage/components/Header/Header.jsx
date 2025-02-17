import React from 'react'
import { Row, Col } from 'antd'
import TopBar from './components/TopBar'
import Logo from './components/Logo'
import SearchBar from './components/SearchBar'
import HeaderIcons from './components/HeaderIcons'
import styles from './styles.module.scss'

import { categoryData } from '../../../../../constants/data'
import { UserMenu } from '../../../../../constants/menus'
import { useSelector } from 'react-redux'

function Header() {
  const { user } = useSelector(state => state.auth)
  return (
    <div>
      <header className={styles.headerWrap}>
        <div>
          <TopBar />
        </div>
        <div className={styles.bottomBar}>
          <Row align="middle" justify="space-between" gutter={[8, 16]}>
            <Col className={styles.colLogo}>
              <Logo categoryData={categoryData} />
            </Col>
            <Col className={styles.search}>
              <SearchBar />
            </Col>
            <Col className={styles.postContent}>
              <HeaderIcons menu={UserMenu(user)} />
            </Col>
          </Row>
        </div>
      </header>
    </div>
  )
}

export default Header
