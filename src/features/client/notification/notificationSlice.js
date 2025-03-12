import { createSlice } from '@reduxjs/toolkit'
import { getNotificationPagination } from './notificationThunks'

const initialState = {
  notifications: {
    data: [],
    total: 0,
    current: 1,
    isLoading: false,
    error: null
  },
  isVisibleSuccessPopup: false,
  isVisibleNotificationDetail: false,
  selectedNotification: null
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    markNotificationAsRead: (state, action) => {
      const notification = state.notifications.data.find(n => n._id === action.payload)
      if (notification) {
        notification.isRead = true
      }
    },
    markAllNotificationsAsRead: state => {
      state.notifications.data.forEach(notification => {
        notification.isRead = true
      })
    },
    setVisibleSuccessPopup: (state, action) => {
      state.isVisibleSuccessPopup = action.payload
    },
    setVisibleNotificationDetail: (state, action) => {
      state.isVisibleNotificationDetail = action.payload
    },
    setSelectedNotification: (state, action) => {
      state.selectedNotification = action.payload
    }
  },
  extraReducers: builder => {
    builder
      .addCase(getNotificationPagination.pending, state => {
        state.notifications.isLoading = true
        state.notifications.error = null
      })
      .addCase(getNotificationPagination.fulfilled, (state, action) => {
        state.notifications.isLoading = false
        state.notifications.data = action.payload.data.data
        state.notifications.total = action.payload.data.total
        state.notifications.current = action.payload.data.current
      })
      .addCase(getNotificationPagination.rejected, (state, action) => {
        state.notifications.isLoading = false
        state.notifications.error = action.payload
      })
  }
})

export const {
  markNotificationAsRead,
  markAllNotificationsAsRead,
  setVisibleSuccessPopup,
  setVisibleNotificationDetail,
  setSelectedNotification
} = notificationSlice.actions
export default notificationSlice.reducer
