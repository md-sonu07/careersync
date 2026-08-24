import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import PageHeader from '../../components/common/PageHeader'
import { applicationApi } from '../../api/application.api'

export default function ApplicationDetail() {
  const { id } = useParams()
  const [application, setApplication] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    applicationApi.getMyApplications()
      .then((data) => {
        if (isMounted && data && data.length > 0) {
          const match = id ? data.find((a) => a.id === id) || data[0] : data[0]
          setApplication(match)
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoading(false)
      })
    return () => { isMounted = false }
  }, [id])

  const opp = application?.opportunity || {}
  const companyName = opp.company?.company_name || 'Flipkart'
  const history = application?.status_history || []

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Application Detail — ${opp.title || 'Frontend Intern'}`}
        subtitle={`${companyName} • Applied ${application?.applied_at ? new Date(application.applied_at).toLocaleDateString() : 'Recently'} • Status: ${application?.status || 'applied'}`}
        actions={<Badge variant="success">{application?.status || 'Applied'}</Badge>}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="font-bold text-charcoal">Application Audit History</h3>
            <div className="mt-5 space-y-4">
              {history.length > 0 ? (
                history.map((h, i) => (
                  <div key={h.id || i} className="flex gap-4 items-start">
                    <div className="flex flex-col items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-xs font-bold">
                        {i + 1}
                      </div>
                      {i !== history.length - 1 && <div className="w-0.5 flex-1 mt-1 bg-primary/30" style={{ minHeight: '32px' }} />}
                    </div>
                    <div className="pb-4 flex-1">
                      <div className="flex flex-wrap items-baseline gap-2">
                        <p className="text-sm font-bold text-charcoal">{h.new_status}</p>
                        <span className="text-xs text-muted">{new Date(h.created_at).toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-muted mt-1">{h.remarks || 'Status updated by recruiter.'}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted">Application submitted and pending recruiter review.</p>
              )}
            </div>
          </Card>

          <Card>
            <h3 className="font-bold text-charcoal">Submitted Cover Letter</h3>
            <p className="mt-3 text-sm text-charcoal/80 leading-relaxed bg-background p-4 rounded-xl border border-border">
              {application?.cover_letter || 'No cover letter provided.'}
            </p>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h3 className="font-bold text-charcoal text-sm">Company & Position</h3>
            <div className="mt-3 flex gap-3">
              <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary text-xl">
                {companyName[0]}
              </div>
              <div>
                <p className="text-sm font-bold text-charcoal">{companyName}</p>
                <p className="text-xs text-muted">{opp.title} • {opp.duration || '6 Months'}</p>
                <p className="text-xs text-muted">{opp.location || 'Remote'}</p>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between rounded-xl bg-background border border-border px-3 py-2">
                <span className="text-muted">Current Status</span>
                <span className="font-bold text-success uppercase">{application?.status || 'Applied'}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
