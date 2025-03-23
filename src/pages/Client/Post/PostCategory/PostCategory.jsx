import React from 'react'

import Category from '../../Home/components/Categories'
import PostList from './components/PostList'
import SEO from 'config/seo'
import gocPtit from 'assets/images/banner/goc_ptit.jpg'
import { useParams } from 'react-router-dom'
const PostCategory = () => {
  const params = useParams()
  const { category_id } = params
  return (
    <div>
      <div className="container">
        <SEO
          title="Trao Đồ Cũ - Sản phẩm theo danh mục."
          description="Các sản phẩm dựa theo danh mục bạn lựa chọn."
          keywords={['trao đồ cũ, trao đổi, trao tặng, xin đồ, chợ đồ cũ']}
          url="https://traodocu.vn"
        />
        {category_id === 'ptit' ? (
          <img style={{ width: '100%', margin: '10px 0' }} loading="lazy" src={gocPtit} alt="goc_ptit_thumbnail" />
        ) : (
          <Category />
        )}
        <PostList />
      </div>
    </div>
  )
}

export default PostCategory
