import React from 'react'
import PostManage from './components/PostManage/PostManage'
import { useSearchParams } from 'react-router-dom'

const PostManagement = () => {
  const [searchParams] = useSearchParams()
  const tabType = searchParams.get('type')
  return (
    <div className="container">
      <PostManage tabType={tabType || 'active'} />
    </div>
  )
}

export default PostManagement
