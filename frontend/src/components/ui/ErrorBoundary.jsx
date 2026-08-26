import { useRouteError } from 'react-router-dom'
import { toast } from 'react-hot-toast'

export default function ErrorBoundary() {
  const error = useRouteError()

  toast.error(error.message || 'Something went wrong. Please try again.')

  console.error(error)

  return null
}
