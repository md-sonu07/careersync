import { useState } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Badge from '../../components/ui/Badge'
import Select from '../../components/ui/Select'
import Modal from '../../components/ui/Modal'
import { ProgressBar } from '../../components/ui/Progress'
import AppIcon from '../../components/ui/AppIcon';

const candidates = [
  {
    id: 1, name: 'Rahul Sharma', avatar: 'https://i.pravatar.cc/150?img=12', match: 94, branch: 'CSE — 3rd Year', college: 'Delhi Technological University',
    skills: ['React', 'JavaScript', 'Node.js', 'MongoDB'], assessment: 82, projects: 3, cgpa: '8.6',
    strong: ['React Strong (86%)', 'JavaScript Strong (88%)', 'Node.js — Good'],
    improve: ['Docker 43% — needs improvement'],
  },
  {
    id: 2, name: 'Aman Verma', avatar: 'https://i.pravatar.cc/150?img=15', match: 89, branch: 'IT — 3rd Year', college: 'NSUT, Delhi',
    skills: ['React', 'TypeScript', 'SQL', 'Git'], assessment: 79, projects: 2, cgpa: '8.2',
    strong: ['React Strong', 'TypeScript Good', 'Git Strong'],
    improve: ['AWS 38% — needs improvement'],
  },
  {
    id: 3, name: 'Priya Nair', avatar: 'https://i.pravatar.cc/150?img=32', match: 86, branch: 'CSE — Final Year', college: 'IGDTUW, Delhi',
    skills: ['Python', 'React', 'MongoDB', 'Figma'], assessment: 84, projects: 4, cgpa: '8.9',
    strong: ['Python Strong', 'React Good', 'UI/UX Strong'],
    improve: ['Testing 40% — needs improvement'],
  },
  {
    id: 4, name: 'Sara Khan', avatar: 'https://i.pravatar.cc/150?img=25', match: 78, branch: 'CSE — 3rd Year', college: 'DTU, Delhi',
    skills: ['Java', 'SQL', 'React'], assessment: 71, projects: 2, cgpa: '7.8',
    strong: ['SQL Good', 'Java Good'],
    improve: ['React 62% — needs improvement', 'Node.js gap'],
  },
  {
    id: 5, name: 'Dev Patel', avatar: 'https://i.pravatar.cc/150?img=33', match: 72, branch: 'ECE — 3rd Year', college: 'Jamia Millia Islamia',
    skills: ['JavaScript', 'CSS', 'Git'], assessment: 68, projects: 1, cgpa: '7.4',
    strong: ['JavaScript Good'],
    improve: ['React 55%', 'Backend gaps'],
  },
]

export default function Candidates() {
  const [search, setSearch] = useState('')
  const [skillFilter, setSkillFilter] = useState('All')
  const [view, setView] = useState('cards')
  const [selected, setSelected] = useState(null)

  const filtered = candidates.filter((c) => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false
    if (skillFilter !== 'All' && !c.skills.includes(skillFilter)) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Candidates</h1>
          <p className="text-sm text-muted mt-1">AI-ranked by skill match — best fit on top</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={view === 'cards' ? 'primary' : 'outline'} size="sm" onClick={() => setView('cards')}>Cards</Button>
          <Button variant={view === 'table' ? 'primary' : 'outline'} size="sm" onClick={() => setView('table')}>Table</Button>
        </div>
      </div>

      <Card className="!p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1"><Input placeholder="Search candidates..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
          <Select value={skillFilter} onChange={(e) => setSkillFilter(e.target.value)} className="w-full sm:w-44">
            <option value="All">All skills</option>
            {['React', 'Node.js', 'Python', 'Java', 'SQL', 'AWS'].map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
          <Badge variant="default">{filtered.length} candidates</Badge>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-muted">
          <span>Sort:</span>
          <span className="rounded-full bg-primary text-white px-3 py-1 text-xs font-bold">Match % ↓</span>
          <span className="rounded-full bg-white border border-border px-3 py-1">Assessment</span>
          <span className="rounded-full bg-white border border-border px-3 py-1">Projects</span>
        </div>
      </Card>

      {view === 'cards' ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filtered.map((c) => (
            <Card key={c.id} className="hover:shadow-card transition-shadow">
              <div className="flex gap-4">
                <img src={c.avatar} alt={c.name} className="h-14 w-14 rounded-full object-cover border border-border shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold text-charcoal">{c.name}</p>
                      <p className="text-xs text-muted">{c.branch} • {c.college} • CGPA {c.cgpa}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-sm font-bold shrink-0 ${c.match >= 90 ? 'bg-success text-white' : c.match >= 80 ? 'bg-primary text-white' : 'bg-accent text-white'}`}>
                      {c.match}% Match
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {c.skills.map((s) => <span key={s} className="rounded-full bg-background border border-border px-2.5 py-1 text-xs font-medium text-charcoal">{s}</span>)}
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                    <div className="rounded-xl bg-background border border-border p-2"><p className="text-xs text-muted">Assessment</p><p className="font-bold text-charcoal">{c.assessment}%</p></div>
                    <div className="rounded-xl bg-background border border-border p-2"><p className="text-xs text-muted">Projects</p><p className="font-bold text-charcoal">{c.projects}</p></div>
                    <div className="rounded-xl bg-background border border-border p-2"><p className="text-xs text-muted">Match</p><ProgressBar value={c.match} size="sm" barClassName={c.match >= 90 ? 'bg-success' : 'bg-primary'} /></div>
                  </div>

                  <div className="mt-3 rounded-xl border border-success/20 bg-success/5 p-3">
                    <p className="text-xs font-bold text-success flex items-center gap-1"><AppIcon name="check_circle" className="text-[16px]" /> Why this candidate matches</p>
                    <ul className="mt-1.5 space-y-0.5">
                      {c.strong.map((s) => <li key={s} className="text-xs text-charcoal flex gap-1.5"><span className="text-success">●</span>{s}</li>)}
                    </ul>
                    <p className="mt-2 text-xs font-bold text-danger flex items-center gap-1"><AppIcon name="warning" className="text-[16px]" /> Needs improvement</p>
                    <ul className="mt-1 space-y-0.5">
                      {c.improve.map((s) => <li key={s} className="text-xs text-muted flex gap-1.5"><span className="text-danger">●</span>{s}</li>)}
                    </ul>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <Button size="sm" onClick={() => setSelected(c)}>View Profile</Button>
                    <Button size="sm" variant="outline">Resume</Button>
                    <Button size="sm" variant="ghost">Shortlist</Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="!p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-background/60">
                  <th className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-muted">Candidate</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-muted">Match</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-muted">Skills</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-muted">Assessment</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-muted">Projects</th>
                  <th className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="border-b border-border last:border-0 hover:bg-background/40">
                    <td className="px-6 py-3 flex items-center gap-3">
                      <img src={c.avatar} alt="" className="h-9 w-9 rounded-full border border-border" />
                      <div><p className="text-sm font-semibold text-charcoal">{c.name}</p><p className="text-xs text-muted">{c.college}</p></div>
                    </td>
                    <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${c.match >= 90 ? 'bg-success text-white' : 'bg-primary text-white'}`}>{c.match}%</span></td>
                    <td className="px-4 py-3 text-xs text-muted">{c.skills.join(', ')}</td>
                    <td className="px-4 py-3 text-sm font-bold text-charcoal">{c.assessment}%</td>
                    <td className="px-4 py-3 text-sm text-charcoal">{c.projects}</td>
                    <td className="px-6 py-3 flex gap-1.5">
                      <Button size="sm" variant="outline" onClick={() => setSelected(c)}>View</Button>
                      <Button size="sm" variant="ghost">Resume</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name} description={selected ? `${selected.branch} • ${selected.college}` : ''} size="lg">
        {selected && (
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-4">
              <img src={selected.avatar} alt="" className="h-16 w-16 rounded-full border border-border" />
              <div>
                <p className="text-lg font-bold text-charcoal">{selected.name} — <span className="text-success">{selected.match}% Match</span></p>
                <p className="text-xs text-muted">Assessment {selected.assessment}% • {selected.projects} projects • CGPA {selected.cgpa}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">{selected.skills.map((s) => <span key={s} className="rounded-full bg-sage px-2.5 py-1 text-xs font-semibold text-primary">{s}</span>)}</div>
              </div>
            </div>
            <div className="rounded-xl bg-success/5 border border-success/20 p-3">
              <p className="font-bold text-success text-xs uppercase tracking-widest">Why this candidate matches</p>
              <ul className="mt-2 space-y-1">{selected.strong.map((s) => <li key={s} className="text-sm text-charcoal">✓ {s}</li>)}</ul>
            </div>
            <div className="rounded-xl bg-danger/5 border border-danger/20 p-3">
              <p className="font-bold text-danger text-xs uppercase tracking-widest">Needs improvement</p>
              <ul className="mt-2 space-y-1">{selected.improve.map((s) => <li key={s} className="text-sm text-muted">• {s}</li>)}</ul>
            </div>
            <div className="flex gap-2">
              <Button>Shortlist</Button>
              <Button variant="outline">Download Resume</Button>
              <Button variant="ghost" onClick={() => setSelected(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
