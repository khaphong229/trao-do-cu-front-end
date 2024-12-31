import { uploadPostImages } from '../../upload/uploadThunks'
import { createPost, getPostId, getPostPagination } from './postThunks'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  // create post initial state
  dataCreatePost: {
    title: '',
    description: '',
    type: 'gift',
    status: 'active',
    specificLocation: '',
    city: '',
    image_url: [],
    category_id: null
  },
  isShowTour: false,
  isLoadingModal: false,
  isLoadingButton: false,
  isCreateModalVisible: false,
  isSocialLinkModalVisible: false,
  isLocationModalVisible: false,
  isCategoryModalVisible: false,
  isShowEmoji: false,
  isShowContactDetailModalVisible: false,
  error: null,
  /// get post initital state
  posts: [],
  total: 0,
  selectedPost: null,
  isLoading: false,
  isError: false,
  current: 1,
  pageSize: 5,
  hasMore: true,
  query: ''
  // get my post
}

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    //create post action
    setCreateModalVisibility: (state, action) => {
      state.isCreateModalVisible = action.payload
    },
    setSocialLinkModalVisibility: (state, action) => {
      state.isSocialLinkModalVisible = action.payload
    },
    setLocationModalVisibility: (state, action) => {
      state.isLocationModalVisible = action.payload
    },
    setCategoryModalVisibility: (state, action) => {
      state.isCategoryModalVisible = action.payload
    },
    setShowEmoji: (state, action) => {
      state.isShowEmoji = action.payload
    },
    setShowTour: (state, action) => {
      state.isShowTour = action.payload
    },
    setShowContactDetailModalVisible: (state, action) => {
      state.isShowContactDetailModalVisible = action.payload
    },
    updatePostData: (state, action) => {
      state.dataCreatePost = {
        ...state.dataCreatePost,
        ...action.payload
      }
    },
    resetPostData: state => {
      state.dataCreatePost = initialState.dataCreatePost
    },

    //// get post action
    searchPost: (state, action) => {
      state.query = action.payload
    },

    resetPosts: state => {
      state.posts = []
      state.current = 1
      state.hasMore = true
    },
    resetPage: state => {
      state.current = 1
      state.hasMore = true
    },
    clearPosts: state => {
      state.posts = []
    },
    resetSearch: state => {
      state.query = ''
    }
  },

  //get my post & post management
  extraReducers: builder => {
    // Create Post Reducers
    builder
      .addCase(createPost.pending, state => {
        state.isLoadingButton = true
        state.error = null
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isLoadingButton = false
        state.isCreateModalVisible = false
        state.dataCreatePost = initialState.dataCreatePost
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isLoadingButton = false
        state.error = action.payload
      })

      // Upload Images Reducers
      .addCase(uploadPostImages.pending, state => {
        state.isLoadingModal = true
      })
      .addCase(uploadPostImages.fulfilled, (state, action) => {
        state.isLoadingModal = false
        state.dataCreatePost.image_url.push(...action.payload.files.map(file => file.filepath))
      })
      .addCase(uploadPostImages.rejected, (state, action) => {
        state.isLoadingModal = false
        state.error = action.payload
      })

      ///get post reducers
      .addCase(getPostPagination.pending, state => {
        state.isLoading = true
        state.isError = null
      })
      .addCase(getPostPagination.fulfilled, (state, action) => {
        state.isLoading = false
        state.isError = null

        const newPosts = action.payload?.data?.data || []
        const currentPage = action.payload?.data?.current || 1

        if (currentPage === 1) {
          state.posts = newPosts
        } else {
          const uniquePosts = newPosts.filter(
            newPost => !state.posts.some(existingPost => existingPost._id === newPost._id)
          )
          state.posts = [...state.posts, ...uniquePosts]
        }

        state.hasMore = newPosts.length === action.payload?.data?.limit
        state.current = currentPage
        state.total = action.payload?.data?.total || 0
      })
      .addCase(getPostPagination.rejected, (state, action) => {
        state.isLoading = false
        state.isError = action.payload || 'Đã xảy ra lỗi khi tải dữ liệu!'
      })

      .addCase(getPostId.pending, state => {
        state.isLoading = true
      })
      .addCase(getPostId.fulfilled, (state, action) => {
        state.isLoading = false
        state.selectedPost = action.payload.data
      })
      .addCase(getPostId.rejected, state => {
        state.isLoading = false
      })
  }
})

export const {
  setCreateModalVisibility,
  setSocialLinkModalVisibility,
  setLocationModalVisibility,
  setCategoryModalVisibility,
  setShowTour,
  setShowContactDetailModalVisible,
  setShowEmoji,
  updatePostData,
  resetPostData,
  searchPost,
  resetPosts,
  resetSearch,
  resetPage,
  clearPosts
} = postSlice.actions

export default postSlice.reducer
