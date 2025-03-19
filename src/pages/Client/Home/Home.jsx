import React, { lazy } from 'react'
import Categories from './components/Categories'
import TopSales from './components/Banner'
import NotificationSuccessPopup from 'components/feature/NotificationSuccessPopup'
import SEO from 'config/seo'
import thumbnail from 'assets/images/banner/thumbnail.jpg'

const PostNews = lazy(() => import('./components/PostNews'))
const Home = () => {
  return (
    <div className={`container`}>
      <SEO
        title="Trao Đồ Cũ - Nền tảng kết nối cộng đồng trao đổi đồ dễ dàng, nhanh chóng và hiệu quả."
        description="Trang chủ với nhiều sản phẩm trao tặng, trao đổi cực kỳ hấp dẫn"
        keywords={['trao đồ cũ, trao đổi, trao tặng, xin đồ, chợ đồ cũ']}
        image={thumbnail}
        url="https://traodocu.vn"
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
