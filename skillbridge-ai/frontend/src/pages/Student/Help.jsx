import { useState } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Textarea from '../../components/ui/Textarea'
import Select from '../../components/ui/Select'
import PageHeader from '../../components/common/PageHeader'

const faqs = [
  { q:'How is Career Readiness calculated?', a:'Readiness is weighted across skills, courses, projects and assessments vs your target role’s required skills. Gaps in critical skills (e.g., Docker, Testing) lower the score more.' },
  { q:'How do matches work?', a:'We match your skills + projects + preferences against live internships/jobs. Save high matches and close gaps to boost your %.' },
  { q:'Can I change my career goal?', a:'Yes — go to Career Goal, pick a new role/industry. Your roadmap and recommendations update instantly.' },
  { q:'How do I get certificates?', a:'Complete a course (100% + final quiz) to unlock a verified certificate under Certificates.' },
  { q:'Who do I contact for support?', a:'Use the form on this page or email support@skillbridge.ai — we reply within 24h.' },
]

export default function Help(){
  const [open, setOpen] = useState(0)
  const [sent, setSent] = useState(false)

  return (
    <div className="space-y-6">
      <PageHeader title="Help & Support" subtitle="FAQs and contact form — get answers or reach our support team." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="font-bold text-charcoal">Frequently Asked Questions</h3>
          <div className="mt-4 space-y-2">
            {faqs.map((f,i)=>(
              <div key={i} className="rounded-xl border border-border bg-white overflow-hidden">
                <button onClick={()=>setOpen(open===i ? -1 : i)} className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left">
                  <span className="text-sm font-semibold text-charcoal">{f.q}</span>
                  <span className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs transition ${open===i ? 'bg-primary text-white border-primary' : 'bg-background border-border text-muted'}`}>{open===i ? '−' : '+'}</span>
                </button>
                {open===i && <p className="px-4 pb-4 text-sm leading-relaxed text-muted">{f.a}</p>}
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="font-bold text-charcoal">Contact Support</h3>
          <p className="text-xs text-muted mt-1">We usually reply within 24 hours.</p>
          <form className="mt-4 space-y-4" onSubmit={e=>{e.preventDefault(); setSent(true); setTimeout(()=>setSent(false),2500)}}>
            <Input label="Your email" type="email" placeholder="rahul@example.com" required defaultValue="rahul.sharma@example.com" />
            <Select label="Topic" options={['Courses & Learning','Internships / Applications','Account & Profile','Bug Report','Other']} placeholder="Select a topic" required />
            <Textarea label="How can we help?" placeholder="Describe your issue or question…" rows={4} required maxLength={500} showCount />
            <Button type="submit" className="w-full">Send Message</Button>
            {sent && <p className="text-sm font-medium text-success text-center">Message sent — we’ll get back to you soon ✓</p>}
          </form>
          <div className="mt-6 rounded-xl bg-background border border-border p-4 text-sm">
            <p className="font-semibold text-charcoal">Other ways to reach us</p>
            <p className="text-muted mt-1">Email: support@skillbridge.ai • Hours: Mon–Sat 10am–7pm IST</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
