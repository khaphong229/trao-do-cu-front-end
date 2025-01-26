import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { checkRequestedGift } from 'features/client/request/giftRequest/giftRequestThunks'
import { checkRequestedExchange } from 'features/client/request/exchangeRequest/exchangeRequestThunks'
import { clearExpiredCache, setRequestStatuses } from 'features/client/post/postSlice'

// export const usePostStatus = (posts = [], userId = null) => {
//   const [postsWithStatus, setPostsWithStatus] = useState([])
//   const [isChecking, setIsChecking] = useState(true)
//   const dispatch = useDispatch()

//   useEffect(() => {
//     const checkRequestStatus = async () => {
//       if (!posts.length || !userId) {
//         setPostsWithStatus(posts)
//         setIsChecking(false)
//         return
//       }

//       try {
//         const checkedPosts = await Promise.all(
//           posts.map(async post => {
//             const checkParams = {
//               post_id: post._id,
//               user_req_id: userId
//             }

//             let isRequested = false
//             try {
//               const checkAction = post.type === 'gift' ? checkRequestedGift : checkRequestedExchange
//               const response = await dispatch(checkAction(checkParams))
//               isRequested = response.payload?.data?.total > 0
//             } catch (error) {
//               // console.error('Error checking request status:', error)
//               throw error
//             }

//             return {
//               ...post,
//               isRequested
//             }
//           })
//         )

//         setPostsWithStatus(checkedPosts)
//       } catch (error) {
//         console.error('Error checking posts status:', error)
//         setPostsWithStatus(posts)
//       } finally {
//         setIsChecking(false)
//       }
//     }

//     setIsChecking(true)
//     checkRequestStatus()
//   }, [posts, userId, dispatch])

//   return {
//     postsWithStatus,
//     isChecking
//   }
// }

// export const usePostStatus = (posts = [], userId = null) => {
//   const [isChecking, setIsChecking] = useState(false)
//   const dispatch = useDispatch()
//   const { requestStatuses, statusCache } = useSelector(state => state.post)

//   useEffect(() => {
//     const checkStatus = async () => {
//       if (!posts.length || !userId) return

//       setIsChecking(true)
//       dispatch(clearExpiredCache())

//       const uncachedPosts = posts.filter(post => !statusCache[post._id])
//       const groupedPosts = {
//         gift: [],
//         exchange: []
//       }

//       uncachedPosts.forEach(post => {
//         groupedPosts[post.type].push(post)
//       })

//       const batchSize = 10
//       const processGroup = async (posts, checkAction) => {
//         for (let i = 0; i < posts.length; i += batchSize) {
//           const batch = posts.slice(i, i + batchSize)
//           const promises = batch.map(async post => {
//             try {
//               const response = await dispatch(
//                 checkAction({
//                   post_id: post._id,
//                   user_req_id: userId
//                 })
//               ).unwrap()

//               dispatch(
//                 setRequestStatuses({
//                   postId: post._id,
//                   status:
//                     post.type === 'gift'
//                       ? response?.data?.receiveRequests?.length > 0
//                       : response?.data?.exchangeRequests?.length > 0
//                 })
//               )
//             } catch (error) {
//               throw error
//             }
//           })
//           await Promise.all(promises)
//           // Small delay between batches to prevent rate limiting
//           if (i + batchSize < posts.length) {
//             await new Promise(resolve => setTimeout(resolve, 100))
//           }
//         }
//       }

//       try {
//         await Promise.all([
//           processGroup(groupedPosts.gift, checkRequestedGift),
//           processGroup(groupedPosts.exchange, checkRequestedExchange)
//         ])
//       } finally {
//         setIsChecking(false)
//       }
//     }

//     checkStatus()
//   }, [posts, userId, dispatch, statusCache])

//   const postsWithStatus = posts.map(post => ({
//     ...post,
//     isRequested: !!requestStatuses[post._id]
//   }))

//   return { postsWithStatus, isChecking }
// }

export const usePostStatus = (posts = [], userId = null) => {
  const [isChecking, setIsChecking] = useState(false)
  const dispatch = useDispatch()
  const { requestStatuses, statusCache } = useSelector(state => state.post)

  useEffect(() => {
    const checkStatus = async () => {
      if (posts.length === 0 || !userId) return

      setIsChecking(true)
      dispatch(clearExpiredCache())

      const postIds = posts.map(post => post._id)
      const uncachedPostIds = postIds.filter(id => !statusCache[id])

      if (uncachedPostIds.length === 0) {
        setIsChecking(false)
        return
      }

      const batchSize = 10
      const promises = []

      for (let i = 0; i < uncachedPostIds.length; i += batchSize) {
        const batch = uncachedPostIds.slice(i, i + batchSize)
        const giftBatch = batch.filter(id => posts.find(p => p._id === id)?.type === 'gift')
        const exchangeBatch = batch.filter(id => posts.find(p => p._id === id)?.type === 'exchange')

        giftBatch.forEach(id => {
          promises.push(
            dispatch(
              checkRequestedGift({
                post_id: id,
                user_req_id: userId
              })
            )
          )
        })

        exchangeBatch.forEach(id => {
          promises.push(
            dispatch(
              checkRequestedExchange({
                post_id: id,
                user_req_id: userId
              })
            )
          )
        })

        // Small delay between batches to prevent rate limiting
        if (i + batchSize < uncachedPostIds.length) {
          await new Promise(resolve => setTimeout(resolve, 100))
        }
      }

      try {
        await Promise.all(promises)
      } finally {
        setIsChecking(false)
      }
    }

    checkStatus()
  }, [posts, userId, dispatch, statusCache])

  const postsWithStatus = posts.map(post => ({
    ...post,
    isRequested: !!requestStatuses[post._id]
  }))

  return { postsWithStatus, isChecking }
}
