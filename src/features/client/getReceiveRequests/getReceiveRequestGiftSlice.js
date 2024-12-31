import { createSlice } from '@reduxjs/toolkit'
import { acceptGiftRequest, getReceiveRequestGift } from './getReceiveRequestGiftThunks'

const initialState = {
  posts: [], // Ensure posts is an array
  total: 0,
  current: 1,
  limit: 20,
  isLoading: false,
  isError: false,
  errorMessage: ''
}

const getReceiveRequestGiftSlice = createSlice({
  name: 'requestGift',
  initialState,
  reducers: {
    resetPosts: state => {
      state.posts = []
    }
  },
  extraReducers: builder => {
    builder
      .addCase(getReceiveRequestGift.pending, state => {
        state.isLoading = true
        state.isError = false
        state.errorMessage = ''
      })
      .addCase(getReceiveRequestGift.fulfilled, (state, action) => {
        state.isLoading = false
        if (action.payload) {
          state.posts = Array.isArray(action.payload.data) ? action.payload.data : []
          state.total = action.payload.total || 0
          state.current = action.payload.current || 1
          state.limit = action.payload.limit || 5
        } else {
          state.posts = []
          state.total = 0
          state.current = 1
          state.limit = 5
        }
      })
      .addCase(getReceiveRequestGift.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.errorMessage = action.payload || 'An error occurred'
        state.posts = []
      })
      .addCase(acceptGiftRequest.pending, state => {
        state.isLoading = true
      })
      .addCase(acceptGiftRequest.rejected, state => {
        state.isLoading = false
      })
      .addCase(acceptGiftRequest.fulfilled, state => {
        state.isLoading = false
      })
  }
})

export const { resetPosts } = getReceiveRequestGiftSlice.actions
export default getReceiveRequestGiftSlice.reducer
