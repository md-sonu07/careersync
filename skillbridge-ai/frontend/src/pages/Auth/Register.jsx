import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser, selectAuthLoading } from '../../features/auth/authSlice'
import { useNavigate, Link } from 'react-router-dom'
import Button from '../../components/ui/Button'

const Register = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isLoading = useSelector(selectAuthLoading)
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await dispatch(registerUser(form))
    if (registerUser.fulfilled.match(result)) {
      navigate('/dashboard')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 border rounded-xl p-8 space-y-6">
      <h2 className="text-2xl font-bold">Create account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Full name"
          className="w-full border rounded-md px-3 py-2"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
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
          {isLoading ? 'Creating...' : 'Create Account'}
        </Button>
      </form>
      <p className="text-sm text-center text-zinc-600">
        Already have an account?{' '}
        <Link to="/login" className="underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}

export default Register
