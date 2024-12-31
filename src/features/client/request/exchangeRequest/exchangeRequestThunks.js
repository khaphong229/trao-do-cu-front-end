import { createAsyncThunk } from '@reduxjs/toolkit'
import exchangeRequestService from 'services/client/requestService/exchangeRequestService'

export const requestExchange = createAsyncThunk(
  'exchangeRequest/requestExchange',
  async (requestData, { rejectWithValue }) => {
    try {
      const response = await exchangeRequestService.requestExchange(requestData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data || 'Có lỗi xảy ra')
    }
  }
)

export const checkRequestedExchange = createAsyncThunk(
  'exchangeRequest/checkRequestedExchange',
  async ({ post_id, user_req_id }, { rejectWithValue }) => {
    try {
      const response = await exchangeRequestService.checkRequestedExchange({ post_id, user_req_id })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Có lỗi xảy ra')
    }
  }
)

export const getMyRequestedExchange = createAsyncThunk(
  'exchangeRequest/getMyRequestedExchange',
  async (_, { rejectWithValue }) => {
    try {
      const response = await exchangeRequestService.getMyRequestedExchange()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Có lỗi xảy ra')
    }
  }
)
