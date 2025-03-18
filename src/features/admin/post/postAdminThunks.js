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

export const approvalStatus = createAsyncThunk(
  'postManagement/approvalStatus',
  async ({ id, isApproved, reason }, { rejectWithValue }) => {
    try {
      const response = await postAdminService.approvalStatus(id, { isApproved, reason })
      return response.data // Trả về dữ liệu bài đăng đã được cập nhật
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to approve post' })
    }
  }
)
