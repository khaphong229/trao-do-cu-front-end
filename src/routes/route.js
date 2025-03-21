import { createBrowserRouter } from 'react-router-dom'
import AdminLayout from 'layouts/Admin'
import ClientLayout from 'layouts/Client/HomePage'
import { ProtectedRoute } from './protectedRoute'
import { lazy, Suspense } from 'react'

const DashboardUI = lazy(() => import('pages/Admin/Dashboard/Dashboard'))
const Login = lazy(() => import('pages/Auth/Login'))
const Register = lazy(() => import('pages/Auth/Register'))
const Home = lazy(() => import('pages/Client/Home'))
const PostDetail = lazy(() => import('pages/Client/Post/PostDetail'))
const PostCategory = lazy(() => import('pages/Client/Post/PostCategory'))
const PostManagementClient = lazy(() => import('pages/Client/PostManagement'))
const PostArticle = lazy(() => import('pages/Client/Post/PostArticle'))
const ProfileUser = lazy(() => import('pages/Client/Profile/ProfileUser'))
const ErrorBoundary = lazy(() => import('components/common/ErrorBoundary'))
const NotFound = lazy(() => import('components/common/NotFound'))
const LoginGoogle = lazy(() => import('pages/Auth/LoginGoogle'))
const UserSurvey = lazy(() => import('pages/Client/UserSurvey/UserSurvey'))
const ForgotPassword = lazy(() => import('pages/Auth/ForgotPassword'))
const ResetPassword = lazy(() => import('pages/Auth/ResetPassword'))
const UserManager = lazy(() => import('pages/Admin/UserManager'))
const PostManager = lazy(() => import('pages/Admin/Post'))
const router = createBrowserRouter([
  {
    element: (
      <ErrorBoundary>
        <Suspense>
          <ProtectedRoute requireAuth={false} adminOnly={false} />
        </Suspense>
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
            path: 'forgot-password',
            element: (
              <Suspense>
                <ClientLayout>
                  <ForgotPassword />
                </ClientLayout>
              </Suspense>
            )
          },
          {
            path: 'reset-password',
            element: (
              <Suspense>
                <ClientLayout>
                  <ResetPassword />
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
            <ClientLayout>
              <NotFound />
            </ClientLayout>
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
            element: <ProtectedRoute requireAuth={true} adminOnly={true} />, // Ensure adminOnly is true here
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
                      <UserManager />
                    </AdminLayout>
                  </Suspense>
                )
              },
              {
                path: 'post',
                element: (
                  <Suspense>
                    <AdminLayout>
                      <PostManager />
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
