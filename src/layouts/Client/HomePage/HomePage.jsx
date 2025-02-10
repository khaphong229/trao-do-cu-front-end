import React from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import styles from './styles.module.scss'
import BackToTopButton from 'components/common/BackToTopButton'
const HomePage = ({ children }) => {
  return (
    <>
      <div className={styles.layoutClientWrap}>
        <Header />
        {children}
        <Footer />
      </div>
      <BackToTopButton />
    </>
  )
}

export default HomePage
