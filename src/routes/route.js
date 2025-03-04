import { createBrowserRouter } from 'react-router-dom'
import AdminLayout from 'layouts/Admin'
import ClientLayout from 'layouts/Client/HomePage'
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
const UserSurvey = lazy(() => import('pages/Client/UserSurvey/UserSurvey'))

const router = createBrowserRouter([
  {
    element: (
      <ErrorBoundary>
        <ProtectedRoute requireAuth={false} adminOnly={false} />
      </ErrorBoundary>
    ),
    errorElement: (
      <Suspense>
        <ClientLayout>
          <NotFound />
        </ClientLayout>
      </Suspense>
    ),
    children: [
      {
        path: '/',
        children: [
          {
            index: true,
            element: (
              <Suspense>
                <ClientLayout>
                  <Home />
                </ClientLayout>
              </Suspense>
            )
          },
          {
            path: 'login',
            element: (
              <Suspense>
                <ClientLayout>
                  <Login />
                </ClientLayout>
              </Suspense>
            )
          },
          {
            path: 'register',
            element: (
              <Suspense>
                <ClientLayout>
                  <Register />
                </ClientLayout>
              </Suspense>
            )
          },
          {
            path: 'post/:id/detail',
            element: (
              <Suspense>
                <ClientLayout>
                  <PostDetail />
                </ClientLayout>
              </Suspense>
            )
          },
          {
            path: 'post/category/:category_id',
            element: (
              <Suspense>
                <ClientLayout>
                  <PostCategory />
                </ClientLayout>
              </Suspense>
            )
          },
          {
            path: 'post-article',
            element: (
              <Suspense>
                <ClientLayout>
                  <PostArticle />
                </ClientLayout>
              </Suspense>
            )
          },
          {
            path: 'survey',
            element: (
              <Suspense>
                <ClientLayout>
                  <UserSurvey />
                </ClientLayout>
              </Suspense>
            )
          },
          // Protected Client Routes
          {
            element: <ProtectedRoute requireAuth={true} adminOnly={false} />,
            children: [
              {
                path: 'management-post',
                element: (
                  <Suspense>
                    <ClientLayout>
                      <PostManagementClient />
                    </ClientLayout>
                  </Suspense>
                )
              },
              {
                path: 'profile',
                element: (
                  <Suspense>
                    <ClientLayout>
                      <ProfileUser />
                    </ClientLayout>
                  </Suspense>
                )
              }
            ]
          }
        ]
      },

      // Special Routes
      {
        path: 'login-success/:id',
        element: (
          <Suspense>
            <LoginGoogle />
          </Suspense>
        )
      },
      {
        path: 'not-found',
        element: (
          <Suspense>
            <NotFound />
          </Suspense>
        )
      },

      // Admin Routes
      {
        path: 'admin',
        children: [
          // Admin Login
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
          // Protected Admin Routes
          {
            element: <ProtectedRoute requireAuth={true} adminOnly={true} />,
            children: [
              {
                path: 'dashboard',
                element: (
                  <Suspense>
                    <AdminLayout>
                      <DashboardUI />
                    </AdminLayout>
                  </Suspense>
                )
              },
              {
                path: 'user',
                element: (
                  <Suspense>
                    <AdminLayout>
                      <UserManagement />
                    </AdminLayout>
                  </Suspense>
                )
              },
              {
                path: 'post',
                element: (
                  <Suspense>
                    <AdminLayout>
                      <PostManagement />
                    </AdminLayout>
                  </Suspense>
                )
              }
            ]
          }
        ]
      }
    ]
  }
])

export default router
