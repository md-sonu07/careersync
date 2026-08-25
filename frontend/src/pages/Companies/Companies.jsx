import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import PageHeader from '../../components/common/PageHeader'
import { opportunityApi } from '../../api/opportunity.api'

const Companies = () => {
  const [opportunities, setOpportunities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    opportunityApi.getOpportunities()
      .then((data) => {
        if (isMounted && data && data.length > 0) setOpportunities(data)
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
        title="Verified Companies & Hiring Partners"
        subtitle="Browse verified hiring companies actively posting internship and job opportunities on CareerSync."
        actions={<Badge variant="success">Verified Partners</Badge>}
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {(opportunities.length > 0 ? opportunities : [
          { id: '1', company: { company_name: 'Flipkart', industry_type: 'E-Commerce / Tech' }, title: 'Frontend Engineering Intern', location: 'Bengaluru (Hybrid)' },
          { id: '2', company: { company_name: 'CRED', industry_type: 'Fintech / SaaS' }, title: 'React Developer Intern', location: 'Remote' },
          { id: '3', company: { company_name: 'Razorpay', industry_type: 'Fintech / Payment' }, title: 'Junior Full Stack Developer', location: 'Bengaluru' },
          { id: '4', company: { company_name: 'Postman', industry_type: 'Developer Tools' }, title: 'DevOps & Cloud Intern', location: 'Remote' },
        ]).map((item) => {
          const name = item.company?.company_name || 'Company'
          return (
            <Card key={item.id} hover className="flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary text-xl">
                    {name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-charcoal">{name}</h3>
                    <p className="text-xs text-muted">{item.company?.industry_type || 'Technology'}</p>
                    <Badge variant="success" icon="verified" className="mt-1">
                      Verified
                    </Badge>
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-xl bg-background border border-border">
                  <p className="text-xs font-semibold text-muted uppercase">Active Posting</p>
                  <p className="text-sm font-bold text-charcoal mt-0.5">{item.title}</p>
                  <p className="text-xs text-muted mt-0.5">{item.location} • {item.stipend_salary || 'Competitive'}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border flex gap-2">
                <Link to={`/student/internships`} className="w-full">
                  <Button size="sm" variant="outline" className="w-full">View Opportunities →</Button>
                </Link>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default Companies
