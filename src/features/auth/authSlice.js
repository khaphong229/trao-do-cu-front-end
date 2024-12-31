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
    }
  },
  extraReducers: builder => {
    // Login
    builder.addCase(loginUser.pending, state => {
      state.isLoading = true
    })
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isLoading = false
      state.isAuthenticated = true
      state.isAdmin = action.meta.arg.isAdmin || false
    })
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload.message
    })

    // Logout
    builder.addCase(logoutUser.fulfilled, (state, action) => {
      state.user = null
      state.isAuthenticated = false
      state.isAdmin = false
    })

    // Register
    builder.addCase(registerUser.pending, state => {
      state.isLoading = true
    })
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.isLoading = false
    })
    builder.addCase(registerUser.rejected, (state, action) => {
      state.isLoading = false
    })

    // Get Current User
    builder.addCase(getCurrentUser.pending, state => {
      state.isLoading = true
    })
    builder.addCase(getCurrentUser.fulfilled, (state, action) => {
      state.user = action.payload.data
      state.isLoading = false
      state.isAuthenticated = true
      state.isAdmin = action.meta.arg || false
    })
    builder.addCase(getCurrentUser.rejected, state => {
      state.isLoading = false
    })
    //Update User
    builder.addCase(updateUserProfile.pending, state => {
      state.isLoading = true
    })
    builder.addCase(updateUserProfile.fulfilled, (state, action) => {
      state.isLoading = false
      state.user = {
        ...state.user,
        ...action.payload.data
      }
    })
    builder.addCase(updateUserProfile.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload?.message || 'Profile update failed'
    })
  }
})

export const { clearError } = authSlice.actions
export default authSlice.reducer
