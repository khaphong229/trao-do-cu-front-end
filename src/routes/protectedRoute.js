import { useDispatch, useSelector } from 'react-redux'
import { getAuthToken, removeAuthToken } from '../utils/localStorageUtils'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { getCurrentUser, logoutUser } from '../features/auth/authThunks'
import FullScreenLoading from '../components/common/Loading'

export const ProtectedRoute = ({ requireAuth = true, adminOnly = false }) => {
  const dispatch = useDispatch()
  const { isAuthenticated, isAdmin, isLoading } = useSelector(state => state.auth)
  const location = useLocation()

  useEffect(() => {
    const token = getAuthToken()

    // Chỉ thực hiện getCurrentUser khi có token và chưa xác thực
    if (token && !isAuthenticated) {
      const isAdminRoute = window.location.pathname.includes('/admin')
      dispatch(getCurrentUser(isAdminRoute))
        .unwrap()
        .catch(() => {
          // Nếu get user thất bại, logout và xóa token
          dispatch(logoutUser())
          removeAuthToken()
        })
    }
  }, [dispatch, isAuthenticated, location.pathname])

  // Nếu đang loading hoặc đang chuyển trang, hiển thị loading toàn màn hình
  if (isLoading) {
    ;<FullScreenLoading isVisible={true} /> // or return <FullScreenLoading isVisible={true} /> if you uncomment it
  }

  const isAuthRoute = location.pathname.includes('/login') || location.pathname.includes('/register')

  // Yêu cầu xác thực
  if (requireAuth) {
    // Chưa đăng nhập
    if (!isAuthenticated) {
      return <Navigate to={adminOnly ? '/admin/login' : '/login'} state={{ from: location }} replace />
    }

    // Đăng nhập nhưng không phải admin khi truy cập trang admin
    if (adminOnly && !isAdmin) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />
    }
  }

  // Nếu đã đăng nhập và đang cố truy cập trang login/register
  if (isAuthRoute && isAuthenticated) {
    return <Navigate to={isAdmin ? '/admin/dashboard' : '/'} replace />
  }

  return <Outlet />
}
