import { createSlice } from '@reduxjs/toolkit'
import { getUserPagination, toggleUserStatus, deleteUser } from './userThunks'

const initialState = {
  users: [],
  total: 0,
  page: 1,
  perPage: 10,
  isLoading: false,
  isModalVisible: false,
  isDetailsModalVisible: false,
  selectedUser: null,
  error: null
}

const userSlice = createSlice({
  name: 'userManagement',
  initialState,
  reducers: {
    setIsModalVisible: (state, action) => {
      state.isModalVisible = action.payload
    },
    setIsDetailsModalVisible: (state, action) => {
      state.isDetailsModalVisible = action.payload
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload
    }
  },
  extraReducers: builder => {
    // Get Users Pagination
    builder
      .addCase(getUserPagination.pending, state => {
        state.isLoading = true
      })
      .addCase(getUserPagination.fulfilled, (state, action) => {
        state.isLoading = false
        state.users = action.payload.data.users
        state.total = action.payload.data.total
        state.page = action.payload.data.page
        state.perPage = action.payload.data.per_page
      })
      .addCase(getUserPagination.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

    // Toggle User Status
    builder
      .addCase(toggleUserStatus.pending, state => {
        state.isLoading = true
      })
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.users.findIndex(user => user._id === action.payload._id)
        if (index !== -1) {
          state.users[index] = action.payload
        }
      })
      .addCase(toggleUserStatus.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

    // Delete User
    builder
      .addCase(deleteUser.pending, state => {
        state.isLoading = true
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.users = state.users.filter(user => user._id !== action.payload)
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  }
})

export const { setIsModalVisible, setIsDetailsModalVisible, setSelectedUser } = userSlice.actions

export default userSlice.reducer
