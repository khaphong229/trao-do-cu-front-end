import { addInteraction } from 'features/client/me/meThunks'
import { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getDatetimeNow } from 'utils/getDatetime'
import { getInteractionUser, removeInteractionUser, setInteractionUser } from 'utils/localStorageUtils'

const useInteraction = () => {
  const [interactions, setInteractions] = useState([])
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)

  // Load interactions from localStorage on mount
  useEffect(() => {
    const storedInteractions = getInteractionUser() || []
    setInteractions(storedInteractions)
  }, [])

  const requestInteraction = useCallback(async () => {
    if (interactions.length === 0 || !user?._id) return

    const now = getDatetimeNow()
    const data = {
      user_id: user._id,
      date: now,
      interactions: interactions
    }

    try {
      const response = await dispatch(addInteraction(data)).unwrap()
      if (response.status === 200 && response.data.message === 'Lưu tương tác thành công') {
        removeInteractionUser()
        setInteractions([])
      }
    } catch (error) {
      // console.error('Failed to save interactions:', error)
    }
  }, [interactions, user, dispatch])

  // Check if we need to send interactions when they change
  useEffect(() => {
    if (interactions.length >= 10) {
      requestInteraction()
    }
  }, [interactions.length, requestInteraction])

  const batchClick = useCallback(categoryId => {
    if (categoryId === null) return
    const now = getDatetimeNow()
    const newObj = { category: categoryId, time_event: now, event_type: 'click' }

    setInteractions(prev => {
      const updatedInteractions = [...prev, newObj]
      setInteractionUser(updatedInteractions)
      return updatedInteractions
    })
  }, [])

  return {
    batchClick
  }
}

export default useInteraction
