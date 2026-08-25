import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import PageHeader from '../../components/common/PageHeader'
import { Table, THead, TBody, TR, TH, TD } from '../../components/ui/Table'
import { applicationApi } from '../../api/application.api'
import AppIcon from '../../components/ui/AppIcon'

const stages = ['applied', 'under_review', 'shortlisted', 'interview', 'selected']

const statusColor = {
  applied: 'muted',
  under_review: 'accent',
  shortlisted: 'default',
  interview: 'accent',
  selected: 'success',
  rejected: 'danger',
  withdrawn: 'muted',
}

function Stepper({ statusStr }) {
  const currentStage = stages.indexOf(statusStr?.toLowerCase()) !== -1 ? stages.indexOf(statusStr?.toLowerCase()) : 0
  return (
    <div className="flex items-center gap-1">
      {stages.map((s, i) => {
        const done = i <= currentStage
        const active = i === currentStage
        return (
          <div key={s} className="flex items-center gap-1">
            <div
              className={`h-2.5 w-7 rounded-full transition-all ${done ? 'bg-primary' : 'bg-border'} ${active ? 'ring-2 ring-primary/30 shadow-xs' : ''}`}
              title={s.replace('_', ' ').toUpperCase()}
            />
            {i < stages.length - 1 && <div className={`h-0.5 w-1.5 ${i < currentStage ? 'bg-primary' : 'bg-border'}`} />}
          </div>
        )
      })}
    </div>
  )
}

export default function Applications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const data = await applicationApi.getMyApplications()
      setApplications(Array.isArray(data) ? data : data?.results || [])
    } catch {
      setApplications([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Applications"
        subtitle="Track every internship & job application in real-time with live status change history from Django database."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchApplications} disabled={loading}>
              <AppIcon name="refresh" className="text-[16px]" /> Refresh
            </Button>
            <Badge variant="muted">{applications.length} TOTAL</Badge>
          </div>
        }
      />

      {/* Pipeline Overview */}
      <Card>
        <h3 className="font-bold text-charcoal">Pipeline Overview</h3>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5 text-center">
          {stages.map((s) => {
            const count = applications.filter((a) => (a.status || '').toLowerCase() === s).length
            return (
              <div key={s} className="rounded-xl border border-border bg-background p-3.5 transition-colors hover:border-primary/30">
                <p className="text-xl font-extrabold text-charcoal">{count}</p>
                <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-muted">{s.replace('_', ' ')}</p>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Applications Table */}
      <Card className="p-0 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-muted">
            <AppIcon name="sync" className="animate-spin text-2xl text-primary mx-auto mb-2" />
            Loading your live applications...
          </div>
        ) : applications.length > 0 ? (
          <Table>
            <THead>
              <TR>
                <TH>Company</TH>
                <TH>Role / Opportunity</TH>
                <TH>Applied Date</TH>
                <TH>Status</TH>
                <TH>Pipeline</TH>
              </TR>
            </THead>
            <TBody>
              {applications.map((a) => {
                const companyName = a.opportunity?.company?.company_name || a.company_name || 'Hiring Partner'
                const roleTitle = a.opportunity?.title || a.opportunity_title || 'Opportunity'
                const appliedDate = a.applied_at || a.created_at ? new Date(a.applied_at || a.created_at).toLocaleDateString() : 'Recent'
                const statusStr = (a.status || 'applied').toLowerCase()

                return (
                  <TR key={a.id}>
                    <TD className="font-bold text-charcoal">{companyName}</TD>
                    <TD className="font-semibold text-primary">{roleTitle}</TD>
                    <TD className="whitespace-nowrap text-muted text-xs font-medium">{appliedDate}</TD>
                    <TD>
                      <Badge variant={statusColor[statusStr] || 'muted'}>
                        {statusStr.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </TD>
                    <TD>
                      <Stepper statusStr={statusStr} />
                    </TD>
                  </TR>
                )
              })}
            </TBody>
          </Table>
        ) : (
          <div className="p-12 text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sage text-primary text-2xl font-bold">
              <AppIcon name="work_outline" />
            </div>
            <h4 className="text-base font-bold text-charcoal">No Applications Yet</h4>
            <p className="text-xs text-muted max-w-md mx-auto">
              You haven't submitted any internship or job applications yet. Browse explore opportunities and start applying!
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Link to="/internships">
                <Button variant="primary" size="sm">Explore Internships</Button>
              </Link>
              <Link to="/jobs">
                <Button variant="outline" size="sm">Explore Jobs</Button>
              </Link>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
