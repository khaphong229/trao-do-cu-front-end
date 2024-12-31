import { createAsyncThunk } from '@reduxjs/toolkit'
import { postManageService } from 'services/client/postManagementService'

export const getPostGiftPagination = createAsyncThunk(
  'post/getPostGiftPagination',
  async ({ current, pageSize, status, type, q }, { rejectWithValue }) => {
    try {
      const response = await postManageService.getPostOfMePagination({
        current,
        pageSize,
        status,
        type,
        q
      })
      return response
    } catch (error) {
      return rejectWithValue(error.message || 'An error occurred')
    }
  }
)
