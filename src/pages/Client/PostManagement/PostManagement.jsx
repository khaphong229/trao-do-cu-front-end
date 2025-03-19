import React from 'react'
import PostManage from './components/PostManage/PostManage'
import { useSearchParams } from 'react-router-dom'
import SEO from 'config/seo'

const PostManagement = () => {
  const [searchParams] = useSearchParams()
  const tabType = searchParams.get('tab')
  return (
    <div className="container">
      <SEO
        title="Trao Đồ Cũ - Quản lý sản phẩm của bạn"
        description="Tổng hợp danh sách các sản phẩm bạn đã đăng, và những sản phẩm bạn đã yêu cầu xin."
        keywords={['trao đồ cũ, trao đổi, trao tặng, xin đồ, chợ đồ cũ']}
        url="https://traodocu.vn"
      />
      <PostManage tabType={tabType || 'active'} />
    </div>
  )
}

export default PostManagement
