import { createSlice } from '@reduxjs/toolkit'
import { getSurvey, updateSurvey } from './surveyThunks'

const initialState = {
  survey: {
    data: null, // ✅ Đổi từ {} thành null để dễ kiểm tra
    isLoading: false,
    error: null
  }
}

const surveySlice = createSlice({
  name: 'survey',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getSurvey.pending, state => {
        state.survey.isLoading = true
        state.survey.error = null
      })
      .addCase(getSurvey.fulfilled, (state, action) => {
        state.survey.isLoading = false

        // ✅ Kiểm tra dữ liệu API trước khi cập nhật state
        if (action.payload && action.payload.data) {
          state.survey.data = action.payload.data // 🛠 Fix lỗi dữ liệu bị lồng
        } else {
          state.survey.data = null
        }
      })
      .addCase(getSurvey.rejected, (state, action) => {
        state.survey.isLoading = false
        state.survey.error = action.payload
      })
      .addCase(updateSurvey.pending, state => {
        state.survey.isLoading = true
        state.survey.error = null
      })
      .addCase(updateSurvey.fulfilled, (state, action) => {
        state.survey.isLoading = false

        // ✅ Fix lỗi API trả về data bị lồng thêm một cấp
        if (action.payload && action.payload.data) {
          state.survey.data = action.payload.data
        } else {
          state.survey.data = null
        }
      })
      .addCase(updateSurvey.rejected, (state, action) => {
        state.survey.isLoading = false
        state.survey.error = action.payload
      })
  }
})

export default surveySlice.reducer
