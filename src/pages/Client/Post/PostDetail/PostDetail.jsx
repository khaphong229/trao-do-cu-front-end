import React, { useEffect } from 'react'
import PostInfoDetail from './components/InfoDetail'
import PostDescriptionDetail from './components/DescDetail'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { getPostId } from 'features/client/post/postThunks'
import SEO from 'config/seo'

const PostDetail = () => {
  const params = useParams()
  const idPost = params.id
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getPostId(idPost))
  }, [dispatch, idPost])

  return (
    <div className="container">
      <SEO
        title="Trao Đồ Cũ - Chi tiết sản phẩm"
        description="Chi tiết thông tin sản phẩm bạn muốn nhận, trao đổi."
        keywords={['trao đồ cũ, trao đổi, trao tặng, xin đồ, chợ đồ cũ']}
        url="https://traodocu.vn"
      />
      <PostInfoDetail />
      <PostDescriptionDetail />
    </div>
  )
}

export default PostDetail
