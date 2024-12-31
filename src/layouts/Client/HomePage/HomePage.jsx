import React from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import styles from './styles.module.scss'
import { Outlet } from 'react-router-dom'
import BackToTopButton from 'components/common/BackToTopButton'
const HomePage = () => {
  return (
    <>
      <div className={styles.layoutClientWrap}>
        <Header />
        <Outlet />
        <Footer />
      </div>
      <BackToTopButton />
    </>
  )
}

export default HomePage
