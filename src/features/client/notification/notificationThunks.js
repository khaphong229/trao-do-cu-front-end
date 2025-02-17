import { createAsyncThunk } from '@reduxjs/toolkit'
import notificationService from 'services/client/notificationService'

export const getNotificationPagination = createAsyncThunk(
  'notification/getNotificationPagination',
  async ({ current, pageSize, query = '' }, { rejectWithValue }) => {
    try {
      const response = await notificationService.getNotificationPagination({
        current,
        pageSize,
        q: query
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Đã xảy ra lỗi không xác định')
    }
  }
)

export const markNotificationAsRead = createAsyncThunk(
  'notification/markNotificationAsRead',
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await notificationService.markAsRead(notificationId)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Đã xảy ra lỗi không xác định')
    }
  }
)

export const markAllNotificationsAsRead = createAsyncThunk(
  'notification/markAllNotificationsAsRead',
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationService.markAllAsRead()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Đã xảy ra lỗi không xác định')
    }
  }
)
