import { createAsyncThunk } from '@reduxjs/toolkit'
import postAdminService from 'services/admin/postAdminService'

export const getPostAdminPagination = createAsyncThunk(
  'postManagement/getPostAdminPagination',
  async (params, { rejectWithValue }) => {
    try {
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime()
      const response = await postAdminService.getPagination({
        ...params,
        _t: timestamp
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch posts' })
    }
  }
)

export const approvalStatus = createAsyncThunk(
  'postManagement/approvalStatus',
  async ({ id, rewardAmount, requiredAmount, isApproved, reason }, { rejectWithValue }) => {
    try {
      const response = await postAdminService.approvalStatus(id, {
        rewardAmount,
        requiredAmount,
        isApproved,
        reason,
        data: {
          rewardAmount,
          requiredAmount,
          isApproved,
          reason
        }
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update post' })
    }
  }
)
