import React from 'react'

import Category from '../../Home/components/Categories'
import PostList from './components/PostList'
const PostCategory = () => {
  return (
    <div>
      <div className="container">
        <Category />
        <PostList />
      </div>
    </div>
  )
}

export default PostCategory
