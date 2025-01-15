import { createAsyncThunk } from '@reduxjs/toolkit'
import AuthService from '../../services/authService'
import { setAuthToken } from '../../utils/localStorageUtils'

const TIMEOUT_DURATION = 5000

const timeoutPromise = () => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject({
        response: {
          data: {
            message: 'Request timeout - Vui lòng kiểm tra kết nối mạng'
          }
        }
      })
    }, TIMEOUT_DURATION)
  })
}

export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, { rejectWithValue }) => {
  const { isAdmin, ...data } = credentials

  try {
    // const response = await Promise.race([AuthService.login(data, isAdmin), timeoutPromise()])

    const response = await AuthService.login(data, isAdmin)

    const { status } = response.data
    if (status === 200) {
      setAuthToken(response.data.data.access_token)
      return response.data
    } else {
      return rejectWithValue({
        message: response.data.message || 'Login failed'
      })
    }
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { rejectWithValue }) => {
  try {
    await AuthService.logout()
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const registerUser = createAsyncThunk('auth/registerUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await AuthService.register(userData)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const getCurrentUser = createAsyncThunk('auth/getCurrentUser', async (isAdmin, { rejectWithValue }) => {
  try {
    const response = isAdmin ? await AuthService.getAdminCurrentUser() : await AuthService.getCurrentUser()

    if (!response.data) {
      return rejectWithValue({ message: 'Không tìm thấy người dùng' })
    }

    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Lỗi lấy tài khoản' })
  }
})

export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (userData, { rejectWithValue, dispatch }) => {
    try {
      let updatedUserData = { ...userData }
      if (userData.avatar) {
        updatedUserData = {
          ...userData,
          social_media: [
            {
              ...(userData.social_media?.[0] || {}), // Giữ lại các field khác nếu có
              avatar: userData.avatar
            }
          ]
        }
      }
      const response = await AuthService.updateProfile(userData)

      if (response.data.status === 201) {
        await dispatch(getCurrentUser())
        return response.data
      } else {
        return rejectWithValue(response.data)
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update profile' })
    }
  }
)
export const changePassWord = createAsyncThunk('auth/changePassWord', async (data, { rejectWithValue }) => {
  try {
    const response = await AuthService.changePassWord({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword
    })

    // Log response từ API
    console.log('Change password response:', response)

    return response.data
  } catch (error) {
    console.error('Change password error:', error.response?.data)
    return rejectWithValue(error.response?.data || { message: 'Failed to change password' })
  }
})
export const shareProfile = createAsyncThunk('auth/shareProfile', async (userId, { rejectWithValue }) => {
  try {
    const response = await AuthService.shareProfile(userId)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data)
  }
})
