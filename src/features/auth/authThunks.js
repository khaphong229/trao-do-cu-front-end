import { createAsyncThunk } from '@reduxjs/toolkit'
import AuthService from '../../services/authService'
import { setAuthToken } from '../../utils/localStorageUtils'
import { timeoutPromise } from 'utils/errorUtils'

export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, { rejectWithValue }) => {
  const { isAdmin, ...data } = credentials

  try {
    const response = await Promise.race([AuthService.login(data, isAdmin), timeoutPromise(2500)])

    // const response = await AuthService.login(data, isAdmin)

    const { status } = response?.data
    if (status === 200) {
      setAuthToken(response.data.data.access_token)
      return response?.data
    } else {
      return rejectWithValue({
        message: response.data.message || 'Đăng nhập thất bại.'
      })
    }
  } catch (error) {
    if (error?.response?.data?.status === 408) {
      return rejectWithValue({
        message: error.response.data.message,
        status: 408
      })
    }

    return rejectWithValue(
      error.response?.data || {
        message: 'Đăng nhập thất bại',
        status: 500
      }
    )
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

    return response?.data
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Lỗi lấy tài khoản' })
  }
})

export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (userData, { rejectWithValue, getState, dispatch }) => {
    try {
      const currentUser = getState().auth.user
      const payload = {
        name: currentUser?.name || '',
        email: currentUser?.email || '',
        phone: currentUser?.phone || '',
        address: currentUser?.address || [],
        social_media: {
          facebook: currentUser?.social_media?.facebook || '',
          zalo: '',
          instagram: ''
        },
        // Remove social_media if not required
        // ...(currentUser?.social_media?.length > 0 && { social_media: [currentUser?.social_media[0]] }),
        ...userData
      }
      const response = await AuthService.updateProfile(payload)

      if (response.status === 201) {
        dispatch(getCurrentUser(false))
      }
      return response.data
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
      confirm_password: data.newPassword
    })

    return response.data
  } catch (error) {
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

export const loginGoogle = createAsyncThunk('auth/loginGoogle', async (id, { rejectWithValue }) => {
  try {
    const response = await AuthService.loginGoogle(id)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data)
  }
})
export const forgotPassword = createAsyncThunk('auth/forgotPassword', async (email, { rejectWithValue }) => {
  try {
    const response = await AuthService.forgotPassword(email)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data)
  }
})
export const resetPassword = createAsyncThunk('auth/resetPassword', async (data, { rejectWithValue }) => {
  try {
    console.log('Attempting password reset with data:', {
      token: data.token,
      new_password: '(password hidden for security)'
    })

    const response = await AuthService.resetPassword({
      token: data.token,
      new_password: data.new_password
    })

    console.log('Password reset response:', response)

    if (response?.data?.status === 200 || response?.data?.status === 201) {
      console.log('Password reset successful')
      return response.data
    } else {
      console.error('Password reset failed with status:', response?.data?.status)
      return rejectWithValue({
        message: response?.data?.message || 'Đặt lại mật khẩu thất bại. Vui lòng thử lại.'
      })
    }
  } catch (error) {
    console.error('Password reset error:', error)
    return rejectWithValue(
      error.response?.data || {
        message: 'Đặt lại mật khẩu thất bại. Vui lòng thử lại.',
        error: error.message
      }
    )
  }
})

export const updateDefaultAddress = createAsyncThunk('auth/updateDefaultAddress', async (data, { rejectWithValue }) => {
  try {
    const response = await AuthService.updateDefaultAddress(data)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Failed to update default address' })
  }
})
