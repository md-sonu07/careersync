import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Textarea from '../../components/ui/Textarea'
import Select from '../../components/ui/Select'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import AppIcon from '../../components/ui/AppIcon';
import { opportunityApi } from '../../api/opportunity.api'
import { skillApi } from '../../api/skill.api'

const ALL_SKILLS = ['React', 'Node.js', 'Python', 'JavaScript', 'TypeScript', 'SQL', 'MongoDB', 'AWS', 'Docker', 'Git', 'Java', 'Figma', 'Express.js', 'Next.js', 'Tailwind CSS', 'System Design', 'REST APIs']

const STEPS = [
  { id: 1, label: 'Opportunity Details' },
  { id: 2, label: 'Required Skills' },
  { id: 3, label: 'Eligibility' },
  { id: 4, label: 'Location & Compensation' },
  { id: 5, label: 'Application Settings' },
  { id: 6, label: 'Preview & Publish' },
]

function SkillsSelector({ selected, setSelected }) {
  const toggle = (skill) => {
    const exists = selected.find((s) => s.name === skill)
    if (exists) setSelected(selected.filter((s) => s.name !== skill))
    else setSelected([...selected, { name: skill, level: 'Required' }])
  }
  const toggleLevel = (skill) => {
    setSelected(selected.map((s) => (s.name === skill ? { ...s, level: s.level === 'Required' ? 'Preferred' : 'Required' } : s)))
  }
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-muted mb-3">Select skills — tap to add, toggle Required/Preferred</p>
      <div className="flex flex-wrap gap-2">
        {ALL_SKILLS.map((skill) => {
          const sel = selected.find((s) => s.name === skill)
          return (
            <button
              key={skill}
              onClick={() => toggle(skill)}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                sel ? 'bg-primary text-white border-primary' : 'bg-white border-border text-charcoal hover:bg-background'
              }`}
            >
              {skill}
              {sel && (
                <span
                  onClick={(e) => { e.stopPropagation(); toggleLevel(skill) }}
                  className={`ml-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${sel.level === 'Required' ? 'bg-white text-primary' : 'bg-accent text-white'}`}
                >
                  {sel.level}
                </span>
              )}
            </button>
          )
        })}
      </div>
      {selected.length > 0 && (
        <div className="mt-4 rounded-xl bg-sage border border-border p-3">
          <p className="text-xs font-bold text-primary mb-2">Selected ({selected.length})</p>
          <div className="flex flex-wrap gap-2">
            {selected.map((s) => (
              <span key={s.name} className="inline-flex items-center gap-1.5 rounded-full bg-white border border-border px-3 py-1 text-xs font-semibold text-charcoal">
                {s.name} <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${s.level === 'Required' ? 'bg-primary text-white' : 'bg-accent text-white'}`}>{s.level}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function AIJobDescriptionAssistant({ onExtract }) {
  const [jd, setJd] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const handleExtract = () => {
    if (!jd.trim()) return
    setLoading(true)
    setTimeout(() => {
      const extracted = {
        role: 'Junior Full Stack Developer',
        skills: ['React', 'Node.js', 'SQL'],
        experience: '0-2 years • Fresher OK',
        keywords: ['REST APIs', 'System Design Basics', 'Agile'],
        description: 'Join TechNova as a Junior Full Stack Developer building scalable products with React and Node.js.',
      }
      setResult(extracted)
      setLoading(false)
    }, 900)
  }
  const confirm = () => { if (result) onExtract(result); setResult(null); setJd('') }
  return (
    <div className="rounded-2xl border border-border bg-white shadow-subtle overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-background/60">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-white"><AppIcon name="auto_awesome" className="text-[18px]" /></span>
        <div>
          <p className="text-sm font-bold text-charcoal">AI Job Description Assistant</p>
          <p className="text-xs text-muted">Paste a JD — AI extracts role, skills, experience & keywords</p>
        </div>
        <Badge variant="accent" className="ml-auto">Beta</Badge>
      </div>
      <div className="p-5 space-y-4">
        <Textarea placeholder="Paste job description here — e.g. Need a Full Stack Developer with React, Node, SQL, 0-2 years..." value={jd} onChange={(e) => setJd(e.target.value)} rows={4} />
        <Button onClick={handleExtract} disabled={loading || !jd.trim()} variant="primary" size="sm">{loading ? 'Extracting...' : '✨ Extract with AI'}</Button>
        {result && (
          <div className="rounded-xl border border-primary/20 bg-sage/50 p-4 space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">AI extracted — confirm to apply</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-xs text-muted">Role</p><input className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm" value={result.role} onChange={(e) => setResult({ ...result, role: e.target.value })} /></div>
              <div><p className="text-xs text-muted">Experience</p><input className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm" value={result.experience} onChange={(e) => setResult({ ...result, experience: e.target.value })} /></div>
              <div><p className="text-xs text-muted">Skills</p><input className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm" value={result.skills.join(', ')} onChange={(e) => setResult({ ...result, skills: e.target.value.split(',').map((s) => s.trim()) })} /></div>
              <div><p className="text-xs text-muted">Keywords</p><input className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm" value={result.keywords.join(', ')} onChange={(e) => setResult({ ...result, keywords: e.target.value.split(',').map((s) => s.trim()) })} /></div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={confirm}>Confirm & Apply</Button>
              <Button size="sm" variant="outline" onClick={() => setResult(null)}>Discard</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function PostJob() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [showPublish, setShowPublish] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [dbSkills, setDbSkills] = useState([])
  const [skills, setSkills] = useState([{ name: 'React', level: 'Required' }, { name: 'Node.js', level: 'Required' }, { name: 'SQL', level: 'Preferred' }])
  const [form, setForm] = useState({
    title: 'Junior Full Stack Developer',
    employment: 'Full-time',
    experience: '0-2 years',
    description: '',
    eligibility: 'B.Tech / BCA / MCA',
    cgpa: '7.0+ CGPA',
    location: 'Hybrid',
    city: 'Bengaluru',
    ctc: '₹8-12 LPA',
    openings: '3',
    deadline: '',
    screening: 'Resume + Tech Interview',
  })

  useEffect(() => {
    skillApi.getSkills().then((res) => {
      setDbSkills(Array.isArray(res) ? res : res?.results || [])
    }).catch(() => {})
  }, [])

  const handleAIExtract = (data) => { setForm((f) => ({ ...f, title: data.role, experience: data.experience })); setSkills(data.skills.map((s) => ({ name: s, level: 'Required' }))) }
  const next = () => setStep((s) => Math.min(6, s + 1))
  const back = () => setStep((s) => Math.max(1, s - 1))

  const handlePublish = async () => {
    setPublishing(true)
    try {
      const modeMap = { Remote: 'remote', 'On-site': 'onsite', Hybrid: 'hybrid' }
      const reqs = skills.map((s) => {
        const found = dbSkills.find((d) => d.name.toLowerCase() === s.name.toLowerCase())
        return found ? {
          skill_id: found.id,
          minimum_score: 70,
          weight: 1.0,
          is_required: s.level === 'Required'
        } : null
      }).filter(Boolean)

      const payload = {
        title: form.title || 'Junior Full Stack Developer',
        opportunity_type: 'job',
        description: form.description || `${form.title}. Eligibility: ${form.eligibility || 'All graduates'}`,
        location: form.city ? `${form.city} (${form.location})` : form.location || 'Hybrid',
        work_mode: modeMap[form.location] || 'hybrid',
        duration: 'Full-time',
        stipend_salary: form.ctc || '₹8-12 LPA',
        deadline: form.deadline || null,
        status: 'published',
        skill_requirements: reqs,
      }
      await opportunityApi.createOpportunity(payload)
      setShowPublish(true)
    } catch (err) {
      const errorMsg = err.response?.data ? JSON.stringify(err.response.data) : err.message
      alert('Failed to publish job: ' + errorMsg)
    } finally {
      setPublishing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-charcoal">Post Job</h1>
        <p className="text-sm text-muted mt-1">Create a new full-time job posting — 6 steps to publish</p>
      </div>

      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        {STEPS.map((s, idx) => (
          <div key={s.id} className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setStep(s.id)}
              className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold border transition-colors ${step === s.id ? 'bg-primary text-white border-primary' : step > s.id ? 'bg-success text-white border-success' : 'bg-white border-border text-muted'}`}
            >
              <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] ${step === s.id ? 'bg-white text-primary' : step > s.id ? 'bg-white text-success' : 'bg-background text-muted'}`}>{step > s.id ? '✓' : s.id}</span>
              {s.label}
            </button>
            {idx < STEPS.length - 1 && <span className={`h-px w-4 ${step > s.id ? 'bg-success' : 'bg-border'}`} />}
          </div>
        ))}
      </div>

      <AIJobDescriptionAssistant onExtract={handleAIExtract} />

      <Card>
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-bold text-charcoal">Step 1 — Opportunity Details</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2"><Input label="Job Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <Select label="Employment Type" value={form.employment} onChange={(e) => setForm({ ...form, employment: e.target.value })}><option>Full-time</option><option>Contract</option><option>Part-time</option></Select>
              <Input label="Experience Required" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} />
              <div className="sm:col-span-2"><Textarea label="Job Description" placeholder="Responsibilities, team, growth opportunities..." rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-bold text-charcoal">Step 2 — Required Skills</h3>
            <SkillsSelector selected={skills} setSelected={setSkills} />
          </div>
        )}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="font-bold text-charcoal">Step 3 — Eligibility</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Eligible Courses / Branches" value={form.eligibility} onChange={(e) => setForm({ ...form, eligibility: e.target.value })} />
              <Input label="Minimum CGPA / Criteria" value={form.cgpa} onChange={(e) => setForm({ ...form, cgpa: e.target.value })} />
              <Input label="Year of Graduation" placeholder="e.g. 2025, 2026" defaultValue="2025, 2026" />
              <Input label="Backlogs Allowed" defaultValue="No active backlogs" />
            </div>
          </div>
        )}
        {step === 4 && (
          <div className="space-y-4">
            <h3 className="font-bold text-charcoal">Step 4 — Location & Compensation</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Select label="Work Mode" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}><option>Remote</option><option>On-site</option><option>Hybrid</option></Select>
              <Input label="City / Location" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              <Input label="CTC / Salary Range" value={form.ctc} onChange={(e) => setForm({ ...form, ctc: e.target.value })} />
              <Input label="Number of Openings" type="number" value={form.openings} onChange={(e) => setForm({ ...form, openings: e.target.value })} />
            </div>
          </div>
        )}
        {step === 5 && (
          <div className="space-y-4">
            <h3 className="font-bold text-charcoal">Step 5 — Application Settings</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Application Deadline" type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
              <Input label="Screening Process" value={form.screening} onChange={(e) => setForm({ ...form, screening: e.target.value })} />
              <label className="flex items-center gap-2 text-sm text-charcoal"><input type="checkbox" defaultChecked className="rounded border-border" /> Auto-match candidates by skill score</label>
              <label className="flex items-center gap-2 text-sm text-charcoal"><input type="checkbox" defaultChecked className="rounded border-border" /> Require resume upload</label>
              <label className="flex items-center gap-2 text-sm text-charcoal"><input type="checkbox" className="rounded border-border" /> Enable AI skill assessment</label>
              <Input label="Contact Email" defaultValue="hiring@technova.com" />
            </div>
          </div>
        )}
        {step === 6 && (
          <div className="space-y-4">
            <h3 className="font-bold text-charcoal">Step 6 — Preview & Publish</h3>
            <div className="rounded-2xl border border-border bg-background p-5 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-lg font-bold text-charcoal">{form.title}</h4>
                  <p className="text-sm text-muted">TechNova • {form.location} • {form.city} • {form.ctc} • {form.experience}</p>
                </div>
                <Badge variant="success">Ready to publish</Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((s) => (
                  <span key={s.name} className="rounded-full bg-white border border-border px-3 py-1 text-xs font-semibold text-charcoal">{s.name} <span className="text-muted">({s.level})</span></span>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <p><span className="font-bold text-muted">Eligibility:</span> {form.eligibility} • {form.cgpa}</p>
                <p><span className="font-bold text-muted">Openings:</span> {form.openings} • Deadline: {form.deadline || 'Not set'}</p>
              </div>
              {form.description && <p className="text-sm text-charcoal/80 leading-relaxed">{form.description}</p>}
            </div>
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800 flex gap-2">
              <AppIcon name="info" className="text-[20px]" />
              <span>Review all details carefully. Once published, candidates will be notified and can apply immediately.</span>
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
          <Button variant="outline" onClick={back} disabled={step === 1}>Back</Button>
          {step < 6 ? (
            <Button onClick={next}>Continue →</Button>
          ) : (
            <Button onClick={handlePublish} disabled={publishing} className="bg-success hover:bg-success/90">
              {publishing ? 'Publishing...' : '🚀 Publish Job'}
            </Button>
          )}
        </div>
      </Card>

      <Modal open={showPublish} onClose={() => { setShowPublish(false); navigate('/industry/dashboard'); }} title="Job Published!" description="Your job is now live on Django database.">
        <div className="space-y-4 text-sm text-charcoal">
          <div className="flex items-center justify-center h-16 w-16 rounded-full bg-success/10 text-success mx-auto"><AppIcon name="check_circle" className="text-[32px]" /></div>
          <p className="text-center text-muted"><strong>{form.title}</strong> is live. Matching candidates notified.</p>
          <div className="flex gap-2 justify-center">
            <Button onClick={() => { setShowPublish(false); navigate('/industry/dashboard'); }}>Go to Dashboard</Button>
            <Button variant="outline" onClick={() => { setShowPublish(false); navigate('/industry/internships'); }}>View Applications</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
