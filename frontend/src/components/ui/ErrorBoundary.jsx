import { useRouteError } from 'react-router-dom'
import { toast } from 'react-hot-toast'

export default function ErrorBoundary() {
  const error = useRouteError()

  toast({
    title: 'Error',
    description: error.message || 'Something went wrong. Please try again.',
    variant: 'destructive',
  })

  console.error(error)

  return null
}
