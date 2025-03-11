import React, { lazy } from 'react'
import Categories from './components/Categories'
import TopSales from './components/Banner'
import NotificationSuccessPopup from 'components/feature/NotificationSuccessPopup'
// import ChatBot from './components/ChatBot'

const PostNews = lazy(() => import('./components/PostNews'))
const Home = () => {
  return (
    <div className={`container`}>
      <TopSales />
      <Categories />
      <PostNews />
      <NotificationSuccessPopup />
      {/* <ChatBot /> */}
    </div>
  )
}

export default Home
