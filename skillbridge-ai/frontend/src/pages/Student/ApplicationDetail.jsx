import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import PageHeader from '../../components/common/PageHeader'

const steps = [
  { label:'Applied', date:'2026-02-12', done:true, desc:'Application submitted — resume + cover letter' },
  { label:'Reviewed', date:'2026-02-14', done:true, desc:'Recruiter reviewed — profile shortlisted' },
  { label:'Shortlisted', date:'2026-02-18', done:true, desc:'You are in top 12 candidates' },
  { label:'Interview', date:'2026-03-02', done:false, current:true, desc:'Scheduled — Video interview on Mar 02, 11:00 AM' },
  { label:'Selected', date:'—', done:false, desc:'Offer pending interview outcome' },
]

export default function ApplicationDetail(){
  return (
    <div className="space-y-6">
      <PageHeader
        title="Application Detail"
        subtitle="Flipkart — Frontend Intern (Bengaluru Remote) • Applied 12 Feb 2026 • 92% Match"
        actions={<Badge variant="success">Shortlisted</Badge>}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="font-bold text-charcoal">Timeline</h3>
            <div className="mt-5 space-y-0">
              {steps.map((s,i)=>(
                <div key={s.label} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold ${s.done ? 'bg-primary border-primary text-white' : s.current ? 'bg-white border-primary text-primary ring-4 ring-primary/10' : 'bg-white border-border text-muted'}`}>
                      {s.done ? '✓' : i+1}
                    </div>
                    {i!==steps.length-1 && <div className={`w-0.5 flex-1 mt-1 ${s.done ? 'bg-primary' : 'bg-border'}`} style={{minHeight: '36px'}} />}
                  </div>
                  <div className="pb-6 flex-1">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <p className={`text-sm font-bold ${s.current ? 'text-primary' : 'text-charcoal'}`}>{s.label}</p>
                      <span className="text-xs text-muted">{s.date}</span>
                      {s.current && <span className="rounded-full bg-blue-100 text-blue-700 px-2 py-0.5 text-[11px] font-bold">CURRENT</span>}
                    </div>
                    <p className="text-sm text-muted mt-1">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="font-bold text-charcoal">Interview Details</h3>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-background border border-border p-3"><p className="text-xs text-muted">Date & Time</p><p className="text-sm font-semibold text-charcoal">Mar 02, 2026 — 11:00 AM IST</p></div>
              <div className="rounded-xl bg-background border border-border p-3"><p className="text-xs text-muted">Type</p><p className="text-sm font-semibold text-charcoal">Video — Google Meet</p></div>
            </div>
            <div className="mt-3 rounded-xl bg-white border border-border p-3 flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-charcoal truncate">meet.google.com/abc-defg-hij</span>
              <Button size="sm">Join</Button>
            </div>
          </Card>

          <Card>
            <h3 className="font-bold text-charcoal">Messages</h3>
            <div className="mt-3 space-y-3">
              <div className="rounded-xl bg-sage border border-sage p-3"><p className="text-xs font-bold text-primary">Recruiter — Feb 18</p><p className="text-sm text-charcoal mt-1">Hi Rahul, great profile! You’re shortlisted. Please confirm interview slot.</p></div>
              <div className="rounded-xl bg-background border border-border p-3"><p className="text-xs font-bold text-charcoal">You — Feb 18</p><p className="text-sm text-charcoal mt-1">Confirmed for Mar 02, 11 AM. Looking forward!</p></div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h3 className="font-bold text-charcoal text-sm">Company & Position</h3>
            <div className="mt-3 flex gap-3">
              <div className="h-12 w-12 rounded-xl bg-background border border-border flex items-center justify-center text-xl">🛒</div>
              <div><p className="text-sm font-bold text-charcoal">Flipkart</p><p className="text-xs text-muted">Frontend Intern • 3 Months • ₹25k/mo</p><p className="text-xs text-muted">Bengaluru (Remote)</p></div>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between rounded-xl bg-background border border-border px-3 py-2"><span className="text-muted">Status</span><span className="font-bold text-success">Shortlisted</span></div>
              <div className="flex justify-between rounded-xl bg-background border border-border px-3 py-2"><span className="text-muted">Match</span><span className="font-bold">92%</span></div>
            </div>
          </Card>

          <Card>
            <h3 className="font-bold text-charcoal text-sm">Documents</h3>
            <div className="mt-3 space-y-2">
              {['Resume_Rahul_Sharma.pdf','Cover_Letter.pdf'].map(d=>(
                <a key={d} href="#" className="flex items-center justify-between rounded-xl border border-border bg-white px-3 py-2.5 text-sm font-medium text-charcoal hover:bg-background">
                  <span className="flex items-center gap-2"><span className="material-symbols-outlined text-muted text-[18px]">description</span>{d}</span>
                  <span className="text-xs text-primary">View</span>
                </a>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="font-bold text-charcoal text-sm">Status History</h3>
            <div className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-muted">Feb 12</span><span className="font-semibold">Applied</span></div>
              <div className="flex justify-between"><span className="text-muted">Feb 14</span><span className="font-semibold">Under Review</span></div>
              <div className="flex justify-between"><span className="text-muted">Feb 18</span><span className="font-semibold text-success">Shortlisted</span></div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
