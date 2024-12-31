import { createSlice } from '@reduxjs/toolkit'
import { getMyRequestedGift, requestGift } from './giftRequestThunks'

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
  error: null
}

const giftRequestSlice = createSlice({
  name: 'giftRequest',
  initialState,
  reducers: {
    setInfoModalVisible: (state, action) => {
      state.isInfoModalVisible = action.payload
    },
    setAcceptModalVisible: (state, action) => {
      state.isAcceptModalVisible = action.payload
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
  }
})

export const { setInfoModalVisible, setAcceptModalVisible } = giftRequestSlice.actions
export default giftRequestSlice.reducer
