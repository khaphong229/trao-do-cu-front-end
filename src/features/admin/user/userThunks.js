import { createAsyncThunk } from '@reduxjs/toolkit'
import UserService from '../../../services/admin/userService'

export const getUserPagination = createAsyncThunk(
  'userManagement/getPagination',
  async ({ page, per_page, searchText = '' }, { rejectWithValue }) => {
    try {
      const response = await UserService.getPagination({
        page,
        per_page,
        search: searchText
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch users' })
    }
  }
)

export const toggleUserStatus = createAsyncThunk('userManagement/toggleStatus', async (id, { rejectWithValue }) => {
  try {
    const response = await UserService.toggleUserStatus(id)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Failed to toggle user status' })
  }
})

export const deleteUser = createAsyncThunk('userManagement/deleteUser', async (id, { rejectWithValue }) => {
  try {
    await UserService.deleteUser(id)
    return id
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Failed to delete user' })
  }
})

export const createUser = createAsyncThunk('userManagement/createUser', async (data, { rejectWithValue }) => {
  try {
    const response = await UserService.addUser(data)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Failed to create user' })
  }
})

export const updateUser = createAsyncThunk('userManagement/updateUser', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await UserService.updateUser(id, data)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Failed to update user' })
  }
})

export const getUserById = createAsyncThunk('userManagement/getUserById', async (id, { rejectWithValue }) => {
  try {
    const response = await UserService.getById(id)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Failed to get user details' })
  }
})
