import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import PageHeader from '../../components/common/PageHeader'
import { mockNotifications } from '../../utils/mockData'

export default function Notifications() {
  return (
    <div className="space-y-6">
      <PageHeader title="Notifications" subtitle="Updates on matches, assessments and streaks." />
      <div className="space-y-3">
        {mockNotifications.map((n) => (
          <Card key={n.id} className={`flex items-center gap-4 ${n.unread ? 'border-primary/20 bg-primary/[0.03]' : ''}`}>
            <div className={`h-2 w-2 rounded-full ${n.unread ? 'bg-primary' : 'bg-border'}`} />
            <div className="flex-1">
              <p className="text-sm font-medium text-charcoal">{n.title}</p>
              <p className="text-xs text-muted">{n.time}</p>
            </div>
            {n.unread && <Badge variant="default">New</Badge>}
          </Card>
        ))}
      </div>
    </div>
  )
}
