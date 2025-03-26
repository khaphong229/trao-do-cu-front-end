import { createSlice } from '@reduxjs/toolkit'
import { getExchangeRequest, getMyRequestedExchange, requestExchange } from './exchangeRequestThunks'
import { uploadExchangeImages } from 'features/upload/uploadThunks'

const initialState = {
  posts: [], // Ensure posts is an array
  total: 0,
  current: 1,
  limit: 20,
  isError: false,
  errorMessage: '',

  requests: [],
  requestData: {
    post_id: '',
    user_req_id: '',
    title: '',
    description: '',
    status: 'pending',
    image_url: [],
    contact_phone: '',
    contact_social_media: {
      facebook: '',
      instagram: '',
      zalo: ''
    },
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
    resetPosts: state => {
      state.posts = []
    },
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
        state.requests = action.payload.data
      })
      .addCase(getMyRequestedExchange.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      .addCase(getExchangeRequest.pending, state => {
        state.isLoading = true
        state.isError = false
        state.errorMessage = ''
      })
      .addCase(getExchangeRequest.fulfilled, (state, action) => {
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
      .addCase(getExchangeRequest.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.errorMessage = action.payload || 'An error occurred'
        state.posts = []
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
  setSelectedPostExchange,
  resetPosts
} = exchangeRequestSlice.actions
export default exchangeRequestSlice.reducer
