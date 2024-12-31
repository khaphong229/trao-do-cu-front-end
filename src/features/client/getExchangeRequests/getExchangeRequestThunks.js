import { createAsyncThunk } from '@reduxjs/toolkit'
import { getExchangeRequestService } from 'services/client/getExchangeRequestService'

export const getExchangeRequest = createAsyncThunk(
  'requestExchange/getExchangeRequest',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getExchangeRequestService.getExchangeRequests()

      if (!response?.data) {
        throw new Error('No data received from server')
      }

      return response
    } catch (error) {
      return rejectWithValue(error.response.data || 'An error occurred')
    }
  }
)

export const acceptExchangeRequest = createAsyncThunk(
  'requestExchange/acceptExchangeRequest',
  async ({ requestId, status }, { rejectWithValue }) => {
    try {
      const response = await getExchangeRequestService.confirmRequestExchange(requestId, status)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data || 'An error occurred while accepting the request')
    }
  }
)

export const rejectExchangeRequest = createAsyncThunk(
  'requestExchange/rejectExchangeRequest',
  async (id, { rejectWithValue }) => {
    try {
      const response = await getExchangeRequestService.rejectRequestExchange(id)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data || 'An error occurred while accepting the request')
    }
  }
)
