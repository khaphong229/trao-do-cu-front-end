import { createAsyncThunk } from '@reduxjs/toolkit'
// import { getPostPagination } from 'features/client/post/postThunks'
import giftRequestService from 'services/client/requestService/giftRequestService'

export const requestGift = createAsyncThunk(
  'giftRequest/requestGift',
  async (requestData, { rejectWithValue, dispatch }) => {
    try {
      const response = await giftRequestService.requestGift(requestData)
      // dispatch(
      //   getPostPagination({
      //     current: 1,
      //     pageSize: 8
      //   })
      // )
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Có lỗi xảy ra')
    }
  }
)

export const checkRequestedGift = createAsyncThunk(
  'giftRequest/checkRequestedGift',
  async ({ post_id, user_req_id }, { rejectWithValue }) => {
    try {
      const response = await giftRequestService.checkRequestedGift({ post_id, user_req_id })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Có lỗi xảy ra')
    }
  }
)

export const getMyRequestedGift = createAsyncThunk('giftRequest/getMyRequestedGift', async (_, { rejectWithValue }) => {
  try {
    const response = await giftRequestService.getMyRequestedGift()
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Có lỗi xảy ra')
  }
})

export const getReceiveRequestGift = createAsyncThunk(
  'giftRequest/getReceiveRequestGift',
  async ({ current, pageSize, post_id = '' }, { rejectWithValue }) => {
    try {
      const response = await giftRequestService.getReceiveRequest({ current, pageSize, post_id })
      return response
    } catch (error) {
      return rejectWithValue(error.response.data || 'An error occurred')
    }
  }
)

export const acceptGiftRequest = createAsyncThunk(
  'giftRequest/acceptGiftRequest',
  async ({ requestId, status }, { rejectWithValue }) => {
    try {
      const response = await giftRequestService.confirmRequestGift(requestId, status)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data || 'An error occurred while accepting the request')
    }
  }
)

export const rejectGiftRequest = createAsyncThunk('giftRequest/rejectGiftRequest', async (id, { rejectWithValue }) => {
  try {
    const response = await giftRequestService.rejectRequestGift(id)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response.data || 'An error occurred while accepting the request')
  }
})
