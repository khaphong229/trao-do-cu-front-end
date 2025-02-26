import { combineReducers } from '@reduxjs/toolkit'

import authReducer from '../features/auth/authSlice'
import userReducer from '../features/admin/user/userSlice'
import postReducer from '../features/client/post/postSlice'
import categoryReducer from '../features/client/category/categorySlice'
import giftRequestReducer from '../features/client/request/giftRequest/giftRequestSlice'
import exchangeRequestReducer from 'features/client/request/exchangeRequest/exchangeRequestSlice'
import notificationReducer from 'features/client/notification/notificationSlice'
import surveyReducer from 'features/client/Survey/surveySlice'
const rootReducer = combineReducers({
  auth: authReducer,
  userManagement: userReducer,
  post: postReducer,
  category: categoryReducer,
  giftRequest: giftRequestReducer,
  exchangeRequest: exchangeRequestReducer,
  notification: notificationReducer,
  survey: surveyReducer
})

export default rootReducer
