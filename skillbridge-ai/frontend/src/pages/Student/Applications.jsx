import { useState, useEffect } from 'react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import PageHeader from '../../components/common/PageHeader'
import { Table, THead, TBody, TR, TH, TD } from '../../components/ui/Table'
import { applicationApi } from '../../api/application.api'
import { mockApplications } from '../../utils/mockData'

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
  const currentStage = stages.indexOf(statusStr) !== -1 ? stages.indexOf(statusStr) : 0
  return (
    <div className="flex items-center gap-1">
      {stages.map((s, i) => {
        const done = i <= currentStage
        const active = i === currentStage
        return (
          <div key={s} className="flex items-center gap-1">
            <div className={`h-2 w-8 rounded-full ${done ? 'bg-primary' : 'bg-border'} ${active ? 'ring-2 ring-primary/20' : ''}`} title={s} />
            {i < stages.length - 1 && <div className={`h-0.5 w-2 ${i < currentStage ? 'bg-primary' : 'bg-border'}`} />}
          </div>
        )
      })}
    </div>
  )
}

export default function Applications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    applicationApi.getMyApplications()
      .then((data) => {
        if (isMounted && data && data.length > 0) setApplications(data)
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
        title="My Applications"
        subtitle="Track every internship & job application in real-time with status change history."
        actions={<Badge variant="muted">{applications.length || mockApplications.length} total</Badge>}
      />

      <Card>
        <h3 className="font-bold text-charcoal">Pipeline Overview</h3>
        <div className="mt-4 grid grid-cols-5 gap-2 text-center">
          {stages.map((s) => {
            const count = applications.filter((a) => a.status === s).length
            return (
              <div key={s} className="rounded-xl border border-border bg-background p-3">
                <p className="text-lg font-bold text-charcoal">{count}</p>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">{s.replace('_', ' ')}</p>
              </div>
            )
          })}
        </div>
      </Card>

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
          {applications.length > 0 ? (
            applications.map((a) => (
              <TR key={a.id}>
                <TD className="font-semibold">{a.opportunity?.company?.company_name || 'Partner'}</TD>
                <TD>{a.opportunity?.title}</TD>
                <TD className="whitespace-nowrap text-muted">
                  {a.applied_at ? new Date(a.applied_at).toLocaleDateString() : 'Today'}
                </TD>
                <TD><Badge variant={statusColor[a.status] || 'muted'}>{a.status}</Badge></TD>
                <TD><Stepper statusStr={a.status} /></TD>
              </TR>
            ))
          ) : (
            mockApplications.map((a) => (
              <TR key={a.id}>
                <TD className="font-semibold">{a.company}</TD>
                <TD>{a.role}</TD>
                <TD className="whitespace-nowrap text-muted">{a.applied}</TD>
                <TD><Badge variant={statusColor[a.status?.toLowerCase()] || 'muted'}>{a.status}</Badge></TD>
                <TD><Stepper statusStr={a.status?.toLowerCase()} /></TD>
              </TR>
            ))
          )}
        </TBody>
      </Table>
    </div>
  )
}
