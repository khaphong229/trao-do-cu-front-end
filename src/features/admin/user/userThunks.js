import { createAsyncThunk } from '@reduxjs/toolkit'
import UserService from '../../../services/admin/userService'

export const getUserPagination = createAsyncThunk(
  'userManagement/getPagination',
  async (params, { rejectWithValue }) => {
    try {
      const response = await UserService.getPagination(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const toggleUserStatus = createAsyncThunk('userManagement/toggleStatus', async (id, { rejectWithValue }) => {
  try {
    const response = await UserService.toggleUserStatus(id)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const deleteUser = createAsyncThunk('userManagement/deleteUser', async (id, { rejectWithValue }) => {
  try {
    await UserService.deleteUser(id)
    return id
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const createUser = createAsyncThunk('userManagement/createUser', async (data, { rejectWithValue }) => {
  try {
    const response = await UserService.addUser(data)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})
export const updateUser = createAsyncThunk('userManagement/updateUser', async (id, data, { rejectWithValue }) => {
  try {
    const response = await UserService.updateUser(id, data)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})
