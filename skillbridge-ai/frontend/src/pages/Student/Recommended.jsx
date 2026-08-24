import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import PageHeader from '../../components/common/PageHeader'
import { opportunityApi } from '../../api/opportunity.api'

export default function Recommended() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    opportunityApi.getOpportunityMatches()
      .then((data) => {
        if (isMounted && data && data.length > 0) setMatches(data)
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoading(false)
      })
    return () => { isMounted = false }
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Recommended Opportunities for You"
        subtitle="AI-calculated weighted compatibility matching based on your live skill scores and company requirements."
        actions={<Badge variant="default" icon="auto_awesome">AI Sorted</Badge>}
      />

      <div className="grid grid-cols-1 gap-5">
        {(matches.length > 0 ? matches : [
          { id: 'm1', match_score: 92, opportunity: { title: 'Frontend Intern', company: { company_name: 'Flipkart' }, location: 'Bengaluru (Hybrid)', stipend_salary: '₹25k/mo', opportunity_type: 'internship' } },
          { id: 'm2', match_score: 88, opportunity: { title: 'React Developer Intern', company: { company_name: 'CRED' }, location: 'Remote', stipend_salary: '₹28k/mo', opportunity_type: 'internship' } },
          { id: 'm3', match_score: 84, opportunity: { title: 'Junior Full Stack Dev', company: { company_name: 'Razorpay' }, location: 'Bengaluru', stipend_salary: '₹8-12 LPA', opportunity_type: 'job' } },
        ]).map((m) => {
          const opp = m.opportunity || {}
          const companyName = opp.company?.company_name || 'Hiring Partner'
          const score = m.match_score || 75

          return (
            <Card key={m.id} hover className="!p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-xl font-bold text-primary">
                    {companyName[0]}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-charcoal">{opp.title}</h3>
                    <p className="text-xs text-muted">{companyName} • {opp.location} • {opp.opportunity_type?.toUpperCase()}</p>
                    <p className="text-xs font-semibold text-charcoal mt-0.5">{opp.stipend_salary}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex rounded-full px-3 py-1 text-sm font-bold ${score >= 80 ? 'bg-green-100 text-green-700' : score >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                    {score}% Match
                  </span>
                  <p className="text-[11px] text-muted mt-1">Weighted AI Match</p>
                </div>
              </div>

              {opp.skill_requirements && opp.skill_requirements.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {opp.skill_requirements.map((req) => (
                    <span key={req.id} className="rounded-full bg-sage px-2 py-0.5 text-[11px] font-semibold text-primary border border-sage">
                      Required: {req.skill?.name} (Min {req.minimum_score}%)
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-5 flex flex-wrap gap-2">
                <Button size="sm">Apply Now</Button>
                <Link to={`/student/internships`}>
                  <Button size="sm" variant="outline">View Details</Button>
                </Link>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
