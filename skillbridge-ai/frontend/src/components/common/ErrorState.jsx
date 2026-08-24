import Button from '../ui/Button'
import AppIcon from '../ui/AppIcon';

const ErrorState = ({ title = 'Something went wrong', description = "We couldn't load this data.", onRetry, onBack }) => {
  return (
    <div className="rounded-2xl border border-danger/20 bg-danger/5 p-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-danger/10 text-danger">
        <AppIcon name="error" />
      </div>
      <h3 className="mt-4 font-bold text-charcoal">{title}</h3>
      <p className="mt-1 text-sm text-muted">{description}</p>
      <div className="mt-6 flex justify-center gap-3">
        {onRetry && (
          <Button size="sm" onClick={onRetry}>
            Try Again
          </Button>
        )}
        {onBack && (
          <Button size="sm" variant="outline" onClick={onBack}>
            Go Back
          </Button>
        )}
      </div>
    </div>
  )
}

export default ErrorState
