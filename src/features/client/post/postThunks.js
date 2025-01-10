import { createAsyncThunk } from '@reduxjs/toolkit'
import postService from 'services/client/postService'

export const createPost = createAsyncThunk('post/createPost', async (postData, { rejectWithValue, dispatch }) => {
  try {
    const response = await postService.createPost(postData)

    await dispatch(
      getPostPagination({
        current: 1,
        pageSize: 8,
        query: ''
      })
    )

    return response.data
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const getPostPagination = createAsyncThunk(
  'post/getPostPagination',
  async ({ current, pageSize, query = '', category_id = null, type = null, city = null }, { rejectWithValue }) => {
    try {
      const response = await postService.getPostPagination({
        current,
        pageSize,
        q: query,
        category_id,
        type,
        city,
        status: 'active'
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Đã xảy ra lỗi không xác định')
    }
  }
)

export const getPostId = createAsyncThunk('post/getPostId', async (id, { rejectWithValue }) => {
  try {
    const response = await postService.getPostById(id)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const getPostGiftPagination = createAsyncThunk(
  'post/getPostGiftPagination',
  async ({ current, pageSize, status, type, q }, { rejectWithValue }) => {
    try {
      const response = await postService.getPostOfMePagination({
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
