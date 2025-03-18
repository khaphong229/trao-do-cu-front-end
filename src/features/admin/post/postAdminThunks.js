import { createAsyncThunk } from '@reduxjs/toolkit'
import postAdminService from 'services/admin/postAdminService'

export const getPostAdminPagination = createAsyncThunk(
  'postManagement/getPostAdminPagination',
  async (params, { rejectWithValue }) => {
    try {
      const response = await postAdminService.getPagination(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const approvalStatus = createAsyncThunk('postManagement/approvalStatus', async (id, { rejectWithValue }) => {
  try {
    const response = await postAdminService.approvalStatus(id)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Failed to approve post' })
  }
})
