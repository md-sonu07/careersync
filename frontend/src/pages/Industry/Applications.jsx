import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import Textarea from '../../components/ui/Textarea'
import SearchInput from '../../components/ui/SearchInput'
import AppIcon from '../../components/ui/AppIcon'
import { applicationApi } from '../../api/application.api'
import { toast } from 'react-hot-toast'

const STATUSES = ['Applied', 'Screening', 'Shortlisted', 'Interview', 'Selected', 'Rejected']

const mapBackendToDisplay = (st) => {
  if (!st) return 'Applied'
  const lower = st.toLowerCase()
  if (lower === 'under_review') return 'Screening'
  if (lower === 'applied') return 'Applied'
  if (lower === 'shortlisted') return 'Shortlisted'
  if (lower === 'interview') return 'Interview'
  if (lower === 'selected') return 'Selected'
  if (lower === 'rejected') return 'Rejected'
  return st.charAt(0).toUpperCase() + st.slice(1)
}

const statusColor = {
  Applied: 'bg-slate-100 text-slate-800 border-slate-300',
  Screening: 'bg-amber-100 text-amber-900 border-amber-300',
  Shortlisted: 'bg-primary/10 text-primary border-primary/20',
  Interview: 'bg-purple-100 text-purple-900 border-purple-300',
  Selected: 'bg-green-100 text-green-800 border-green-300',
  Rejected: 'bg-red-100 text-red-800 border-red-300',
}

function AppCard({ app, onStatusChange, onNotes, onCompare, isSelectedForCompare }) {
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(app.name || 'Student')}&background=0D9488&color=ffffff&bold=true`

  return (
    <div
      className={`rounded-2xl border bg-white p-4 shadow-sm hover:shadow-md transition-all space-y-3 ${
        isSelectedForCompare ? 'border-primary ring-2 ring-primary/20' : 'border-border'
      }`}
    >
      {/* Header with Avatar & Match Badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={avatarUrl}
            alt={app.name}
            className="h-10 w-10 rounded-xl object-cover border border-primary/20 shrink-0"
          />
          <div className="min-w-0">
            <h4 className="font-bold text-sm text-charcoal truncate leading-tight">{app.name}</h4>
            <p className="text-xs text-muted truncate mt-0.5">{app.role}</p>
          </div>
        </div>
        <Badge variant={app.match >= 85 ? 'success' : 'default'} className="shrink-0 whitespace-nowrap text-xs">
          {app.match}% Match
        </Badge>
      </div>

      {/* Applied Date & Cover Letter Snippet */}
      <div className="text-xs text-muted">
        <span>Applied: <strong className="text-charcoal font-semibold">{app.date}</strong></span>
      </div>

      {/* Verified Skill Badges */}
      {app.skills && app.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {app.skills.map((s) => (
            <span key={s} className="rounded-full bg-sage border border-sage px-2 py-0.5 text-[11px] font-semibold text-primary">
              {s}
            </span>
          ))}
        </div>
      )}

      {/* Status Selection Dropdown */}
      <div className="pt-2 border-t border-border">
        <label className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1 block">Update Status</label>
        <select
          value={app.status}
          onChange={(e) => onStatusChange(app.id, e.target.value)}
          className={`w-full rounded-xl border px-3 py-2 text-xs font-bold transition-colors outline-none cursor-pointer ${
            statusColor[app.status] || 'bg-white border-border'
          }`}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Notes Display if any */}
      {app.notes && (
        <p className="rounded-xl bg-amber-50 border border-amber-200 p-2.5 text-xs text-amber-900 leading-snug">
          📝 <strong>Notes:</strong> {app.notes}
        </p>
      )}

      {/* Action Links */}
      <div className="flex items-center justify-between text-xs pt-1">
        <button onClick={() => onNotes(app)} className="font-semibold text-primary hover:underline flex items-center gap-1">
          <AppIcon name="edit_note" className="text-[14px]" /> + Notes
        </button>
        <button
          onClick={() => onCompare(app)}
          className={`font-semibold text-xs flex items-center gap-1 ${
            isSelectedForCompare ? 'text-primary' : 'text-muted hover:text-charcoal'
          }`}
        >
          <AppIcon name="compare_arrows" className="text-[14px]" /> {isSelectedForCompare ? 'Selected ✓' : 'Compare'}
        </button>
      </div>
    </div>
  )
}

export default function Applications() {
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [roleFilter, setRoleFilter] = useState('All')
  const [viewMode, setViewMode] = useState('kanban') // 'kanban' | 'list'

  const [compare, setCompare] = useState(null)
  const [noteTarget, setNoteTarget] = useState(null)
  const [noteText, setNoteText] = useState('')
  const [compareList, setCompareList] = useState([])

  const loadApplications = async () => {
    try {
      setLoading(true)
      const data = await applicationApi.getCompanyApplications()
      const rawList = Array.isArray(data) ? data : data?.results || []
      const formatted = rawList.map((a) => {
        const studentUser = a.student?.user || {}
        const studentName = `${studentUser.first_name || ''} ${studentUser.last_name || ''}`.trim() || studentUser.email?.split('@')[0] || a.student_name || 'Candidate'
        return {
          id: a.id,
          name: studentName,
          email: studentUser.email || '',
          role: a.opportunity?.title || a.opportunity_title || 'Opportunity',
          match: a.match_score ? Math.round(a.match_score) : 85,
          status: mapBackendToDisplay(a.status),
          date: a.applied_at ? a.applied_at.split('T')[0] : 'Recent',
          skills: a.verified_skills || ['Python', 'Django', 'REST'],
          notes: a.remarks || '',
          resume: a.resume || a.student?.resume || null,
          coverLetter: a.cover_letter || '',
        }
      })
      setApps(formatted)
    } catch {
      setApps([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadApplications()
  }, [])

  const availableRoles = useMemo(() => {
    const rolesSet = new Set(apps.map((a) => a.role))
    return ['All', ...Array.from(rolesSet)]
  }, [apps])

  const filtered = useMemo(() => {
    return apps.filter((a) => {
      if (search && !`${a.name} ${a.role} ${a.skills.join(' ')}`.toLowerCase().includes(search.toLowerCase())) return false
      if (statusFilter !== 'All' && a.status !== statusFilter) return false
      if (roleFilter !== 'All' && a.role !== roleFilter) return false
      return true
    })
  }, [apps, search, statusFilter, roleFilter])

  const handleStatusChange = async (id, newDisplayStatus) => {
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status: newDisplayStatus } : a)))

    const statusMap = {
      Applied: 'applied',
      Screening: 'under_review',
      Shortlisted: 'shortlisted',
      Interview: 'interview',
      Selected: 'selected',
      Rejected: 'rejected',
    }
    const backendStatus = statusMap[newDisplayStatus] || newDisplayStatus.toLowerCase()

    try {
      await applicationApi.updateApplicationStatus(id, backendStatus)
      toast.success(`Application status updated to "${newDisplayStatus}"!`)
    } catch (err) {
      toast.error('Failed to save status: ' + (err.response?.data?.detail || err.message))
      loadApplications()
    }
  }

  const openNotes = (app) => { setNoteTarget(app); setNoteText(app.notes || '') }

  const saveNote = async () => {
    if (noteTarget) {
      const targetId = noteTarget.id
      const currentDisplayStatus = noteTarget.status
      const statusMap = {
        Applied: 'applied',
        Screening: 'under_review',
        Shortlisted: 'shortlisted',
        Interview: 'interview',
        Selected: 'selected',
        Rejected: 'rejected',
      }
      const backendStatus = statusMap[currentDisplayStatus] || currentDisplayStatus.toLowerCase()

      setApps((prev) => prev.map((a) => (a.id === targetId ? { ...a, notes: noteText } : a)))
      setNoteTarget(null)

      try {
        await applicationApi.updateApplicationStatus(targetId, backendStatus, noteText)
        toast.success('Notes saved to database successfully!')
      } catch (err) {
        toast.error('Failed to save notes: ' + (err.response?.data?.detail || err.message))
      }
    }
  }

  const toggleCompare = (app) => {
    setCompareList((prev) => (prev.find((p) => p.id === app.id) ? prev.filter((p) => p.id !== app.id) : prev.length < 2 ? [...prev, app] : [prev[1], app]))
  }

  return (
    <div className="space-y-6 min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Applications Pipeline</h1>
          <p className="text-sm text-muted mt-1">Review candidate applications, change pipeline status, add notes, and compare profiles.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadApplications} disabled={loading}>
            <AppIcon name="refresh" className="text-[16px]" /> Refresh
          </Button>
          <Button variant={viewMode === 'kanban' ? 'primary' : 'outline'} size="sm" onClick={() => setViewMode('kanban')}>
            Kanban Board
          </Button>
          <Button variant={viewMode === 'list' ? 'primary' : 'outline'} size="sm" onClick={() => setViewMode('list')}>
            List View
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="!p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <SearchInput placeholder="Search applicants by name or role..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full sm:w-44">
            <option value="All">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
          <Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="w-full sm:w-48">
            {availableRoles.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </Select>
          <Badge variant="default" className="shrink-0 whitespace-nowrap">{filtered.length} applications</Badge>
        </div>

        {compareList.length > 0 && (
          <div className="mt-3 flex items-center justify-between rounded-xl bg-sage border border-sage p-3 text-xs">
            <span className="font-semibold text-primary">Selected for compare: {compareList.map((c) => c.name).join(' vs ')}</span>
            <div className="flex items-center gap-2">
              <Button size="xs" variant="primary" onClick={() => setCompare({ list: compareList })}>Compare Resumes</Button>
              <Button size="xs" variant="ghost" onClick={() => setCompareList([])}>Clear</Button>
            </div>
          </div>
        )}
      </Card>

      {/* Main Content View */}
      {loading ? (
        <Card className="p-12 text-center text-muted">
          <AppIcon name="sync" className="animate-spin text-3xl text-primary mx-auto mb-2" />
          Loading applications from database...
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="p-12 text-center text-muted">
          <AppIcon name="assignment" className="text-4xl text-primary mx-auto mb-2" />
          <h3 className="text-lg font-bold text-charcoal">No Applications Received Yet</h3>
          <p className="text-sm text-muted mt-1">Applications submitted by candidates for your opportunities will appear here.</p>
        </Card>
      ) : viewMode === 'kanban' ? (
        /* Spacious Horizontal Scrollable Kanban Pipeline */
        <div className="flex gap-5 overflow-x-auto pb-6 pt-1">
          {STATUSES.map((status) => {
            const colApps = filtered.filter((a) => a.status === status)
            return (
              <div key={status} className="w-[320px] shrink-0 rounded-2xl border border-border bg-surface p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${status === 'Selected' ? 'bg-success' : status === 'Rejected' ? 'bg-red-500' : status === 'Shortlisted' ? 'bg-primary' : 'bg-amber-500'}`} />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal">{status}</h3>
                    </div>
                    <span className="rounded-full bg-white border border-border px-2.5 py-0.5 text-xs font-bold text-charcoal">{colApps.length}</span>
                  </div>

                  <div className="space-y-4">
                    {colApps.map((app) => (
                      <AppCard
                        key={app.id}
                        app={app}
                        onStatusChange={handleStatusChange}
                        onNotes={openNotes}
                        onCompare={toggleCompare}
                        isSelectedForCompare={Boolean(compareList.find((c) => c.id === app.id))}
                      />
                    ))}
                    {colApps.length === 0 && (
                      <div className="text-center text-xs text-muted py-10 border border-dashed border-border rounded-2xl bg-white/60">
                        No candidate in {status}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* List / Table View Mode */
        <Card className="!p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-background/60">
                  <th className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-muted">Candidate</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-muted">Applied Role</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-muted">AI Match</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-muted">Applied Date</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-muted">Status</th>
                  <th className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((app) => (
                  <tr key={app.id} className="border-b border-border last:border-0 hover:bg-background/40">
                    <td className="px-6 py-3 flex items-center gap-3">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(app.name)}&background=0D9488&color=ffffff&bold=true`}
                        alt={app.name}
                        className="h-10 w-10 rounded-xl object-cover border border-primary/20 shrink-0"
                      />
                      <div>
                        <p className="text-sm font-bold text-charcoal">{app.name}</p>
                        <p className="text-xs text-muted">{app.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-charcoal">{app.role}</td>
                    <td className="px-4 py-3">
                      <Badge variant="success" className="whitespace-nowrap">{app.match}% Match</Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted">{app.date}</td>
                    <td className="px-4 py-3">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        className={`rounded-xl border px-3 py-1.5 text-xs font-bold outline-none cursor-pointer ${
                          statusColor[app.status] || 'bg-white'
                        }`}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-3 flex gap-2">
                      <Button size="xs" variant="outline" onClick={() => openNotes(app)}>
                        Notes & Resume
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Notes & Application Detail Modal */}
      <Modal open={!!noteTarget} onClose={() => setNoteTarget(null)} title={`Application Details — ${noteTarget?.name}`} size="lg">
        {noteTarget && (
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-background p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(noteTarget.name)}&background=0D9488&color=ffffff&bold=true`}
                  alt={noteTarget.name}
                  className="h-12 w-12 rounded-xl object-cover border border-primary/20"
                />
                <div>
                  <h3 className="font-bold text-charcoal">{noteTarget.name}</h3>
                  <p className="text-xs text-muted">Role Applied: <strong>{noteTarget.role}</strong> | {noteTarget.date}</p>
                </div>
              </div>
              <Badge variant="success">{noteTarget.match}% Match</Badge>
            </div>

            {noteTarget.coverLetter && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-1">Cover Letter</h4>
                <p className="text-xs text-charcoal bg-background p-3 rounded-xl border border-border leading-relaxed">
                  "{noteTarget.coverLetter}"
                </p>
              </div>
            )}

            <Textarea
              label="Recruiter Internal Notes"
              placeholder="Add interview feedback, evaluation remarks, next steps..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              rows={4}
            />

            <div className="flex justify-between items-center pt-2">
              {noteTarget.resume ? (
                <a href={noteTarget.resume} target="_blank" rel="noreferrer">
                  <Button variant="outline" size="sm">Download Candidate Resume 📄</Button>
                </a>
              ) : (
                <Button variant="outline" size="sm" onClick={() => toast.error('Resume file not attached.')}>
                  No Resume Attached
                </Button>
              )}
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setNoteTarget(null)}>Cancel</Button>
                <Button variant="primary" onClick={saveNote}>Save Notes to Database</Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Resume Compare Modal */}
      <Modal open={!!compare} onClose={() => setCompare(null)} title="Candidate Resume Compare" size="xl">
        {compare?.list && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {compare.list.map((c) => (
              <div key={c.id} className="rounded-2xl border border-border bg-white p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=0D9488&color=ffffff&bold=true`}
                    alt={c.name}
                    className="h-12 w-12 rounded-xl object-cover border border-primary/20"
                  />
                  <div>
                    <h4 className="font-bold text-charcoal">{c.name}</h4>
                    <p className="text-xs text-muted">{c.role} • {c.match}% Match</p>
                  </div>
                </div>
                <div className="space-y-2 text-xs">
                  <p><strong className="text-muted">Verified Skills:</strong> {c.skills.join(', ')}</p>
                  <p><strong className="text-muted">Status:</strong> <span className={`rounded-full px-2.5 py-0.5 font-bold ${statusColor[c.status]}`}>{c.status}</span></p>
                  <p><strong className="text-muted">Notes:</strong> {c.notes || 'No notes added'}</p>
                  {c.coverLetter && <p><strong className="text-muted">Cover Letter:</strong> "{c.coverLetter}"</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  )
}

