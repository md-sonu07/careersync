import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentUser, selectIsAuthenticated, selectAuthLoading, logout } from '../features/auth/authSlice'

export const useAuth = () => {
  const dispatch = useDispatch()
  const user = useSelector(selectCurrentUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const isLoading = useSelector(selectAuthLoading)

  const handleLogout = () => dispatch(logout())

  return { user, isAuthenticated, isLoading, logout: handleLogout }
}

export default useAuth
