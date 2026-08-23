import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import PageHeader from '../../components/common/PageHeader'
import { Table, THead, TBody, TR, TH, TD } from '../../components/ui/Table'
import { mockApplications } from '../../utils/mockData'

const stages = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected']
const statusColor = {
  Applied: 'muted',
  'Under Review': 'accent',
  Shortlisted: 'default',
  Interview: 'accent',
  Selected: 'success',
  Rejected: 'danger',
}

function Stepper({ stage }) {
  return (
    <div className="flex items-center gap-1">
      {stages.map((s, i) => {
        const done = i <= stage
        const active = i === stage
        return (
          <div key={s} className="flex items-center gap-1">
            <div className={`h-2 w-8 rounded-full ${done ? 'bg-primary' : 'bg-border'} ${active ? 'ring-2 ring-primary/20' : ''}`} title={s} />
            {i < stages.length - 1 && <div className={`h-0.5 w-2 ${i < stage ? 'bg-primary' : 'bg-border'}`} />}
          </div>
        )
      })}
    </div>
  )
}

export default function Applications() {
  return (
    <div className="space-y-6">
      <PageHeader title="My Applications" subtitle="Track every internship & job application in one pipeline." actions={<Badge variant="muted">{mockApplications.length} total</Badge>} />

      <Card>
        <h3 className="font-bold text-charcoal">Pipeline Overview</h3>
        <div className="mt-4 grid grid-cols-5 gap-2 text-center">
          {stages.map((s, i) => {
            const count = mockApplications.filter((a) => a.stage === i).length
            return (
              <div key={s} className="rounded-xl border border-border bg-background p-3">
                <p className="text-lg font-bold text-charcoal">{count}</p>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">{s}</p>
              </div>
            )
          })}
        </div>
      </Card>

      <Table>
        <THead>
          <TR>
            <TH>Company</TH>
            <TH>Role</TH>
            <TH>Applied</TH>
            <TH>Match</TH>
            <TH>Status</TH>
            <TH>Pipeline</TH>
          </TR>
        </THead>
        <TBody>
          {mockApplications.map((a) => (
            <TR key={a.id}>
              <TD className="font-semibold">{a.company}</TD>
              <TD>{a.role}</TD>
              <TD className="whitespace-nowrap text-muted">{a.applied}</TD>
              <TD><span className="rounded-full bg-success/10 border border-success/20 px-2 py-0.5 text-xs font-bold text-success">{a.match}%</span></TD>
              <TD><Badge variant={statusColor[a.status] || 'muted'}>{a.status}</Badge></TD>
              <TD><Stepper stage={a.stage} /></TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  )
}
