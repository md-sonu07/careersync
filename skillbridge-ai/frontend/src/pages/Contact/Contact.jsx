import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import PageHeader from '../../components/common/PageHeader'
import EmptyState from '../../components/ui/EmptyState'

const View = () => {
  return (
    <div className="space-y-6">
      <PageHeader title="Contact" subtitle="Get in touch with CareerSync." actions={<Button>Primary Action</Button>} />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <h3 className="font-bold text-charcoal">Get in Touch</h3>
          <p className="mt-1 text-sm text-muted">We&apos;re here to help.</p>
          <div className="mt-6 flex flex-col gap-4">
            <div>
              <h4 className="text-sm font-semibold text-charcoal">Support</h4>
              <p className="text-sm text-muted">Get in touch with CareerSync.</p>
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
