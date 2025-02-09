import { createBrowserRouter, Outlet } from 'react-router-dom'
import Admin from 'layouts/Admin'
import LayoutClient from 'layouts/Client/HomePage'
import { ProtectedRoute } from './protectedRoute'
import { lazy, Suspense } from 'react'

const DashboardUI = lazy(() => import('pages/Admin/Dashboard/Dashboard'))
const UserManagement = lazy(() => import('pages/Admin/User/User'))
const Login = lazy(() => import('pages/Auth/Login'))
const Register = lazy(() => import('pages/Auth/Register'))
const Home = lazy(() => import('pages/Client/Home'))
const PostDetail = lazy(() => import('pages/Client/Post/PostDetail'))
const PostCategory = lazy(() => import('pages/Client/Post/PostCategory'))
const PostManagement = lazy(() => import('pages/Admin/Post'))
const PostManagementClient = lazy(() => import('pages/Client/PostManagement'))
const PostArticle = lazy(() => import('pages/Client/Post/PostArticle'))
const ProfileUser = lazy(() => import('pages/Client/Profile/ProfileUser'))
const ErrorBoundary = lazy(() => import('components/common/ErrorBoundary'))
const NotFound = lazy(() => import('components/common/NotFound'))
const LoginGoogle = lazy(() => import('pages/Auth/LoginGoogle'))

const router = createBrowserRouter([
  {
    element: (
      <ErrorBoundary>
        {/* <RouterWithLoading /> */}
        <Outlet />
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
            element: (
              <Suspense>
                <LayoutClient />
              </Suspense>
            ),
            children: [
              {
                path: 'not-found',
                element: (
                  <Suspense>
                    <NotFound />
                  </Suspense>
                )
              },
              {
                index: true,
                element: (
                  <Suspense>
                    <Home />
                  </Suspense>
                )
              },
              {
                path: 'login',
                element: (
                  <Suspense>
                    <Login />
                  </Suspense>
                )
              },
              {
                path: 'register',
                element: (
                  <Suspense>
                    <Register />
                  </Suspense>
                )
              },
              {
                path: 'post/:id/detail',
                element: (
                  <Suspense>
                    <PostDetail />
                  </Suspense>
                )
              },
              {
                path: 'post/category/:category_id',
                element: (
                  <Suspense>
                    <PostCategory />
                  </Suspense>
                )
              },
              {
                path: 'post-article',
                element: (
                  <Suspense>
                    <PostArticle />
                  </Suspense>
                )
              },
              {
                element: <ProtectedRoute requireAuth={true} adminOnly={false} />,
                children: [
                  {
                    path: 'management-post',
                    element: (
                      <Suspense>
                        <PostManagementClient />
                      </Suspense>
                    )
                  },
                  {
                    path: 'profile',
                    element: (
                      <Suspense>
                        <ProfileUser />
                      </Suspense>
                    )
                  }
                ]
              }
            ]
          },
          {
            path: 'login-success/:id',
            element: (
              <Suspense>
                <LoginGoogle />
              </Suspense>
            )
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
                element: (
                  <Suspense>
                    <Login />
                  </Suspense>
                )
              }
            ]
          },

          // Protected admin routes
          {
            element: <ProtectedRoute requireAuth={true} adminOnly={true} />,
            children: [
              {
                element: (
                  <Suspense>
                    <Admin />
                  </Suspense>
                ),
                children: [
                  {
                    path: 'dashboard',
                    element: (
                      <Suspense>
                        <DashboardUI />
                      </Suspense>
                    )
                  },
                  {
                    path: 'user',
                    element: (
                      <Suspense>
                        <UserManagement />
                      </Suspense>
                    )
                  },
                  {
                    path: 'post',
                    element: (
                      <Suspense>
                        <PostManagement />
                      </Suspense>
                    )
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
