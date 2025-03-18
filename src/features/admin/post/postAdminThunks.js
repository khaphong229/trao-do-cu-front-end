import { createAsyncThunk } from '@reduxjs/toolkit'
import postAdminService from 'services/admin/postAdminService'

export const getPostPagination = createAsyncThunk(
  'postManagement/getPagination',
  async ({ page, per_page, searchText = '' }, { rejectWithValue }) => {
    try {
      console.log('Calling API with params:', { page, per_page, q: searchText })
      const response = await postAdminService.getPagination({
        page,
        per_page,
        q: searchText
      })
      console.log('API response:', response.data)
      return response.data
    } catch (error) {
      console.error('API error:', error)
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch posts' })
    }
  }
)
export const approvalStatus = createAsyncThunk('postManagement/approvalStatus', async (id, { rejectWithValue }) => {
  try {
    const response = await postAdminService.approvalStatus(id)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Failed to toggle user status' })
  }
})
