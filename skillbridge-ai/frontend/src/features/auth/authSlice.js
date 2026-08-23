import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authApi } from '../../api/auth.api'

// Helper to extract clean error message from DRF error response
const formatError = (err) => {
  if (!err.response) return err.message || 'Network error occurred'
  const data = err.response.data
  if (typeof data === 'string') return data
  if (data?.detail) return data.detail
  if (data?.message) return data.message
  if (typeof data === 'object') {
    const firstKey = Object.keys(data)[0]
    if (firstKey) {
      const val = data[firstKey]
      return Array.isArray(val) ? `${firstKey}: ${val.join(' ')}` : `${firstKey}: ${val}`
    }
  }
  return err.message || 'An error occurred'
}

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await authApi.login(credentials)
      return data
    } catch (err) {
      return rejectWithValue(formatError(err))
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/register',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await authApi.register(payload)
      return data
    } catch (err) {
      return rejectWithValue(formatError(err))
    }
  }
)

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const data = await authApi.getMe()
      return data
    } catch (err) {
      return rejectWithValue(formatError(err))
    }
  }
)

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { getState }) => {
    try {
      const refreshToken = localStorage.getItem('refresh_token')
      if (refreshToken) {
        await authApi.logout(refreshToken)
      }
    } catch {
      // Ignore backend logout errors if token already invalidated
    }
  }
)

const getInitialState = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    const token = localStorage.getItem('token') || null
    return {
      user,
      token,
      isAuthenticated: !!token,
      isLoading: false,
      error: null,
    }
  } catch {
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    }
  }
}

const initialState = getInitialState()

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
      localStorage.removeItem('token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
      localStorage.removeItem('auth')
    },
    clearError: (state) => {
      state.error = null
    },
    setCredentials: (state, action) => {
      const { user, token, refresh } = action.payload
      state.user = user
      state.token = token
      state.isAuthenticated = true
      if (token) localStorage.setItem('token', token)
      if (refresh) localStorage.setItem('refresh_token', refresh)
      if (user) {
        localStorage.setItem('user', JSON.stringify(user))
        const normalizedRole = (user.role || 'student').toLowerCase()
        localStorage.setItem('auth', JSON.stringify({ user, role: normalizedRole, token }))
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        const user = action.payload.user
        const token = action.payload.access || action.payload.tokens?.access || action.payload.token
        const refresh = action.payload.refresh || action.payload.tokens?.refresh
        state.user = user
        state.token = token
        state.isAuthenticated = true
        if (token) localStorage.setItem('token', token)
        if (refresh) localStorage.setItem('refresh_token', refresh)
        if (user) {
          localStorage.setItem('user', JSON.stringify(user))
          const normalizedRole = (user.role || 'student').toLowerCase()
          localStorage.setItem('auth', JSON.stringify({ user, role: normalizedRole, token }))
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false
        const user = action.payload.user
        const token = action.payload.access || action.payload.tokens?.access || action.payload.token
        const refresh = action.payload.refresh || action.payload.tokens?.refresh
        state.user = user
        state.token = token
        state.isAuthenticated = true
        if (token) localStorage.setItem('token', token)
        if (refresh) localStorage.setItem('refresh_token', refresh)
        if (user) {
          localStorage.setItem('user', JSON.stringify(user))
          const normalizedRole = (user.role || 'student').toLowerCase()
          localStorage.setItem('auth', JSON.stringify({ user, role: normalizedRole, token }))
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // fetchCurrentUser
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload
        if (action.payload) {
          localStorage.setItem('user', JSON.stringify(action.payload))
        }
      })
      // logoutUser
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
        localStorage.removeItem('token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        localStorage.removeItem('auth')
      })
  },
})

export const { logout, clearError, setCredentials } = authSlice.actions
export default authSlice.reducer

// Selectors
export const selectCurrentUser = (state) => state.auth.user
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectAuthLoading = (state) => state.auth.isLoading
export const selectAuthError = (state) => state.auth.error
