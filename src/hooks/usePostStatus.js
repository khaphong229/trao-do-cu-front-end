import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { checkRequestedGift } from 'features/client/request/giftRequest/giftRequestThunks'
import { checkRequestedExchange } from 'features/client/request/exchangeRequest/exchangeRequestThunks'

export const usePostStatus = (posts = [], userId = null) => {
  const [postsWithStatus, setPostsWithStatus] = useState([])
  const [isChecking, setIsChecking] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    const checkRequestStatus = async () => {
      if (!posts.length || !userId) {
        setPostsWithStatus(posts)
        setIsChecking(false)
        return
      }

      try {
        const checkedPosts = await Promise.all(
          posts.map(async post => {
            const checkParams = {
              post_id: post._id,
              user_req_id: userId
            }

            let isRequested = false
            try {
              const checkAction = post.type === 'gift' ? checkRequestedGift : checkRequestedExchange
              const response = await dispatch(checkAction(checkParams))
              isRequested = response.payload?.data?.total > 0
            } catch (error) {
              console.error('Error checking request status:', error)
            }

            return {
              ...post,
              isRequested
            }
          })
        )

        setPostsWithStatus(checkedPosts)
      } catch (error) {
        console.error('Error checking posts status:', error)
        setPostsWithStatus(posts)
      } finally {
        setIsChecking(false)
      }
    }

    setIsChecking(true)
    checkRequestStatus()
  }, [posts, userId, dispatch])

  return {
    postsWithStatus,
    isChecking
  }
}
