import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import PageHeader from '../../components/common/PageHeader'

const recs = [
  { id:'i1', company:'Flipkart', role:'Frontend Intern', logo:'🛒', match:92, why:['Strong React (82%)','JavaScript 86%','Git 90%'], missing:['Docker basics'], stipend:'₹25k/mo', location:'Bengaluru (Remote)', type:'Internship' },
  { id:'i2', company:'CRED', role:'React Developer Intern', logo:'💳', match:88, why:['React 82% vs 80% required','Tailwind 78%'], missing:['TypeScript — 68% vs 75%'], stipend:'₹28k/mo', location:'Remote', type:'Internship' },
  { id:'i3', company:'Razorpay', role:'Junior Full Stack Dev', logo:'💸', match:84, why:['Node 76% meets bar','MongoDB 79%'], missing:['Testing 38% — critical','AWS 32%'], stipend:'₹8-12 LPA', location:'Bengaluru', type:'Job' },
  { id:'i4', company:'Postman', role:'Frontend Engineer I', logo:'📮', match:79, why:['Good JS fundamentals'], missing:['TypeScript gap','System Design'], stipend:'₹10-14 LPA', location:'Remote', type:'Job' },
]

export default function Recommended(){
  return (
    <div className="space-y-6">
      <PageHeader
        title="Recommended for You"
        subtitle="AI-sorted by match — see why you match and what to improve to unlock higher scores."
        actions={<Badge variant="default" icon="auto_awesome">AI Sorted</Badge>}
      />

      <div className="grid grid-cols-1 gap-5">
        {recs.map(r=>(
          <Card key={r.id} hover className="!p-0 overflow-hidden">
            <div className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background border border-border text-xl">{r.logo}</div>
                  <div>
                    <h3 className="text-sm font-bold text-charcoal">{r.role}</h3>
                    <p className="text-xs text-muted">{r.company} • {r.location} • {r.type}</p>
                    <p className="text-xs text-muted mt-0.5">{r.stipend}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex rounded-full px-3 py-1 text-sm font-bold ${r.match>=90 ? 'bg-green-100 text-green-700' : r.match>=80 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{r.match}% Match</span>
                  <p className="text-[11px] text-muted mt-1">AI confidence</p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-green-50 border border-green-200 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-green-700">Why you match</p>
                  <ul className="mt-2 space-y-1">
                    {r.why.map(w=>(
                      <li key={w} className="flex gap-2 text-sm text-charcoal"><span className="text-green-600">✓</span>{w}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Missing / Gap</p>
                  <ul className="mt-2 space-y-1">
                    {r.missing.map(m=>(
                      <li key={m} className="flex gap-2 text-sm text-charcoal"><span className="text-amber-600">•</span>{m}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <Button size="sm">Apply Now</Button>
                <Button size="sm" variant="outline">View Details</Button>
                <Button size="sm" variant="ghost">Save</Button>
                <span className="ml-auto text-xs text-muted self-center">Closes in 12 days • {Math.floor(Math.random()*500)+100} applicants</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
