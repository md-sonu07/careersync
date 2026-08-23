import { createBrowserRouter } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import Home from '../pages/Home/Home'
import Login from '../pages/Auth/Login'
import Register from '../pages/Auth/Register'
import ProtectedRoute from './ProtectedRoute'

// Lazy placeholder for dashboard
const Dashboard = () => (
  <div className="p-8 text-center">
    <h2 className="text-2xl font-bold">Dashboard</h2>
    <p className="text-zinc-600">Protected content - you are authenticated!</p>
  </div>
)

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      {
        element: <ProtectedRoute />,
        children: [{ path: 'dashboard', element: <Dashboard /> }],
      },
      { path: '*', element: <div className="text-center py-20">404 - Not Found</div> },
    ],
  },
])

export default router
