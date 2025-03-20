import { createAsyncThunk } from '@reduxjs/toolkit'
import postRatingService from 'services/client/postRating'

export const getPostRating = createAsyncThunk('postRating/getPostRating', async (_, { rejectWithValue }) => {
  try {
    const response = await postRatingService.getPostRating()
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Đã xảy ra lỗi không xác định')
  }
})
