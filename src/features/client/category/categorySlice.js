import { createSlice } from '@reduxjs/toolkit'
import { getAllCategory } from './categoryThunks'

const initialState = {
  categories: [],
  isLoading: false,
  error: null,
  selectedCategory: null
}

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload
    },
    setCategory: (state, action) => {
      state.categories = action.payload
    }
  },
  extraReducers: builder => {
    builder
      .addCase(getAllCategory.pending, state => {
        state.isLoading = true
      })
      .addCase(getAllCategory.fulfilled, (state, action) => {
        state.isLoading = false
        state.categories = action.payload.data
      })
      .addCase(getAllCategory.rejected, state => {
        state.isLoading = false
      })
  }
})

export const { setSelectedCategory, setCategory } = categorySlice.actions

export default categorySlice.reducer
