import { createSlice } from '@reduxjs/toolkit'
import {
  changePassWord,
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  shareProfile,
  updateUserProfile
} from './authThunks'
import { uploadAvatar } from 'features/upload/uploadThunks'

const initialState = {
  user: {
    social_media: [] // Khởi tạo là mảng rỗng thay vì object
  },
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
      const currentAvatar = state.user?.avatar
      const currentSocialMedia = state.user?.social_media

      // Cập nhật user data từ response
      state.user = action.payload.data

      // Giữ lại avatar và social_media nếu có
      if (currentAvatar) {
        state.user.avatar = currentAvatar
      }
      if (currentSocialMedia?.length > 0) {
        state.user.social_media = currentSocialMedia
      }

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
    builder
      .addCase(changePassWord.pending, state => {
        state.isLoading = true
        state.error = null
        state.changePassWordSuccess = false
      })
      .addCase(changePassWord.fulfilled, (state, action) => {
        state.isLoading = false
        state.changePassWordSuccess = true
        state.changePassWordMessage = 'Thay đổi mật khẩu thành công!'
      })
      .addCase(changePassWord.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload?.message || 'Thay đổi mật khẩu thất bại!'
      })
    // update image avatar
    builder.addCase(uploadAvatar.pending, state => {
      state.isLoading = true
    })
    builder
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        if (action.payload?.files?.[0]?.url) {
          const newAvatarUrl = action.payload.files[0].url

          // Đảm bảo state.user tồn tại
          if (!state.user) {
            state.user = {}
          }

          // Cập nhật avatar trực tiếp
          state.user.avatar = newAvatarUrl

          // Đảm bảo social_media là mảng và cập nhật
          if (!Array.isArray(state.user.social_media)) {
            state.user.social_media = []
          }

          // Cập nhật vào social_media
          if (state.user.social_media.length === 0) {
            state.user.social_media = [{ avatar: newAvatarUrl }]
          } else {
            state.user.social_media[0] = {
              ...state.user.social_media[0],
              avatar: newAvatarUrl
            }
          }
        }
        state.isLoading = false
      })
      .addCase(uploadAvatar.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload?.message || 'Upload ảnh thất bại'
      })
    builder
      .addCase(shareProfile.pending, state => {
        state.isLoadingShare = true
        state.shareError = null
      })
      .addCase(shareProfile.fulfilled, (state, action) => {
        state.isLoadingShare = false
        state.shareSuccess = true
        state.shareUrl = action.payload.shareUrl
      })
      .addCase(shareProfile.rejected, (state, action) => {
        state.isLoadingShare = false
        state.shareError = action.payload?.message || 'Không thể chia sẻ trang'
      })
  }
})

export const { clearError, clearChangePassWordState } = authSlice.actions
export default authSlice.reducer
