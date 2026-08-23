import { useRouteError, Link } from 'react-router-dom'
import Button from './Button'

export default function ErrorBoundary() {
  const error = useRouteError()
  console.error(error)

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-danger/10 text-danger grid place-items-center mb-6">
        <span className="material-symbols-outlined text-[32px]">error</span>
      </div>
      <h1 className="text-3xl font-bold text-charcoal tracking-tight">Oops! Something went wrong.</h1>
      <p className="mt-3 text-muted max-w-md mx-auto leading-relaxed">
        We encountered an unexpected error while loading this page. Our team has been notified.
      </p>
      
      {error && (
        <div className="mt-6 w-full max-w-lg p-4 bg-surface border border-danger/20 rounded-xl overflow-hidden text-left">
          <p className="text-sm font-semibold text-danger mb-2">Error Details:</p>
          <pre className="text-xs text-muted overflow-x-auto">
            {error.statusText || error.message || 'Unknown Error'}
          </pre>
        </div>
      )}

      <div className="mt-8 flex gap-4">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Try Again
        </Button>
        <Link to="/">
          <Button variant="primary">
            Go back home
          </Button>
        </Link>
      </div>
    </div>
  )
}
