import { createSlice } from '@reduxjs/toolkit'
import { getUserPagination, toggleUserStatus, deleteUser, createUser, updateUser, getUserById } from './userThunks'

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
    // Get Users Pagination
    builder
      .addCase(getUserPagination.pending, state => {
        state.isLoading = true
        state.error = null
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
        state.error = null
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
        state.error = null
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.users = state.users.filter(user => user._id !== action.payload)
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

    // Create User
    builder
      .addCase(createUser.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isModalVisible = false
        state.users.push(action.payload) // Thêm người dùng mới
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

    // Update User
    builder
      .addCase(updateUser.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isModalVisible = false
        const index = state.users.findIndex(user => user._id === action.payload._id)
        if (index !== -1) {
          state.users[index] = action.payload // Cập nhật người dùng
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

    // Get User By ID
    // Đảm bảo rằng bạn đã thêm getUserById vào extraReducers
    builder
      .addCase(getUserById.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.isLoading = false
        state.selectedUser = action.payload // Cập nhật selectedUser
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  }
})

export const {
  setIsModalVisible,
  setIsDetailsModalVisible,
  setSelectedUser,
  setPage,
  setPerPage,
  clearError,
  resetState
} = userSlice.actions

export default userSlice.reducer
