import { redirect } from 'react-router-dom'
import { getAuthToken, removeAuthToken } from '../utils/localStorageUtils'
import { store } from '../redux/store'
import { getCurrentUser, logoutUser } from '../features/auth/authThunks'

export const publicLoader = async () => {
  const token = getAuthToken()
  const { isAuthenticated, isAdmin } = store.getState().auth

  if (token && !isAuthenticated) {
    try {
      await store.dispatch(getCurrentUser(false)).unwrap()
      return redirect(isAdmin ? '/admin/dashboard' : '/')
    } catch (error) {
      store.dispatch(logoutUser())
      removeAuthToken()
    }
  }

  if (isAuthenticated) {
    return redirect(isAdmin ? '/admin/dashboard' : '/')
  }

  return null
}

export const protectedLoader = async () => {
  const token = getAuthToken()
  const { isAuthenticated, isAdmin } = store.getState().auth

  if (!token) {
    return redirect('/login')
  }

  if (!isAuthenticated) {
    try {
      await store.dispatch(getCurrentUser(false)).unwrap()
    } catch (error) {
      store.dispatch(logoutUser())
      removeAuthToken()
      return redirect('/login')
    }
  }

  return null
}

export const adminLoader = async () => {
  const token = getAuthToken()
  const { isAuthenticated, isAdmin } = store.getState().auth

  if (!token) {
    return redirect('/admin/login')
  }

  if (!isAuthenticated || !isAdmin) {
    try {
      await store.dispatch(getCurrentUser(true)).unwrap()
      if (!store.getState().auth.isAdmin) {
        return redirect('/login')
      }
    } catch (error) {
      store.dispatch(logoutUser())
      removeAuthToken()
      return redirect('/admin/login')
    }
  }

  return null
}
