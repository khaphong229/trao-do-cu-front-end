import { createAsyncThunk } from '@reduxjs/toolkit'
import surveyService from 'services/client/surveyService'

export const getSurvey = createAsyncThunk('survey/getSurvey', async (_, { rejectWithValue }) => {
  try {
    const response = await surveyService.getSurvey()
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Lỗi không xác định')
  }
})

export const updateSurvey = createAsyncThunk('survey/updateSurvey', async (data, { rejectWithValue }) => {
  try {
    // Chuyển đổi dữ liệu trước khi gửi lên API
    const processedData = {
      interests: data.interests.map(item => {
        // Đảm bảo category_id là string hoặc loại bỏ các trường không cần thiết
        return {
          category_id:
            typeof item.category_id === 'string' ? item.category_id : item.category_id._id || item.category_id,
          category_name: item.category_name,
          selected_at: item.selected_at
        }
      })
    }

    const response = await surveyService.updateSurvey(processedData)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Lỗi không xác định')
  }
})
