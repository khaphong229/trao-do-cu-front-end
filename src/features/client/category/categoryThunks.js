import { createAsyncThunk } from '@reduxjs/toolkit'
import categoryService from 'services/client/categoryService'

export const getAllCategory = createAsyncThunk('category/getAll', async (_, { rejectWithValue }) => {
  try {
    const response = await categoryService.getAllCategory()
    return response.data
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})
