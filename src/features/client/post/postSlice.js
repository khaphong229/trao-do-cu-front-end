import { createSlice } from '@reduxjs/toolkit'
import { uploadPostImages } from '../../upload/uploadThunks'
import {
  createPost,
  getPostCategory,
  getPostGiftPagination,
  getPostId,
  getPostPagination,
  getPostPtitPagination
} from './postThunks'

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
    category_id: null,
    contact_phone: '',
    contact_social_media: {
      facebook: '',
      instagram: '',
      zalo: ''
    },
    isPtiterOnly: false
  },
  isPendingPostOpen: false,
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
  isLoadingPtit: false,
  isErrorPtit: false,
  current: 1,
  pageSize: 8,
  hasMore: true,
  query: '',
  isApproved: false,
  // get my post
  requestStatuses: {},
  statusCache: {},
  cacheTL: 5 * 60 * 1000,
  lastCacheUpdate: null,
  postDetail: null,

  viewMode: 'card',
  sortOrder: 'newest',
  cityFilter: null,

  isEdittingAddress: false,

  ptitPosts: []
}

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setEdittingAddress: (state, action) => {
      state.isEdittingAddress = action.payload
    },
    //create post action
    setCreateModalVisibility: (state, action) => {
      state.isCreateModalVisible = action.payload
    },
    setPendingPostOpen: (state, action) => {
      state.isPendingPostOpen = action.payload
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
    },
    setRequestStatuses: (state, action) => {
      const { postId, status } = action.payload
      state.requestStatuses[postId] = status
      state.statusCache[postId] = {
        status,
        timestamp: Date.now()
      }
    },
    clearExpiredCache: state => {
      const now = Date.now()
      Object.keys(state.statusCache).forEach(postId => {
        if (now - state.statusCache[postId].timestamp > state.cacheTL) {
          delete state.statusCache[postId]
          delete state.requestStatuses[postId]
        }
      })
    },
    updatePostRequestStatus: (state, action) => {
      const { postId } = action.payload
      const post = state.posts.find(post => post._id === postId)
      if (post) {
        post.isRequested = true
        post.display_request_count += 1
      }

      if (state.selectedPost && state.selectedPost._id === postId) {
        state.selectedPost.isRequested = true
        state.selectedPost.display_request_count += 1
      }
    },
    updatePostPtitRequestStatus: (state, action) => {
      const { postId } = action.payload
      // Update post in ptitPosts array
      const ptitPost = state.ptitPosts.find(post => post._id === postId)
      if (ptitPost) {
        ptitPost.isRequested = true
      }

      // Also check and update in regular posts array
      const regularPost = state.posts.find(post => post._id === postId)
      if (regularPost) {
        regularPost.isRequested = true
      }

      // Also update selectedPost if it matches
      if (state.selectedPost && state.selectedPost._id === postId) {
        state.selectedPost.isRequested = true
      }
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload
    },
    setCityFilter: (state, action) => {
      state.cityFilter = action.payload
    },
    updatePostApprovalStatus: (state, action) => {
      const { postId, isApproved } = action.payload
      const post = state.posts.find(post => post._id === postId)
      if (post) {
        post.isApproved = isApproved
      }
    }
  },
  extraReducers: builder => {
    // Create Post Reducers
    builder
      .addCase(createPost.pending, state => {
        state.isLoadingButton = true
        state.error = null
      })
      .addCase(createPost.fulfilled, state => {
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

      ///get post reducers - FIX HERE
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
          const existingPostIds = new Map(state.posts.map(post => [post._id, true]))
          const uniqueNewPosts = newPosts.filter(post => !existingPostIds.has(post._id))
          state.posts = [...state.posts, ...uniqueNewPosts]
        }

        state.hasMore = newPosts.length === action.payload?.data?.limit
        state.current = currentPage
        state.total = action.payload?.data?.total || 0
      })
      .addCase(getPostPagination.rejected, (state, action) => {
        state.isLoading = false
        state.isError = action.payload || 'Đã xảy ra lỗi khi tải dữ liệu!'
      })

      //get post ptit
      .addCase(getPostPtitPagination.pending, state => {
        state.isLoadingPtit = true
        state.isErrorPtit = null
      })
      .addCase(getPostPtitPagination.fulfilled, (state, action) => {
        state.isLoadingPtit = false
        state.isErrorPtit = null
        state.ptitPosts = action.payload?.data || []
        state.current = action.payload?.current || 1
        state.total = action.payload?.total || 0
      })
      .addCase(getPostPtitPagination.rejected, (state, action) => {
        state.isLoadingPtit = false
        state.isErrorPtit = action.payload || 'Đã xảy ra lỗi khi tải dữ liệu!'
      })

      .addCase(getPostCategory.pending, state => {
        state.isLoading = true
        state.isError = null
      })
      .addCase(getPostCategory.fulfilled, (state, action) => {
        state.isLoading = false
        state.isError = null

        const newPosts = action.payload?.data?.data || []
        const currentPage = action.payload?.data?.current || 1

        if (currentPage === 1) {
          state.posts = newPosts
        } else {
          const existingPostIds = new Map(state.posts.map(post => [post._id, true]))
          const uniqueNewPosts = newPosts.filter(post => !existingPostIds.has(post._id))
          state.posts = [...state.posts, ...uniqueNewPosts]
        }

        state.hasMore = newPosts.length === action.payload?.data?.limit
        state.current = currentPage
        state.total = action.payload?.data?.total || 0
      })
      .addCase(getPostCategory.rejected, (state, action) => {
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

      .addCase(getPostGiftPagination.pending, state => {
        state.isLoading = true
        state.isError = false
        state.errorMessage = ''
      })
      .addCase(getPostGiftPagination.fulfilled, (state, action) => {
        state.isLoading = false
        if (action.payload) {
          const posts = Array.isArray(action.payload.data.data) ? action.payload.data.data : []
          state.posts = posts
          state.total = action.payload.data.total || 0
          state.current = action.payload.data.current || 1
          state.limit = action.payload.data.limit || 5
        } else {
          state.posts = []
          state.total = 0
          state.current = 1
          state.limit = 5
        }
      })
      .addCase(getPostGiftPagination.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.errorMessage = action.payload || 'An error occurred'
        state.posts = []
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
  clearPosts,
  setRequestStatuses,
  clearExpiredCache,
  updatePostApprovalStatus,
  updatePostRequestStatus,
  updatePostPtitRequestStatus,
  setViewMode,
  setSortOrder,
  setCityFilter,
  setPendingPostOpen,
  setEdittingAddress
} = postSlice.actions

export default postSlice.reducer
