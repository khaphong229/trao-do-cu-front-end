import { createAsyncThunk } from '@reduxjs/toolkit'
import UploadService from 'services/uploadService'

export const uploadPostImages = createAsyncThunk('post/uploadPostImages', async (file, { rejectWithValue }) => {
  try {
    const response = await UploadService.uploadImage(file)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response.data || { message: 'Tải ảnh thất bại' })
  }
})

export const uploadExchangeImages = createAsyncThunk(
  'exchangeRequest/uploadExchangeImages',
  async (file, { rejectWithValue }) => {
    try {
      const response = await UploadService.uploadImage(file, 'exchange')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data || { message: 'Tải ảnh thất bại' })
    }
  }
)
export const uploadAvatar = createAsyncThunk('auth/uploadAvatar', async (file, { rejectWithValue }) => {
  try {
    const response = await UploadService.uploadImage(file, 'avatar')
    return response.data
  } catch (error) {
    return rejectWithValue(error.response.data || { message: 'Upload ảnh thất bại' })
  }
})
