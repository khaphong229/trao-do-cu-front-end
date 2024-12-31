import { createSlice } from '@reduxjs/toolkit'
import { getExchangeRequest } from './getExchangeRequestThunks'

const initialState = {
  posts: [], // Ensure posts is an array
  total: 0,
  current: 1,
  limit: 20,
  isLoading: false,
  isError: false,
  errorMessage: ''
}

const getExchangeRequestSlice = createSlice({
  name: 'requestExchange',
  initialState,
  reducers: {
    resetPosts: state => {
      state.posts = []
      console.log('State after resetPosts:', state) // Debug log for resetPosts
    }
  },
  extraReducers: builder => {
    builder
      .addCase(getExchangeRequest.pending, state => {
        state.isLoading = true
        state.isError = false
        state.errorMessage = ''
      })
      .addCase(getExchangeRequest.fulfilled, (state, action) => {
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
      .addCase(getExchangeRequest.rejected, (state, action) => {
        console.log('Thunk Rejected Action:', action) // Debug log for rejected action
        state.isLoading = false
        state.isError = true
        state.errorMessage = action.payload || 'An error occurred'
        state.posts = []
        console.log('State after rejected:', state) // Debug log for rejected state
      })
  }
})

export const { resetPosts } = getExchangeRequestSlice.actions
export default getExchangeRequestSlice.reducer
