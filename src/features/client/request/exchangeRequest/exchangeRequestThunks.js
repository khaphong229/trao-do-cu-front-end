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
  async (status, { rejectWithValue }) => {
    try {
      const response = await exchangeRequestService.getMyRequestedExchange(status)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Có lỗi xảy ra')
    }
  }
)

export const getExchangeRequest = createAsyncThunk(
  'exchangeRequest/getExchangeRequest',
  async ({ current, pageSize, post_id = '', status, statusPotsId }, { rejectWithValue }) => {
    try {
      const response = await exchangeRequestService.getExchangeRequests({
        current,
        pageSize,
        post_id,
        status,
        statusPotsId
      })

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
  'exchangeRequest/acceptExchangeRequest',
  async ({ requestId, status }, { rejectWithValue }) => {
    try {
      const response = await exchangeRequestService.confirmRequestExchange(requestId, status)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data || 'An error occurred while accepting the request')
    }
  }
)

export const rejectExchangeRequest = createAsyncThunk(
  'exchangeRequest/rejectExchangeRequest',
  async (id, { rejectWithValue }) => {
    try {
      const response = await exchangeRequestService.rejectedRequestExchange(id)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data || 'An error occurred while accepting the request')
    }
  }
)

export const getCountExchange = createAsyncThunk(
  'exchangeRequest/getCountExchange',
  async (id, { rejectWithValue }) => {
    try {
      const response = await exchangeRequestService.getCountExchange(id)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data || 'An error occurred while accepting the request')
    }
  }
)
