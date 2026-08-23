import { createBrowserRouter, Navigate } from 'react-router-dom'
import ErrorBoundary from '../components/ui/ErrorBoundary'
import AdminLogin from '../pages/Admin/AdminLogin'

import { publicRoutes } from './publicRoutes'
import { studentRoutes } from './studentRoutes'
import { industryRoutes } from './industryRoutes'
import { academiaRoutes } from './academiaRoutes'
import { adminRoutes } from './adminRoutes'

const router = createBrowserRouter([
  publicRoutes,
  { path: '/admin/login', element: <AdminLogin />, errorElement: <ErrorBoundary /> },
  studentRoutes,
  industryRoutes,
  academiaRoutes,
  adminRoutes,
  { path: '/dashboard', element: <Navigate to="/student/dashboard" replace /> },
])

export default router
