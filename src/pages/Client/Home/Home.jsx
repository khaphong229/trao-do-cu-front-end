import React, { lazy } from 'react'
import Categories from './components/Categories'
import TopSales from './components/Banner'
import NotificationSuccessPopup from 'components/feature/NotificationSuccessPopup'
import SEO from 'config/seo'
// import ChatBot from './components/ChatBot'

const PostNews = lazy(() => import('./components/PostNews'))
const Home = () => {
  return (
    <div className={`container`}>
      <SEO
        title="Trao Đồ Cũ - Trang chủ"
        description="Trang chủ với nhiều sản phẩm trao tặng, trao đổi cực kỳ hấp dẫn"
        keywords={['trao đồ cũ, trao đổi, trao tặng, xin đồ, chợ đồ cũ']}
        image="https://example.com/home-thumbnail.jpg"
        url="https://example.com/"
      />
      <TopSales />
      <Categories />
      <PostNews />
      <NotificationSuccessPopup />
      {/* <ChatBot /> */}
    </div>
  )
}

export default Home
