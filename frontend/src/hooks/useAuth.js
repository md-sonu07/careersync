import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentUser, selectIsAuthenticated, selectAuthLoading, logoutUser, logout as logoutSync } from '../features/auth/authSlice'

export const useAuth = () => {
  const dispatch = useDispatch()
  const user = useSelector(selectCurrentUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const isLoading = useSelector(selectAuthLoading)

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap()
    } catch {
      dispatch(logoutSync())
    }
  }

  return { user, isAuthenticated, isLoading, logout: handleLogout }
}

export default useAuth
