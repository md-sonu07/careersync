import { useState } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import Textarea from '../../components/ui/Textarea'
import AppIcon from '../../components/ui/AppIcon';

const STATUSES = ['Applied', 'Screening', 'Shortlisted', 'Interview', 'Selected', 'Rejected']

const initialApps = [
  { id: 'A1', name: 'Rahul Sharma', role: 'Frontend Intern', avatar: 'https://i.pravatar.cc/150?img=12', match: 94, status: 'Applied', date: '2026-02-12', skills: ['React', 'JS'], notes: '' },
  { id: 'A2', name: 'Aman Verma', role: 'Frontend Intern', avatar: 'https://i.pravatar.cc/150?img=15', match: 89, status: 'Screening', date: '2026-02-11', skills: ['React', 'TS'], notes: 'Good comms' },
  { id: 'A3', name: 'Priya Nair', role: 'Backend Intern', avatar: 'https://i.pravatar.cc/150?img=32', match: 86, status: 'Shortlisted', date: '2026-02-10', skills: ['Python', 'SQL'], notes: '' },
  { id: 'A4', name: 'Sara Khan', role: 'Full Stack', avatar: 'https://i.pravatar.cc/150?img=25', match: 78, status: 'Interview', date: '2026-02-09', skills: ['Java', 'SQL'], notes: 'Interview on 15th' },
  { id: 'A5', name: 'Dev Patel', role: 'Frontend Intern', avatar: 'https://i.pravatar.cc/150?img=33', match: 72, status: 'Applied', date: '2026-02-12', skills: ['JS', 'CSS'], notes: '' },
  { id: 'A6', name: 'Neha Gupta', role: 'Backend Intern', avatar: 'https://i.pravatar.cc/150?img=26', match: 91, status: 'Selected', date: '2026-02-08', skills: ['Node', 'Mongo'], notes: 'Offer sent' },
  { id: 'A7', name: 'Arjun Mehta', role: 'Full Stack', avatar: 'https://i.pravatar.cc/150?img=14', match: 65, status: 'Rejected', date: '2026-02-07', skills: ['React'], notes: 'Skill gap' },
  { id: 'A8', name: 'Kiran Rao', role: 'Frontend Intern', avatar: 'https://i.pravatar.cc/150?img=20', match: 88, status: 'Shortlisted', date: '2026-02-10', skills: ['React', 'Tailwind'], notes: '' },
]

const statusColor = {
  Applied: 'bg-slate-100 text-slate-700 border-slate-200',
  Screening: 'bg-amber-100 text-amber-800 border-amber-200',
  Shortlisted: 'bg-primary/10 text-primary border-primary/20',
  Interview: 'bg-accent/10 text-accent border-accent/20',
  Selected: 'bg-success/10 text-success border-success/20',
  Rejected: 'bg-danger/10 text-danger border-danger/20',
}

function AppCard({ app, onStatusChange, onNotes, onCompare }) {
  return (
    <div className="rounded-xl border border-border bg-white p-3 shadow-subtle space-y-2 hover:shadow-soft transition-shadow">
      <div className="flex gap-2.5">
        <img src={app.avatar} alt="" className="h-9 w-9 rounded-full border border-border shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-charcoal truncate">{app.name}</p>
          <p className="text-xs text-muted truncate">{app.role} • {app.date}</p>
        </div>
        <span className="rounded-full bg-sage px-2 py-0.5 text-xs font-bold text-primary shrink-0 h-fit">{app.match}%</span>
      </div>
      <div className="flex flex-wrap gap-1">{app.skills.map((s) => <span key={s} className="rounded-full bg-background border border-border px-2 py-0.5 text-[11px] font-medium text-charcoal">{s}</span>)}</div>
      <div className="flex items-center gap-2">
        <select
          value={app.status}
          onChange={(e) => onStatusChange(app.id, e.target.value)}
          className={`flex-1 rounded-lg border px-2 py-1.5 text-xs font-bold ${statusColor[app.status]}`}
        >
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <button onClick={() => onCompare(app)} className="rounded-lg border border-border bg-white p-1.5 text-muted hover:text-charcoal" title="Compare resume"><AppIcon name="compare" className="text-[16px]" /></button>
      </div>
      {app.notes && <p className="rounded-lg bg-amber-50 border border-amber-200 px-2 py-1 text-xs text-amber-800">📝 {app.notes}</p>}
      <button onClick={() => onNotes(app)} className="text-xs font-semibold text-primary hover:underline">+ Notes / Resume</button>
    </div>
  )
}

export default function Applications() {
  const [apps, setApps] = useState(initialApps)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [roleFilter, setRoleFilter] = useState('All')
  const [compare, setCompare] = useState(null)
  const [noteTarget, setNoteTarget] = useState(null)
  const [noteText, setNoteText] = useState('')
  const [compareList, setCompareList] = useState([])

  const filtered = apps.filter((a) => {
    if (search && !a.name.toLowerCase().includes(search.toLowerCase()) && !a.role.toLowerCase().includes(search.toLowerCase())) return false
    if (statusFilter !== 'All' && a.status !== statusFilter) return false
    if (roleFilter !== 'All' && a.role !== roleFilter) return false
    return true
  })

  const handleStatusChange = (id, status) => setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)))

  const openNotes = (app) => { setNoteTarget(app); setNoteText(app.notes || '') }
  const saveNote = () => {
    if (noteTarget) { setApps((prev) => prev.map((a) => (a.id === noteTarget.id ? { ...a, notes: noteText } : a))); setNoteTarget(null) }
  }

  const toggleCompare = (app) => {
    setCompareList((prev) => (prev.find((p) => p.id === app.id) ? prev.filter((p) => p.id !== app.id) : prev.length < 2 ? [...prev, app] : [prev[1], app]))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Applications</h1>
          <p className="text-sm text-muted mt-1">Kanban pipeline — drag-free status change, notes, resume compare</p>
        </div>
        <Badge variant="default">{filtered.length} applications</Badge>
      </div>

      <Card className="!p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1"><Input placeholder="Search by name or role..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full sm:w-40">
            <option value="All">All statuses</option>{STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
          <Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="w-full sm:w-40">
            <option value="All">All roles</option><option>Frontend Intern</option><option>Backend Intern</option><option>Full Stack</option>
          </Select>
        </div>
        {compareList.length > 0 && (
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-sage border border-border p-3">
            <p className="text-sm font-semibold text-primary">Compare: {compareList.map((c) => c.name).join(' vs ')}</p>
            <Button size="sm" className="ml-auto" onClick={() => setCompare({ list: compareList })}>Compare Resumes</Button>
            <Button size="sm" variant="ghost" onClick={() => setCompareList([])}>Clear</Button>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {STATUSES.map((status) => {
          const colApps = filtered.filter((a) => a.status === status)
          return (
            <div key={status} className="rounded-2xl border border-border bg-background/50 p-3">
              <div className="flex items-center gap-2 mb-3">
                <span className={`h-2 w-2 rounded-full ${status === 'Selected' ? 'bg-success' : status === 'Rejected' ? 'bg-danger' : status === 'Shortlisted' ? 'bg-primary' : 'bg-accent'}`} />
                <h3 className="text-xs font-bold uppercase tracking-widest text-charcoal">{status}</h3>
                <span className="ml-auto rounded-full bg-white border border-border px-2 py-0.5 text-xs font-bold text-muted">{colApps.length}</span>
              </div>
              <div className="space-y-3 min-h-[200px]">
                {colApps.map((app) => (
                  <div key={app.id} onClick={() => toggleCompare(app)} className={`cursor-pointer rounded-xl ${compareList.find((c) => c.id === app.id) ? 'ring-2 ring-primary' : ''}`}>
                    <AppCard app={app} onStatusChange={handleStatusChange} onNotes={openNotes} onCompare={toggleCompare} />
                  </div>
                ))}
                {colApps.length === 0 && <p className="text-center text-xs text-muted py-8 border border-dashed border-border rounded-xl bg-white">No applications</p>}
              </div>
            </div>
          )
        })}
      </div>

      <Modal open={!!noteTarget} onClose={() => setNoteTarget(null)} title={`Notes — ${noteTarget?.name}`} size="md">
        <div className="space-y-4">
          <Textarea label="Internal notes" placeholder="Add interview feedback, next steps..." value={noteText} onChange={(e) => setNoteText(e.target.value)} rows={4} />
          <div className="flex gap-2">
            <Button onClick={saveNote}>Save Note</Button>
            <Button variant="outline" onClick={() => setNoteTarget(null)}>Cancel</Button>
            <Button variant="ghost" onClick={() => { if (noteTarget) window.open('#', '_blank') }}>View Resume →</Button>
          </div>
        </div>
      </Modal>

      <Modal open={!!compare} onClose={() => setCompare(null)} title="Resume Compare" size="xl">
        {compare?.list && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {compare.list.map((c) => (
              <div key={c.id} className="rounded-xl border border-border bg-white p-4">
                <div className="flex gap-3">
                  <img src={c.avatar} alt="" className="h-12 w-12 rounded-full border border-border" />
                  <div><p className="font-bold text-charcoal">{c.name}</p><p className="text-xs text-muted">{c.role} • {c.match}% match</p></div>
                </div>
                <div className="mt-3 space-y-2 text-sm">
                  <p><span className="font-bold text-muted">Skills:</span> {c.skills.join(', ')}</p>
                  <p><span className="font-bold text-muted">Status:</span> <span className={`rounded-full px-2 py-0.5 text-xs font-bold border ${statusColor[c.status]}`}>{c.status}</span></p>
                  <p><span className="font-bold text-muted">Notes:</span> {c.notes || '—'}</p>
                  <div className="rounded-lg bg-background border border-border p-3 text-xs text-muted">Resume preview placeholder — PDF viewer would render here.</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  )
}
