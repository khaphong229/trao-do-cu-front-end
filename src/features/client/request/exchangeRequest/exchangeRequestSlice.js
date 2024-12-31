import { createSlice } from '@reduxjs/toolkit'
import { getMyRequestedExchange, requestExchange } from './exchangeRequestThunks'
import { uploadExchangeImages } from 'features/upload/uploadThunks'

const initialState = {
  requests: [],
  requestData: {
    post_id: '',
    user_req_id: '',
    title: '',
    description: '',
    status: 'pending',
    image_url: [],
    contact_phone: '',
    contact_social_media: [],
    contact_address: ''
  },
  selectedPostExchange: null,
  isInfoModalVisible: false,
  isExchangeFormModalVisible: false,
  isSocialLinkModalVisible: false,
  isLocationModalVisible: false,
  isCategoryModalVisible: false,
  isShowEmoji: false,
  isLoading: false,
  error: null
}

const exchangeRequestSlice = createSlice({
  name: 'exchangeRequest',
  initialState,
  reducers: {
    setInfoModalVisible: (state, action) => {
      state.isInfoModalVisible = action.payload
    },
    setExchangeFormModalVisible: (state, action) => {
      state.isExchangeFormModalVisible = action.payload
    },
    setShowEmoji: (state, action) => {
      state.isShowEmoji = action.payload
    },
    setSocialLinkModalVisible: (state, action) => {
      state.isSocialLinkModalVisible = action.payload
    },
    setLocationModalVisible: (state, action) => {
      state.isLocationModalVisible = action.payload
    },
    setCategoryModalVisible: (state, action) => {
      state.isCategoryModalVisible = action.payload
    },
    updateRequestData: (state, action) => {
      state.requestData = {
        ...state.requestData,
        ...action.payload
      }
    },
    resetRequestData: state => {
      state.requestData = initialState.requestData
    },
    setSelectedPostExchange: (state, action) => {
      state.selectedPostExchange = action.payload
    }
  },
  extraReducers: builder => {
    builder
      .addCase(requestExchange.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(requestExchange.fulfilled, state => {
        state.isLoading = false
      })
      .addCase(requestExchange.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      .addCase(uploadExchangeImages.pending, state => {
        state.isLoading = true
      })
      .addCase(uploadExchangeImages.fulfilled, (state, action) => {
        state.isLoading = false
        state.requestData.image_url.push(...action.payload.files.map(file => file.filepath))
      })
      .addCase(uploadExchangeImages.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(getMyRequestedExchange.pending, state => {
        state.isLoading = true
      })
      .addCase(getMyRequestedExchange.fulfilled, (state, action) => {
        state.isLoading = false
        state.requests = action.payload.data.requests
      })
      .addCase(getMyRequestedExchange.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  }
})

export const {
  setInfoModalVisible,
  setExchangeFormModalVisible,
  updateRequestData,
  resetRequestData,
  setShowEmoji,
  setSocialLinkModalVisible,
  setLocationModalVisible,
  setCategoryModalVisible,
  setSelectedPostExchange
} = exchangeRequestSlice.actions
export default exchangeRequestSlice.reducer
