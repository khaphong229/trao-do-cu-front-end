import { createAsyncThunk } from '@reduxjs/toolkit'
import meService from 'services/client/categoryService'

export const getAllMe = createAsyncThunk('meUser/getAllMe', async (_, { rejectWithValue }) => {
  try {
    const response = await meService.getAllMe()
    return response.data
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})
export const updateMe = createAsyncThunk('meUser/updateMe', async (data, { rejectWithValue }) => {
  try {
    const response = await meService.updateMe(data)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})
