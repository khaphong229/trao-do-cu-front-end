import React, { lazy } from 'react'
import Categories from './components/Categories'
import TopSales from './components/Banner'
// import ChatBot from './components/ChatBot'

const PostNews = lazy(() => import('./components/PostNews'))
const Home = () => {
  return (
    <div className={`container`}>
      <TopSales />
      <Categories />
      <PostNews />
      {/* <ChatBot /> */}
    </div>
  )
}

export default Home
