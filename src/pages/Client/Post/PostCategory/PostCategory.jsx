import React from 'react'
// import Banner from '../../Home/components/Banner'
import Category from '../../Home/components/Categories'
import PostList from './components/PostList'
const PostCategory = () => {
  return (
    <div>
      <div className="container">
        {/* <Banner /> */}
        <Category />
        <PostList />
      </div>
    </div>
  )
}

export default PostCategory
