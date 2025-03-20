import { createSlice } from '@reduxjs/toolkit'
import { getPostRating } from './postRatingThunks'

const initialState = {
  postRating: [],
  total: 0,
  isLoading: false,
  error: null
}

const postRatingSlice = createSlice({
  name: 'postRating',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getPostRating.pending, state => {
      state.isLoading = true
    })
    builder.addCase(getPostRating.fulfilled, (state, action) => {
      state.postRating = action.payload.data
      state.total = action.payload.total
    })
    builder.addCase(getPostRating.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload
    })
  }
})

export default postRatingSlice.reducer
