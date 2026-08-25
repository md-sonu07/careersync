import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated, selectCurrentUser } from '../features/auth/authSlice'

const getRoleDashboard = (role) => {
  const normalizedRole = (role || '').toLowerCase()
  if (normalizedRole === 'student') return '/student/dashboard'
  if (normalizedRole === 'industry') return '/industry/dashboard'
  if (['academician', 'Institute'].includes(normalizedRole)) return '/Institute/dashboard'
  if (normalizedRole === 'admin') return '/admin/dashboard'
  return '/login'
}

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const user = useSelector(selectCurrentUser)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles.length > 0) {
    const userRole = (user?.role || '').toLowerCase()
    const isAllowed = allowedRoles.map((r) => r.toLowerCase()).includes(userRole)

    if (!isAllowed) {
      const redirectPath = getRoleDashboard(userRole)
      return <Navigate to={redirectPath} replace />
    }

    // Guard against unapproved institute / industry accounts
    if ((userRole === 'academician' || userRole === 'institute' || userRole === 'industry') && !user?.is_verified) {
      return <Navigate to="/login" replace />
    }
  }

  return <Outlet />
}

export default ProtectedRoute
