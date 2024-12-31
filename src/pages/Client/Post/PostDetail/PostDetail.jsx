import React, { useEffect } from 'react'
import PostInfoDetail from './components/InfoDetail'
import PostDescriptionDetail from './components/DescDetail'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { getPostId } from 'features/client/post/postThunks'

const PostDetail = () => {
  const params = useParams()
  const idPost = params.id
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getPostId(idPost))
  }, [dispatch, idPost])

  return (
    <div className="container">
      <PostInfoDetail />
      <PostDescriptionDetail />
    </div>
  )
}

export default PostDetail
