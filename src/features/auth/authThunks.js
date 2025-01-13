import { createAsyncThunk } from '@reduxjs/toolkit'
import AuthService from '../../services/authService'
import { setAuthToken } from '../../utils/localStorageUtils'
import { timeoutPromise } from 'utils/errorUtils'
import { setLoading } from './authSlice'

export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, { rejectWithValue, dispatch }) => {
  const { isAdmin, ...data } = credentials

  try {
    const response = await Promise.race([AuthService.login(data, isAdmin), timeoutPromise(2500)])

    // const response = await AuthService.login(data, isAdmin)

    const { status } = response.data
    if (status === 200) {
      setAuthToken(response.data.data.access_token)
      return response.data
    } else {
      return rejectWithValue({
        message: response.data.message || 'Đăng nhập thất bại.'
      })
    }
  } catch (error) {
    dispatch(setLoading(false))

    if (error?.response?.data?.status === 408) {
      return rejectWithValue({
        message: error.response.data.message,
        status: 408
      })
    }

    return rejectWithValue(
      error.response.data || {
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

    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Lỗi lấy tài khoản' })
  }
})

export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (userData, { rejectWithValue, dispatch }) => {
    try {
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
