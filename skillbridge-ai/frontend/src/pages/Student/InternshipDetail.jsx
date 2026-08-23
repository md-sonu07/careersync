import { useParams, Link } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import PageHeader from '../../components/common/PageHeader'

const InternshipDetail = () => {
  const { id } = useParams()
  return (
    <div className="space-y-6">
      <PageHeader
        title="Full Stack Developer Intern — TechNova"
        subtitle={`Internship #${id || '01'} • Remote • 3 Months • ₹10,000/month`}
        actions={
          <div className="flex gap-3">
            <Link to="/student/internships">
              <Button variant="outline">Back</Button>
            </Link>
            <Button>Apply Now</Button>
          </div>
        }
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex items-start justify-between mb-4">
              <div className="flex gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center text-white font-bold">TN</div>
                <div>
                  <h3 className="font-bold text-charcoal">TechNova</h3>
                  <p className="text-sm text-muted">Verified Industry • Technology • 200-500 employees</p>
                  <Badge variant="success" icon="verified" className="mt-1">
                    Verified
                  </Badge>
                </div>
              </div>
              <Badge variant="success" icon="bolt">
                91% Match
              </Badge>
            </div>
            <h4 className="font-semibold mt-6 mb-2">About company</h4>
            <p className="text-sm text-charcoal/70 leading-relaxed">
              TechNova builds scalable SaaS products for global clients. Join our engineering team to work on real products
              used by 10k+ businesses.
            </p>
            <h4 className="font-semibold mt-6 mb-2">Responsibilities</h4>
            <ul className="list-disc pl-5 text-sm text-charcoal/70 space-y-1">
              <li>Build responsive UI with React and Tailwind</li>
              <li>Develop REST APIs with Node.js & PostgreSQL</li>
              <li>Write tests and participate in code reviews</li>
            </ul>
            <h4 className="font-semibold mt-6 mb-2">Requirements</h4>
            <div className="flex flex-wrap gap-2">
              <Badge>React</Badge> <Badge>Node.js</Badge> <Badge>PostgreSQL</Badge> <Badge>Git</Badge>
            </div>
          </Card>

          <Card>
            <h4 className="font-bold mb-3">Your Match — 91%</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Matched:</span>
                <span className="text-success font-medium">React • Node.js • Git</span>
              </div>
              <div className="flex justify-between">
                <span>Gap:</span>
                <span className="text-warning font-medium">PostgreSQL</span>
              </div>
              <div className="pt-3 flex gap-3">
                <Button size="sm">Recommended course: SQL Fundamentals</Button>
                <Button variant="secondary" size="sm">
                  Practice MCQs
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h4 className="font-bold mb-3">Overview</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Duration</span>
                <span className="font-medium">3 Months</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Location</span>
                <span className="font-medium">Remote</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Stipend</span>
                <span className="font-medium">₹10,000 / month</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Openings</span>
                <span className="font-medium">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Deadline</span>
                <span className="font-medium text-danger">Mar 15, 2026</span>
              </div>
            </div>
            <Button className="w-full mt-6">Apply Now</Button>
            <p className="text-xs text-center text-muted mt-2">Application takes ~2 minutes</p>
          </Card>

          <Card className="bg-sage border-sage">
            <p className="text-sm font-medium text-primary">AI Insight</p>
            <p className="text-sm text-charcoal/70 mt-1">
              You are 91% match. Improving PostgreSQL would push you to 96% for this role and 12 similar internships.
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default InternshipDetail
