import React from 'react'
import Categories from './components/Categories'
import TopSales from './components/Banner'
import PostUser from './components/PostNews'
import styles from './Home.module.scss'

const Home = () => {
  return (
    <div className={`container ${styles.homePageWrap}`}>
      <TopSales />
      <Categories />
      <PostUser />
    </div>
  )
}

export default Home
