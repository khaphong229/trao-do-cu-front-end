import { createSlice } from '@reduxjs/toolkit'
import { approvalStatus, getPostAdminPagination } from './postAdminThunks'

const initialState = {
  posts: [],
  total: 0,
  current: 1,
  pageSize: 10,
  isLoading: false,
  isModalVisible: false,
  isDetailsModalVisible: false,
  selectedPost: null,
  error: null,
  searchText: '',
  lastUpdated: null
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
      state.current = action.payload
    },
    setPerPage: (state, action) => {
      state.pageSize = action.payload
    },
    clearError: state => {
      state.error = null
    },
    resetState: () => initialState,
    forceRefresh: state => {
      state.lastUpdated = new Date().getTime()
    }
  },
  extraReducers: builder => {
    builder
      .addCase(getPostAdminPagination.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getPostAdminPagination.fulfilled, (state, action) => {
        state.isLoading = false
        state.lastUpdated = new Date().getTime()

        if (action.payload && action.payload.data) {
          // Extract posts from data.data
          state.posts = action.payload.data.data.map(post => ({
            ...post,
            isApproved: post.isApproved || false // Ensure isApproved is not null or undefined
          }))
          // Extract pagination info from correct places
          state.total = action.payload.data.total || 0
          state.current = action.payload.data.current || 1
          state.pageSize = action.payload.data.limit || 10
        } else {
          state.posts = []
          state.total = 0
          state.current = 1
          state.pageSize = 10
        }
      })
      .addCase(getPostAdminPagination.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(approvalStatus.pending, state => {
        state.error = null
      })
      .addCase(approvalStatus.fulfilled, (state, action) => {
        const updatedPost = action.payload
        const index = state.posts.findIndex(post => post._id === updatedPost._id)

        if (index !== -1) {
          const newPosts = [...state.posts]
          newPosts[index] = {
            ...newPosts[index],
            ...updatedPost,
            pcoin_config: {
              reward_amount: updatedPost.rewardAmount, // Cập nhật rewardAmount
              required_amount: updatedPost.requiredAmount // Cập nhật requiredAmount
            },
            isApproved: true,
            reason: ''
          }
          state.posts = newPosts
        }

        state.lastUpdated = new Date().getTime()
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
  setSearchText,
  forceRefresh
} = postAdminSlice.actions

export default postAdminSlice.reducer
