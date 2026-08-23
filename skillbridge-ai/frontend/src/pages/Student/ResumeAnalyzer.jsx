import { useState } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import FileUpload from '../../components/ui/FileUpload'
import { ProgressRing, ProgressBar } from '../../components/ui/Progress'
import PageHeader from '../../components/common/PageHeader'

export default function ResumeAnalyzer() {
  const [state, setState] = useState('idle') // idle | processing | done

  const handleFiles = () => {
    setState('processing')
    setTimeout(()=>setState('done'), 1800)
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Resume Analyzer" subtitle="Upload your resume — get AI-powered strength score, skills detected, gaps and opportunities." />

      {state === 'idle' && (
        <Card>
          <h3 className="font-bold text-charcoal">Upload Resume</h3>
          <p className="text-sm text-muted mt-1">PDF or DOCX, max 5MB. Your data stays private.</p>
          <div className="mt-5">
            <FileUpload label="Resume file" accept=".pdf,.docx" maxSizeMB={5} hint="Drag & drop your resume or click to browse" onFiles={handleFiles} />
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={handleFiles}>Analyze Resume</Button>
            <Button variant="outline">Use Sample Resume</Button>
          </div>
        </Card>
      )}

      {state === 'processing' && (
        <Card className="text-center py-12">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-sage border-t-primary" />
          <h3 className="mt-4 font-bold text-charcoal">Analyzing your resume…</h3>
          <p className="text-sm text-muted mt-1">Extracting skills, checking ATS, matching opportunities.</p>
          <div className="mx-auto mt-6 max-w-sm">
            <ProgressBar value={68} size="sm" showLabel label="Processing" />
          </div>
        </Card>
      )}

      {state === 'done' && (
        <>
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={()=>setState('idle')}>Analyze Another</Button>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="text-center lg:col-span-1">
              <p className="text-xs font-bold uppercase tracking-widest text-muted">Resume Strength</p>
              <div className="mt-4 flex justify-center"><ProgressRing value={78} size={120} strokeWidth={10} /></div>
              <p className="mt-2 text-lg font-bold text-charcoal">78 / 100</p>
              <p className="text-xs text-muted">Strong — minor improvements needed</p>
              <div className="mt-4 text-left space-y-2">
                <div className="flex justify-between text-xs"><span className="text-muted">ATS Score</span><span className="font-bold text-success">82%</span></div>
                <ProgressBar value={82} size="sm" barClassName="bg-success" />
                <div className="flex justify-between text-xs"><span className="text-muted">Content Quality</span><span className="font-bold">76%</span></div>
                <ProgressBar value={76} size="sm" />
              </div>
            </Card>

            <div className="lg:col-span-2 space-y-6">
              <Card>
                <h3 className="font-bold text-charcoal">Skills Detected</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {['JavaScript','React','Node.js','Express','MongoDB','Tailwind','Git','REST APIs'].map(s=>(
                    <span key={s} className="rounded-full bg-sage border border-sage px-3 py-1.5 text-xs font-semibold text-primary">{s} ✓</span>
                  ))}
                </div>
                <div className="mt-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-danger">Missing / Weak Skills for Full Stack Roles</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {['Docker','Testing (Jest)','TypeScript','AWS','System Design'].map(s=>(
                      <span key={s} className="rounded-full bg-white border border-amber-200 px-3 py-1.5 text-xs font-semibold text-amber-700">{s} — missing</span>
                    ))}
                  </div>
                </div>
              </Card>

              <Card>
                <h3 className="font-bold text-charcoal">Improvement Suggestions</h3>
                <ul className="mt-3 space-y-3">
                  {[
                    { t:'Add quantified impact', d:'“Built E-Commerce API” → “Built E-Commerce API handling 1k req/day, 40% faster queries with indexing.”' },
                    { t:'Add Testing & Docker', d:'Add 1 line for Jest coverage and Dockerized deployment — improves ATS by ~12%.' },
                    { t:'Stronger summary', d:'Lead with “Aspiring Full Stack Developer — React/Node/MongoDB — 2 shipped projects, seeking internships.”' },
                  ].map((s,i)=>(
                    <li key={i} className="flex gap-3 rounded-xl bg-background border border-border p-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white text-xs font-bold shrink-0">{i+1}</span>
                      <div><p className="text-sm font-semibold text-charcoal">{s.t}</p><p className="text-xs text-muted mt-1 leading-relaxed">{s.d}</p></div>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>

          <Card>
            <h3 className="font-bold text-charcoal">Recommended Opportunities based on your resume</h3>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                { company:'Flipkart', role:'Frontend Intern', match:92, missing:'Docker' },
                { company:'CRED', role:'React Developer Intern', match:88, missing:'TypeScript' },
                { company:'Razorpay', role:'Junior Full Stack Dev', match:84, missing:'Testing' },
                { company:'Postman', role:'Frontend Engineer I', match:79, missing:'AWS' },
              ].map(o=>(
                <div key={o.company} className="rounded-xl border border-border bg-white p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-background border border-border flex items-center justify-center font-bold text-charcoal">{o.company[0]}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-charcoal truncate">{o.role}</p>
                    <p className="text-xs text-muted">{o.company} • Missing: {o.missing}</p>
                  </div>
                  <span className="rounded-full bg-success/10 px-2.5 py-1 text-xs font-bold text-success">{o.match}%</span>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  )
}
