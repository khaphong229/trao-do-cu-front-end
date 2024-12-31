import React from 'react'
import SearchPostArticle from './components/SearchPostArticle'
import PostManagement from './components/PostManagement'
const PostArticle = () => {
  return (
    <div>
      <div className="container">
        <SearchPostArticle />
        <PostManagement />
      </div>
    </div>
  )
}

export default PostArticle
