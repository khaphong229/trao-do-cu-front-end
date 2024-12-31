import { createAsyncThunk } from '@reduxjs/toolkit'
import { getPostReceiveRequestService } from 'services/client/getReceiveRequestService'

export const getReceiveRequestGift = createAsyncThunk(
  'requestGift/getReceiveRequestGift',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getPostReceiveRequestService.getPostReceiveRequestService()
      return response
    } catch (error) {
      return rejectWithValue(error.response.data || 'An error occurred')
    }
  }
)

export const acceptGiftRequest = createAsyncThunk(
  'requestGift/acceptGiftRequest',
  async ({ requestId, status }, { rejectWithValue, dispatch }) => {
    try {
      const response = await getPostReceiveRequestService.confirmRequestGift(requestId, status)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data || 'An error occurred while accepting the request')
    }
  }
)

export const rejectGiftRequest = createAsyncThunk('requestGift/rejectGiftRequest', async (id, { rejectWithValue }) => {
  try {
    const response = await getPostReceiveRequestService.rejectRequestGift(id)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response.data || 'An error occurred while accepting the request')
  }
})
