import { createSlice } from '@reduxjs/toolkit'
import { getCurrentUser, loginUser, logoutUser, registerUser, updateUserProfile } from './authThunks'

const initialState = {
  user: {},
  isAuthenticated: false,
  isAdmin: false,
  isLoading: false,
  error: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload
    }
  },
  extraReducers: builder => {
    // Login
    builder
      .addCase(loginUser.pending, state => {
        state.isLoading = true
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.isAdmin = action.meta.arg.isAdmin || false
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action?.payload?.message || 'Đăng nhập Không thành công. Vui lòng thử lại'
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.user = null
        state.isAuthenticated = false
        state.isAdmin = false
      })

      // Register
      .addCase(registerUser.pending, state => {
        state.isLoading = true
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false
      })

      // Get Current User
      .addCase(getCurrentUser.pending, state => {
        state.isLoading = true
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload.data
        state.isLoading = false
        state.isAuthenticated = true
        state.isAdmin = action.meta.arg || false
      })
      .addCase(getCurrentUser.rejected, state => {
        state.isLoading = false
      })
      //Update User
      .addCase(updateUserProfile.pending, state => {
        state.isLoading = true
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = {
          ...state.user,
          ...action.payload.data
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload?.message || 'Profile update failed'
      })
  }
})

export const { clearError, setLoading } = authSlice.actions
export default authSlice.reducer
