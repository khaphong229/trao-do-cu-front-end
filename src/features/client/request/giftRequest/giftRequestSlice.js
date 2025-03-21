import { createSlice } from '@reduxjs/toolkit'
import { acceptGiftRequest, getMyRequestedGift, getReceiveRequestGift, requestGift } from './giftRequestThunks'

const initialState = {
  requests: [],
  requestData: {
    post_id: null,
    user_req_id: null,
    reason_receive: null,
    status: null,
    contact_phone: null,
    contact_social_media: [],
    contact_address: null,
    contact_name: null
  },
  isInfoModalVisible: false,
  isAcceptModalVisible: false,
  isLoading: false,
  error: null,

  posts: [],
  total: 0,
  current: 1,
  limit: 20,
  isError: false,
  errorMessage: '',

  isRequestNotificationModal: false
}

const giftRequestSlice = createSlice({
  name: 'giftRequest',
  initialState,
  reducers: {
    setRequestNotificationModal: (state, action) => {
      state.isRequestNotificationModal = action.payload
    },
    setInfoModalVisible: (state, action) => {
      state.isInfoModalVisible = action.payload
    },
    setAcceptModalVisible: (state, action) => {
      state.isAcceptModalVisible = action.payload
    },
    resetPosts: state => {
      state.posts = []
    }
  },
  extraReducers: builder => {
    builder
      .addCase(requestGift.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(requestGift.fulfilled, state => {
        state.isLoading = false
      })
      .addCase(requestGift.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(getMyRequestedGift.pending, state => {
        state.isLoading = true
      })
      .addCase(getMyRequestedGift.fulfilled, (state, action) => {
        state.isLoading = false
        state.requests = action.payload.data.requests
      })
      .addCase(getMyRequestedGift.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      .addCase(getReceiveRequestGift.pending, state => {
        state.isLoading = true
        state.isError = false
        state.errorMessage = ''
      })
      .addCase(getReceiveRequestGift.fulfilled, (state, action) => {
        state.isLoading = false
        if (action.payload) {
          state.posts = Array.isArray(action.payload.data) ? action.payload.data : []
          state.total = action.payload.total || 0
          state.current = action.payload.current || 1
          state.limit = action.payload.limit || 5
        } else {
          state.posts = []
          state.total = 0
          state.current = 1
          state.limit = 5
        }
      })
      .addCase(getReceiveRequestGift.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.errorMessage = action.payload || 'An error occurred'
        state.posts = []
      })
      .addCase(acceptGiftRequest.pending, state => {
        state.isLoading = true
      })
      .addCase(acceptGiftRequest.rejected, state => {
        state.isLoading = false
      })
      .addCase(acceptGiftRequest.fulfilled, state => {
        state.isLoading = false
      })
  }
})

export const { setInfoModalVisible, setAcceptModalVisible, resetPosts, setRequestNotificationModal } =
  giftRequestSlice.actions
export default giftRequestSlice.reducer
