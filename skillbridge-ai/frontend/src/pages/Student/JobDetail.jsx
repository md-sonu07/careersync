import { useParams, Link } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import PageHeader from '../../components/common/PageHeader'

const JobDetail = () => {
  const { id } = useParams()
  return (
    <div className="space-y-6">
      <PageHeader
        title="Frontend Engineer — FinTech Express"
        subtitle={`Job #${id || '01'} • Hybrid • ₹6-10 LPA • 0-1 yrs`}
        actions={
          <div className="flex gap-3">
            <Link to="/student/jobs">
              <Button variant="outline">Back</Button>
            </Link>
            <Button>Apply Now</Button>
          </div>
        }
      />
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h4 className="font-bold mb-2">About role</h4>
            <p className="text-sm text-charcoal/70 leading-relaxed">
              Own UI for our payments dashboard. Work with designers and backend engineers to ship polished features weekly.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge>React</Badge>
              <Badge>TypeScript</Badge>
              <Badge>Tailwind</Badge>
            </div>
          </Card>
          <Card>
            <h4 className="font-bold mb-2">Match — 88%</h4>
            <p className="text-sm text-muted">
              Matched: React, JavaScript, Git • Gap: TypeScript, Testing
            </p>
            <Button size="sm" className="mt-3">
              View Roadmap to close gap
            </Button>
          </Card>
        </div>
        <Card>
          <h4 className="font-bold mb-3">Details</h4>
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-muted">Salary</span>
              <span className="font-medium">₹6-10 LPA</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Experience</span>
              <span className="font-medium">0-1 years</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Posted</span>
              <span className="font-medium">2 days ago</span>
            </div>
          </div>
          <Button className="w-full mt-6">Apply Now</Button>
        </Card>
      </div>
    </div>
  )
}

export default JobDetail
