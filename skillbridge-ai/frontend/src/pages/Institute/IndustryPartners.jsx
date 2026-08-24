import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import PageHeader from '../../components/common/PageHeader'
import EmptyState from '../../components/ui/EmptyState'

const View = () => {
  return (
    <div className="space-y-6">
      <PageHeader title="Industry Partners" subtitle="Industry partners and collaborations." actions={<Button>Primary Action</Button>} />
      <div className="grid gap-6">
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-sage flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">verified</span>
            </div>
            <div>
              <h3 className="font-bold text-charcoal">Industry Partners</h3>
              <p className="text-sm text-muted">Industry partners and collaborations.</p>
            </div>
            <Badge className="ml-auto" variant="success">Live</Badge>
          </div>
          <div className="rounded-xl border border-dashed border-border bg-background p-8 text-center">
            <p className="text-sm text-muted">This section follows the same design system. Real data will appear here once connected to the Django API.</p>
            <div className="mt-4 flex justify-center gap-3">
              <Button size="sm">Refresh</Button>
              <Button size="sm" variant="secondary">Learn more</Button>
            </div>
          </div>
        </Card>
        <EmptyState icon="construction" title="Production-ready placeholder" description="Replace with live charts, tables and filters when API is connected. Uses centralized theme tokens." actionLabel="Explore" onAction={() => {}} />
      </div>
    </div>
  )
}

export default View
