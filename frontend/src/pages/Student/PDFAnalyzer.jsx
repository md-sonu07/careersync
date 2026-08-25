import { useState } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import FileUpload from '../../components/ui/FileUpload'
import PageHeader from '../../components/common/PageHeader'
import Modal from '../../components/ui/Modal'

export default function PDFAnalyzer() {
  const [state, setState] = useState('idle') // idle | analyzing | done
  const [modal, setModal] = useState(null)

  const handleAnalyze = () => { setState('analyzing'); setTimeout(()=>setState('done'),1600) }

  return (
    <div className="space-y-6">
      <PageHeader title="PDF Analyzer" subtitle="Upload any PDF — notes, slides, job description — get summary, topics, skills and study plan." />

      {state==='idle' && (
        <Card>
          <h3 className="font-bold text-charcoal">Upload PDF</h3>
          <p className="text-sm text-muted mt-1">Supports academic notes, research papers, resumes, JDs. Max 10MB.</p>
          <div className="mt-5">
            <FileUpload accept=".pdf" maxSizeMB={10} hint="Drop PDF here or click to browse (PDF only)" onFiles={handleAnalyze} />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={handleAnalyze}>Analyze PDF</Button>
            <Button variant="outline" onClick={handleAnalyze}>Try Sample PDF</Button>
          </div>
        </Card>
      )}

      {state==='analyzing' && (
        <Card className="text-center py-12">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-sage border-t-primary" />
          <h3 className="mt-4 font-bold text-charcoal">Analyzing PDF…</h3>
          <p className="text-sm text-muted">Extracting topics, concepts and skills. This takes ~8 seconds.</p>
          <div className="mt-6 flex justify-center gap-2 text-xs text-muted"><span className="h-2 w-2 rounded-full bg-primary animate-pulse" /> Reading pages <span className="h-2 w-2 rounded-full bg-primary animate-pulse delay-150" /> Summarizing</div>
        </Card>
      )}

      {state==='done' && (
        <>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={()=>setState('idle')}>Analyze Another</Button>
            <Button size="sm">Download Report</Button>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <h3 className="font-bold text-charcoal">Summary</h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal/80">
                This PDF covers <strong>MERN Stack Fundamentals</strong> — React component lifecycle, Express middleware, MongoDB aggregation, and deployment basics. Ideal for a Full Stack Developer preparing for internships. Key focus on practical patterns (hooks, REST, indexing) with 2 hands-on projects.
              </p>
              <div className="mt-4 rounded-xl bg-sage border border-sage p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-primary">TL;DR — 3 lines</p>
                <ul className="mt-2 space-y-1 text-sm text-charcoal list-disc list-inside">
                  <li>React hooks & context for scalable UI; memoization for performance.</li>
                  <li>Express middleware + JWT; MongoDB aggregation for analytics.</li>
                  <li>Docker basics & Vercel deploy pipeline.</li>
                </ul>
              </div>
            </Card>

            <Card>
              <h3 className="font-bold text-charcoal text-sm">Document Info</h3>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between rounded-xl bg-background border border-border px-3 py-2"><span className="text-muted">Pages</span><span className="font-bold">24</span></div>
                <div className="flex justify-between rounded-xl bg-background border border-border px-3 py-2"><span className="text-muted">Words</span><span className="font-bold">~6,240</span></div>
                <div className="flex justify-between rounded-xl bg-background border border-border px-3 py-2"><span className="text-muted">Type</span><span className="font-bold">Study Notes</span></div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button size="sm" className="flex-1" onClick={()=>setModal('mcq')}>Generate MCQs</Button>
                <Button size="sm" variant="outline" className="flex-1" onClick={()=>setModal('explain')}>Explain PDF</Button>
              </div>
              <Button size="sm" variant="outline" className="w-full mt-2" onClick={()=>setModal('plan')}>Create Study Plan</Button>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <h3 className="font-bold text-charcoal">Topics</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {['React Hooks','Context & Redux','Express Middleware','JWT Auth','MongoDB Aggregation','Docker','Deployment'].map(t=>(
                  <span key={t} className="rounded-full bg-white border border-border px-3 py-1.5 text-xs font-semibold text-charcoal">{t}</span>
                ))}
              </div>
              <h4 className="mt-5 text-sm font-bold text-charcoal">Key Concepts</h4>
              <ul className="mt-2 space-y-2">
                {['useEffect cleanup prevents memory leaks','Aggregation pipeline — $match → $group → $sort','Middleware order matters in Express'].map(c=>(
                  <li key={c} className="flex gap-2 text-sm text-charcoal/80"><span className="text-primary">•</span>{c}</li>
                ))}
              </ul>
            </Card>

            <Card>
              <h3 className="font-bold text-charcoal">Skills Extracted</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {['React','JavaScript','Node.js','Express','MongoDB','Docker','Git'].map(s=>(
                  <span key={s} className="rounded-full bg-sage border border-sage px-3 py-1.5 text-xs font-semibold text-primary">{s}</span>
                ))}
              </div>
              <h4 className="mt-5 text-sm font-bold text-charcoal">Important Questions</h4>
              <ol className="mt-2 space-y-2 list-decimal list-inside text-sm text-charcoal/80">
                <li>Explain useMemo vs useCallback with example.</li>
                <li>How does Express middleware chain handle errors?</li>
                <li>Write an aggregation to get top 3 products by sales.</li>
                <li>Why use multi-stage Docker builds?</li>
              </ol>
            </Card>
          </div>

          {/* Mock modals */}
          <Modal open={modal==='mcq'} onClose={()=>setModal(null)} title="Generated MCQs (Mock)">
            <div className="space-y-3">
              {[
                { q:'Which hook is used for side effects?', a:'useEffect' },
                { q:'Which Mongo operator adds to array if not present?', a:'$addToSet' },
              ].map((m,i)=>(
                <div key={i} className="rounded-xl border border-border p-3"><p className="text-sm font-semibold text-charcoal">{i+1}. {m.q}</p><p className="text-xs text-success mt-1">Answer: {m.a}</p></div>
              ))}
              <Button className="w-full" onClick={()=>setModal(null)}>Start MCQ Practice</Button>
            </div>
          </Modal>
          <Modal open={modal==='explain'} onClose={()=>setModal(null)} title="Explain PDF (Mock)">
            <p className="text-sm leading-relaxed text-charcoal/80">This PDF teaches MERN by connecting frontend state (React) to backend APIs (Express/Mongo) and deployment. Think of it as: UI → API → DB → Cloud. Focus on hooks, middleware, and aggregation — they’re the glue.</p>
            <Button className="mt-4 w-full" onClick={()=>setModal(null)}>Got it</Button>
          </Modal>
          <Modal open={modal==='plan'} onClose={()=>setModal(null)} title="Study Plan (Mock)">
            <ul className="space-y-2 text-sm text-charcoal">
              <li className="rounded-xl bg-background border border-border p-3"><strong>Day 1-2:</strong> React Hooks + Context (4h)</li>
              <li className="rounded-xl bg-background border border-border p-3"><strong>Day 3-4:</strong> Express & JWT (3h) + Postman practice</li>
              <li className="rounded-xl bg-background border border-border p-3"><strong>Day 5:</strong> MongoDB Aggregation + Docker (3h)</li>
            </ul>
            <Button className="mt-4 w-full" onClick={()=>setModal(null)}>Add to Roadmap</Button>
          </Modal>
        </>
      )}
    </div>
  )
}
