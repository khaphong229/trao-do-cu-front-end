import { createBrowserRouter } from 'react-router-dom'
import RouterWithLoading from 'components/common/Loading/RouterWithLoading'
import Admin from '../layouts/Admin'
import DashboardUI from '../pages/Admin/Dashboard/Dashboard'
import UserManagement from '../pages/Admin/User/User'
import Login from '../pages/Auth/Login'
import Register from '../pages/Auth/Register'
import Home from '../pages/Client/Home'
import LayoutClient from '../layouts/Client/HomePage'
import { ProtectedRoute } from './protectedRoute'
import PostDetail from '../pages/Client/Post/PostDetail'
import PostCategory from '../pages/Client/Post/PostCategory'
import PostManagement from '../pages/Admin/Post'
import PostManagementClient from 'pages/Client/PostManagement'
import PostArticle from '../pages/Client/Post/PostArticle'
import ProfileUser from 'pages/Client/Profile/ProfileUser'

import ErrorBoundary from 'components/common/ErrorBoundary'
import NotFound from '../components/common/NotFound'
import LoginGoogle from 'pages/Auth/LoginGoogle'

const router = createBrowserRouter([
  {
    element: (
      <ErrorBoundary>
        <RouterWithLoading />
      </ErrorBoundary>
    ),
    errorElement: <NotFound />,
    children: [
      // Public routes (wrapped with ProtectedRoute)
      {
        element: <ProtectedRoute requireAuth={false} adminOnly={false} />,
        children: [
          {
            path: '',
            element: <LayoutClient />,
            children: [
              {
                path: 'not-found',
                element: <NotFound />
              },
              {
                index: true,
                element: <Home />
              },
              {
                path: 'login',
                element: <Login />
              },
              {
                path: 'register',
                element: <Register />
              },
              {
                path: 'post/:id/detail',
                element: <PostDetail />
              },
              {
                path: 'post/category/:category_id',
                element: <PostCategory />
              },
              {
                path: 'post-article',
                element: <PostArticle />
              },
              {
                element: <ProtectedRoute requireAuth={true} adminOnly={false} />,
                children: [
                  {
                    path: 'management-post',
                    element: <PostManagementClient />
                  },
                  { path: 'profile', element: <ProfileUser /> }
                ]
              }
            ]
          },
          {
            path: 'login-success/:id',
            element: <LoginGoogle />
          }
        ]
      },

      // Admin routes
      {
        path: 'admin',
        children: [
          // Admin login route
          {
            element: <ProtectedRoute requireAuth={false} adminOnly={true} />,
            children: [
              {
                path: 'login',
                element: <Login />
              }
            ]
          },

          // Protected admin routes
          {
            element: <ProtectedRoute requireAuth={true} adminOnly={true} />,
            children: [
              {
                element: <Admin />,
                children: [
                  {
                    path: 'dashboard',
                    element: <DashboardUI />
                  },
                  {
                    path: 'user',
                    element: <UserManagement />
                  },
                  {
                    path: 'post',
                    element: <PostManagement />
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
])

export default router
