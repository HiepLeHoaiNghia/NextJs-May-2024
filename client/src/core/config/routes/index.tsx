import { Navigate, Outlet, useLocation, useRoutes } from 'react-router-dom'
import { useRecoilValue } from 'recoil'

import { AuthLayout, MainLayout } from '~/core/config/layouts'
import isLoggedIn from '~/core/config/recoil/loggedIn'
import { PATH } from '~/core/constants'
import {
  AdminDashboard,
  AdminRequest,
  AdminUserManagement,
  AttendancesHistory,
  ForgotPassword,
  Login,
  NotFound,
  Profile,
  ResetPassword,
  TimeEntries,
  UserDashboard,
} from '~/pages'

function ProtectedRoute() {
  const location = useLocation()
  const isAuthenticated = useRecoilValue(isLoggedIn)
  return isAuthenticated ? <Outlet /> : <Navigate to={PATH.AUTH.LOGIN} state={{ from: location }} replace />
}

const useRouteElement = () => {
  return useRoutes([
    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        {
          path: '',
          element: <MainLayout />,
          children: [
            {
              path: PATH.USER.DASHBOARD,
              element: <UserDashboard />,
            },
            {
              path: PATH.USER.PROFILE,
              element: <Profile />,
            },
            {
              path: PATH.USER.TIME_ENTRIES,
              element: <TimeEntries />,
            },
            {
              path: PATH.USER.ATTENDANCES_HISTORY,
              element: <AttendancesHistory />,
            },
          ],
        },
        {
          path: 'admin',
          element: <MainLayout />,
          children: [
            {
              path: PATH.ADMIN.USERS,
              element: <AdminUserManagement />,
            },
            {
              path: PATH.ADMIN.DASHBOARD,
              element: <AdminDashboard />,
            },
            {
              path: PATH.ADMIN.REQUESTS,
              element: <AdminRequest />,
            },
          ],
        },
      ],
    },
    {
      path: 'auth',
      element: <AuthLayout />,
      children: [
        {
          path: PATH.AUTH.RESET_PASSWORD,
          element: <ResetPassword />,
        },
        {
          path: PATH.AUTH.LOGIN,
          element: <Login />,
        },
        {
          path: PATH.AUTH.FORGOT_PASSWORD,
          element: <ForgotPassword />,
        },
      ],
    },

    {
      path: PATH.COMMON.NOTIFICATION,
      element: <NotFound />,
    },
  ])
}

export default useRouteElement
