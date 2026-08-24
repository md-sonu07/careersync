import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import PageHeader from '../../components/common/PageHeader'
import { opportunityApi } from '../../api/opportunity.api'

const InternshipDetail = () => {
  const { id } = useParams()
  const [opportunity, setOpportunity] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    if (id) {
      opportunityApi.getOpportunityDetail(id)
        .then((data) => {
          if (isMounted) setOpportunity(data)
        })
        .catch(() => {})
        .finally(() => {
          if (isMounted) setLoading(false)
        })
    } else {
      setLoading(false)
    }
    return () => { isMounted = false }
  }, [id])

  const oppTitle = opportunity?.title || 'Frontend Engineering Intern'
  const companyName = opportunity?.company?.company_name || 'Flipkart'
  const location = opportunity?.location || 'Remote'
  const stipend = opportunity?.stipend_salary || '₹25,000 / month'

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${oppTitle} — ${companyName}`}
        subtitle={`Opportunity • ${location} • ${opportunity?.duration || '6 Months'} • ${stipend}`}
        actions={
          <div className="flex gap-3">
            <Link to="/student/internships">
              <Button variant="outline">Back to Internships</Button>
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
                <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-xl">
                  {companyName[0]}
                </div>
                <div>
                  <h3 className="font-bold text-charcoal">{companyName}</h3>
                  <p className="text-sm text-muted">
                    Verified Hiring Partner • {opportunity?.company?.industry_type || 'Technology'} • {opportunity?.company?.company_size || '200-500'} employees
                  </p>
                  <Badge variant="success" icon="verified" className="mt-1">
                    Verified Partner
                  </Badge>
                </div>
              </div>
              <Badge variant="success" icon="bolt">
                {opportunity?.opportunity_type?.toUpperCase() || 'INTERNSHIP'}
              </Badge>
            </div>

            <h4 className="font-semibold mt-6 mb-2">Description</h4>
            <p className="text-sm text-charcoal/70 leading-relaxed">
              {opportunity?.description || 'Join our core engineering team to work on high-impact products.'}
            </p>

            <h4 className="font-semibold mt-6 mb-2">Required Skill Benchmarks</h4>
            <div className="flex flex-wrap gap-2">
              {opportunity?.skill_requirements && opportunity.skill_requirements.length > 0 ? (
                opportunity.skill_requirements.map((req) => (
                  <Badge key={req.id} variant="default">
                    {req.skill?.name} (Min {req.minimum_score}%)
                  </Badge>
                ))
              ) : (
                ['React.js', 'Python'].map((s) => <Badge key={s}>{s}</Badge>)
              )}
            </div>
          </Card>

          <Card>
            <h4 className="font-bold mb-3">Target Skill Match</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Work Mode:</span>
                <span className="text-primary font-bold uppercase">{opportunity?.work_mode || 'Remote'}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="text-success font-medium uppercase">{opportunity?.status || 'Published'}</span>
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
                <span className="font-medium">{opportunity?.duration || '6 Months'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Location</span>
                <span className="font-medium">{location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Stipend / Salary</span>
                <span className="font-medium">{stipend}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Deadline</span>
                <span className="font-medium text-danger">{opportunity?.deadline || 'Rolling Admissions'}</span>
              </div>
            </div>
            <Button className="w-full mt-6">Apply Now</Button>
            <p className="text-xs text-center text-muted mt-2">Direct 1-click application</p>
          </Card>

          <Card className="bg-sage border-sage">
            <p className="text-sm font-medium text-primary">AI Recommendation Insight</p>
            <p className="text-sm text-charcoal/70 mt-1">
              Your profile is automatically evaluated against this posting's skill benchmarks by CareerSync.
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default InternshipDetail
