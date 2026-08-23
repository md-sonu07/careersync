import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser, selectAuthLoading } from '../../features/auth/authSlice'
import { useNavigate, Link } from 'react-router-dom'
import Button from '../../components/ui/Button'

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isLoading = useSelector(selectAuthLoading)
  const [form, setForm] = useState({ email: '', password: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await dispatch(loginUser(form))
    if (loginUser.fulfilled.match(result)) {
      navigate('/dashboard')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 border rounded-xl p-8 space-y-6">
      <h2 className="text-2xl font-bold">Welcome back</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded-md px-3 py-2"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded-md px-3 py-2"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
      <p className="text-sm text-center text-zinc-600">
        No account?{' '}
        <Link to="/register" className="underline">
          Sign up
        </Link>
      </p>
    </div>
  )
}

export default Login
