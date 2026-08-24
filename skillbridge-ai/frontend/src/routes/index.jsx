import { createBrowserRouter, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser, selectIsAuthenticated } from '../features/auth/authSlice'
import ErrorBoundary from '../components/ui/ErrorBoundary'
import AdminLogin from '../pages/Admin/AdminLogin'

import { publicRoutes } from './publicRoutes'
import { studentRoutes } from './studentRoutes'
import { industryRoutes } from './industryRoutes'
import { academiaRoutes } from './academiaRoutes'
import { adminRoutes } from './adminRoutes'

function DashboardRedirect() {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const user = useSelector(selectCurrentUser)

  if (!isAuthenticated) return <Navigate to="/login" replace />

  const role = (user?.role || '').toLowerCase()
  if (role === 'industry') return <Navigate to="/industry/dashboard" replace />
  if (['academician', 'academia'].includes(role)) return <Navigate to="/academia/dashboard" replace />
  if (role === 'admin') return <Navigate to="/admin/dashboard" replace />
  return <Navigate to="/student/dashboard" replace />
}

const router = createBrowserRouter([
  publicRoutes,
  { path: '/admin/login', element: <AdminLogin />, errorElement: <ErrorBoundary /> },
  studentRoutes,
  industryRoutes,
  academiaRoutes,
  adminRoutes,
  { path: '/dashboard', element: <DashboardRedirect /> },
])

export default router
