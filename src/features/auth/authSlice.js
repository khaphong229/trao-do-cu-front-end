import { createSlice } from '@reduxjs/toolkit'
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  updateUserProfile,
  forgotPassword,
  resetPassword,
  updateDefaultAddress
} from './authThunks'

const initialState = {
  user: {},
  isAuthenticated: false,
  isAdmin: false,
  isLoading: false,
  error: null,
  changePassWordSuccess: false,
  changePassWordMessage: '',
  sharedProfile: null,
  isLoadingShare: false,
  shareError: null,
  shareSuccess: false,
  shareUrl: ''
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
    },
    clearChangePassWordState: state => {
      state.changePassWordSuccess = false
      state.changePassWordMessage = ''
      state.error = null
    },
    clearShareState: state => {
      state.shareError = null
      state.shareSuccess = false
    },
    setShareUrl: (state, action) => {
      state.shareUrl = action.payload
    },
    updateImageData: (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload
      }
    }
  },
  extraReducers: builder => {
    // Login
    builder
      .addCase(loginUser.pending, state => {
        // state.isLoading = true
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        // state.isLoading = false
        state.isAuthenticated = true
        state.isAdmin = action.meta.arg.isAdmin || false
      })
      .addCase(loginUser.rejected, (state, action) => {
        // state.isLoading = false
        state.error = action?.payload?.message || 'Đăng nhập Không thành công. Vui lòng thử lại'
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.user = null
        state.isAuthenticated = false
        state.isAdmin = false
      })

    // Register
    // .addCase(registerUser.pending, state => {
    //   state.isLoading = true
    // })
    // .addCase(registerUser.fulfilled, (state, action) => {
    //   state.isLoading = false
    // })
    // .addCase(registerUser.rejected, (state, action) => {
    //   state.isLoading = false
    // })

    // Get Current User
    builder.addCase(getCurrentUser.pending, state => {
      // state.isLoading = true
    })
    builder.addCase(getCurrentUser.fulfilled, (state, action) => {
      state.user = action.payload?.data
      // state.isLoading = false
      state.isAuthenticated = true
      state.isAdmin = action.meta.arg || false
    })
    builder.addCase(getCurrentUser.rejected, state => {
      // state.isLoading = false
    })
    //Update User
    builder.addCase(updateUserProfile.pending, state => {
      // state.isLoading = true
    })
    builder.addCase(updateUserProfile.fulfilled, (state, action) => {
      // state.isLoading = false
      state.user = {
        ...state.user,
        ...action.payload.data
      }
    })
    builder.addCase(updateUserProfile.rejected, (state, action) => {
      // state.isLoading = false
      state.error = action.payload?.message || 'Profile update failed'
    })
    //Change Password
    builder
      .addCase(forgotPassword.pending, state => {
        state.isLoading = true
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.changePassWordSuccess = true
        state.changePassWordMessage = action.payload.message
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false
        state.changePassWordSuccess = false
        state.changePassWordMessage = action?.payload?.message || 'Change Password Failed'
      })
    //Reset Password
    builder
      .addCase(resetPassword.pending, state => {
        state.isLoading = true
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.changePassWordSuccess = true
        state.changePassWordMessage = action.payload.message
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false
        state.changePassWordSuccess = false
        state.changePassWordMessage = action?.payload?.message || 'Reset Password Failed'
      })
    builder.addCase(updateDefaultAddress.fulfilled, (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload.data
      }
    })
    builder.addCase(updateDefaultAddress.rejected, (state, action) => {
      state.error = action.payload?.message || 'Profile update failed'
    })
  }
})

export const { clearError, setLoading, clearChangePassWordState, clearShareState, setShareUrl, updateImageData } =
  authSlice.actions
export default authSlice.reducer
