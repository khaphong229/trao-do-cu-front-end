import { createAsyncThunk } from '@reduxjs/toolkit'
import postRatingService from 'services/client/postRatingService'

// In the thunk
export const getPostRating = createAsyncThunk('postRating/getPostRating', async (userId, { rejectWithValue }) => {
  if (!userId) {
    return rejectWithValue('ID người dùng không được để trống')
  }

  try {
    const response = await postRatingService.getPostRating(userId)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Đã xảy ra lỗi không xác định')
  }
})
