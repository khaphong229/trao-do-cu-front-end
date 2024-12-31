import { createSlice } from '@reduxjs/toolkit'
import { getPostGiftPagination } from './postManageThunks'

const initialState = {
  posts: [], // Ensure posts is an array
  total: 0,
  current: 1,
  limit: 20,
  isLoading: false,
  isError: false,
  errorMessage: ''
}

const postSlice = createSlice({
  name: 'postGift',
  initialState,
  reducers: {
    resetPosts: state => {
      state.posts = []
    }
  },
  extraReducers: builder => {
    builder
      .addCase(getPostGiftPagination.pending, state => {
        state.isLoading = true
        state.isError = false
        state.errorMessage = ''
      })
      .addCase(getPostGiftPagination.fulfilled, (state, action) => {
        state.isLoading = false
        if (action.payload) {
          state.posts = Array.isArray(action.payload.data.data) ? action.payload.data.data : []
          state.total = action.payload.data.total || 0
          state.current = action.payload.data.current || 1
          state.limit = action.payload.data.limit || 5
        } else {
          state.posts = []
          state.total = 0
          state.current = 1
          state.limit = 5
        }
      })
      .addCase(getPostGiftPagination.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.errorMessage = action.payload || 'An error occurred'
        state.posts = []
      })
  }
})

export const { resetPosts } = postSlice.actions
export default postSlice.reducer
