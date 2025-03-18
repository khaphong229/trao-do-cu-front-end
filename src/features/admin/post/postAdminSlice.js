import { createSlice } from '@reduxjs/toolkit'
import { approvalStatus, getPostPagination } from './postAdminThunks'
const initialState = {
  posts: [],
  total: 0,
  page: 1,
  perPage: 10,
  isLoading: false,
  isModalVisible: false,
  isDetailsModalVisible: false,
  selectedPost: null,
  error: null,
  searchText: ''
}

const postAdminSlice = createSlice({
  name: 'postManagement',
  initialState,
  reducers: {
    setIsModalVisible: (state, action) => {
      state.isModalVisible = action.payload
    },
    setSearchText: (state, action) => {
      state.searchText = action.payload
    },
    setIsDetailsModalVisible: (state, action) => {
      state.isDetailsModalVisible = action.payload
    },
    setSelectedPost: (state, action) => {
      state.selectedPost = action.payload
    },
    setPage: (state, action) => {
      state.page = action.payload
    },
    setPerPage: (state, action) => {
      state.perPage = action.payload
    },
    clearError: state => {
      state.error = null
    },
    resetState: () => initialState
  },
  extraReducers: builder => {
    builder
      .addCase(getPostPagination.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getPostPagination.fulfilled, (state, action) => {
        console.log('Data from API:', action.payload)
        state.isLoading = false
        state.posts = action.payload.data.posts
        state.total = action.payload.data.total
        state.page = action.payload.data.page
        state.perPage = action.payload.data.per_page
      })
      .addCase(getPostPagination.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(approvalStatus.pending, state => {
        state.error = null
      })
      .addCase(approvalStatus.fulfilled, (state, action) => {
        const index = state.posts.findIndex(post => post._id === action.payload._id)
        state.posts[index] = action.payload
      })
      .addCase(approvalStatus.rejected, (state, action) => {
        state.error = action.payload
      })
  }
})

export const {
  setIsModalVisible,
  setIsDetailsModalVisible,
  setSelectedPost,
  setPage,
  setPerPage,
  clearError,
  resetState,
  setSearchText
} = postAdminSlice.actions
export default postAdminSlice.reducer
