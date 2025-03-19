import React from 'react'

import Category from '../../Home/components/Categories'
import PostList from './components/PostList'
import SEO from 'config/seo'
const PostCategory = () => {
  return (
    <div>
      <div className="container">
        <SEO
          title="Trao Đồ Cũ - Sản phẩm theo danh mục."
          description="Các sản phẩm dựa theo danh mục bạn lựa chọn."
          keywords={['trao đồ cũ, trao đổi, trao tặng, xin đồ, chợ đồ cũ']}
          url="https://traodocu.vn"
        />
        <Category />
        <PostList />
      </div>
    </div>
  )
}

export default PostCategory
