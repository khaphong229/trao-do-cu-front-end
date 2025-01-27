import React, { lazy } from 'react'
import Categories from './components/Categories'
import TopSales from './components/Banner'
// import PostNews from './components/PostNews'
const PostNews = lazy(() => import('./components/PostNews'))
const Home = () => {
  return (
    <div className={`container`}>
      <TopSales />
      <Categories />
      <PostNews />
    </div>
  )
}

export default Home
