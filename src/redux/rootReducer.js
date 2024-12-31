import { combineReducers } from '@reduxjs/toolkit'

import authReducer from '../features/auth/authSlice'
import userReducer from '../features/admin/user/userSlice'
import postReducer from '../features/client/post/postSlice'
import categoryReducer from '../features/client/category/categorySlice'
import giftRequestReducer from '../features/client/request/giftRequest/giftRequestSlice'
import exchangeRequestReducer from 'features/client/request/exchangeRequest/exchangeRequestSlice'

import postManageReducer from '../features/client/postManage/postManageSlice'
import getReceiveRequestGiftSliceReducer from '../features/client/getReceiveRequests/getReceiveRequestGiftSlice'
import getExchangeRequestSliceReducer from '../features/client/getExchangeRequests/getExchangeRequestSlice'

const rootReducer = combineReducers({
  auth: authReducer,
  userManagement: userReducer,
  post: postReducer,
  category: categoryReducer,
  giftRequest: giftRequestReducer,
  exchangeRequest: exchangeRequestReducer,
  postManage: postManageReducer,
  requestGift: getReceiveRequestGiftSliceReducer,
  requestExchange: getExchangeRequestSliceReducer
})

export default rootReducer
