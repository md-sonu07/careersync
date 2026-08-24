import { Link } from 'react-router-dom'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import Card from '../ui/Card'
import AppIcon from '../ui/AppIcon';

const jobs = [
  { logo: 'TC', logoBg: 'bg-gray-100', logoColor: 'text-gray-400', match: '95% Match', title: 'Junior Software Engineer', company: 'TechCorp Inc.', location: 'Remote', type: 'Full-time' },
  { logo: 'DA', logoBg: 'bg-blue-100', logoColor: 'text-blue-600', match: '88% Match', title: 'Data Analytics Intern', company: 'DataWorks Solutions', location: 'New York, NY', type: 'Internship' },
  { logo: 'FX', logoBg: 'bg-purple-100', logoColor: 'text-purple-600', match: '82% Match', title: 'Frontend Developer', company: 'FinTech Express', location: 'Hybrid', type: 'Full-time' },
]

const Jobs = () => {
  return (
    <section id="jobs" className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-6 @3xl:px-8">
        <div className="flex flex-wrap justify-between items-end gap-4 mb-10 @3xl:mb-12">
          <div className="max-w-2xl w-full @3xl:w-auto">
            <h2 className="text-3xl @3xl:text-4xl font-bold text-charcoal mb-3 @3xl:mb-4">Featured Opportunities</h2>
            <p className="text-base @3xl:text-lg text-charcoal/70">Top internships and entry-level roles tailored for you.</p>
          </div>
          <Link to="/jobs">
            <Button variant="secondary" className="hidden @3xl:flex">
              View All Jobs
            </Button>
          </Link>
        </div>

        <div className="grid @3xl:grid-cols-2 @5xl:grid-cols-3 gap-6">
          {jobs.map((j) => (
            <Link key={j.title} to="/jobs" className="block">
              <Card hover className="flex flex-col gap-4 h-full">
                <div className="flex justify-between items-start">
                  <div className={`w-12 h-12 ${j.logoBg} rounded-lg flex items-center justify-center font-bold ${j.logoColor}`}>
                    {j.logo}
                  </div>
                  <Badge variant="success" icon="bolt">
                    {j.match}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-charcoal">{j.title}</h3>
                  <p className="text-sm text-charcoal/60">{j.company}</p>
                </div>
                <div className="flex flex-wrap gap-4 mt-auto pt-4 border-t border-border-light">
                  <span className="text-xs font-medium text-charcoal/70 flex items-center gap-1">
                    <AppIcon name="location_on" className="text-[16px]" /> {j.location}
                  </span>
                  <span className="text-xs font-medium text-charcoal/70 flex items-center gap-1">
                    <AppIcon name="work" className="text-[16px]" /> {j.type}
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center @3xl:hidden">
          <Link to="/jobs">
            <Button variant="secondary" className="w-full">
              View All Jobs
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Jobs
