import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import PageHeader from '../../components/common/PageHeader'
import AppIcon from '../../components/ui/AppIcon';

const LessonPlayer = () => {
  return (
    <div className="space-y-6">
      <PageHeader title="06 — Hooks" subtitle="React & Modern Frontend • Lesson 6 of 8" />
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-0 overflow-hidden">
            <div className="aspect-video bg-charcoal flex items-center justify-center text-white">
              <AppIcon name="play_circle" className="text-5xl" />
            </div>
            <div className="p-6 space-y-4">
              <h3 className="font-bold">Understanding useState & useEffect</h3>
              <p className="text-sm text-muted">
                Learn how hooks simplify state and lifecycle in functional components. Includes live coding and exercises.
              </p>
              <div className="flex gap-3">
                <Button>Mark Complete</Button>
                <Button variant="secondary">Ask AI about this lesson</Button>
                <Button variant="outline">Next lesson →</Button>
              </div>
              <div className="pt-4 border-t border-border flex gap-6 text-sm">
                <button className="font-medium text-primary">Notes</button>
                <button className="text-muted">Resources</button>
                <button className="text-muted">Discussion</button>
              </div>
            </div>
          </Card>
        </div>
        <Card>
          <h4 className="font-bold mb-3">Course modules</h4>
          <div className="space-y-2 text-sm">
            {[
              '01 Introduction',
              '02 React Fundamentals',
              '03 Components',
              '04 Props',
              '05 State',
              '06 Hooks ✓',
              '07 API Integration',
              '08 Final Project',
            ].map((m) => (
              <div key={m} className="flex items-center justify-between p-2 rounded-lg hover:bg-background">
                <span className={m.includes('✓') ? 'font-semibold text-success' : ''}>{m}</span>
                <AppIcon name="chevron_right" className="text-[18px] text-muted" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default LessonPlayer
