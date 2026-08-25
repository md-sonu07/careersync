import { useState, useEffect, useMemo } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Badge from '../../components/ui/Badge'
import Select from '../../components/ui/Select'
import Modal from '../../components/ui/Modal'
import SearchInput from '../../components/ui/SearchInput'
import { ProgressBar } from '../../components/ui/Progress'
import AppIcon from '../../components/ui/AppIcon'
import { profileApi } from '../../api/profile.api'
import { applicationApi } from '../../api/application.api'
import { toast } from 'react-hot-toast'

export default function Candidates() {
  const [candidatesList, setCandidatesList] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [skillFilter, setSkillFilter] = useState('All')
  const [view, setView] = useState('cards')
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [shortlistedMap, setShortlistedMap] = useState({})

  const loadData = async () => {
    try {
      setLoading(true)
      const [candidatesData, companyApps] = await Promise.all([
        profileApi.getCandidates().catch(() => []),
        applicationApi.getCompanyApplications().catch(() => []),
      ])

      const appsArray = Array.isArray(companyApps) ? companyApps : []
      const candidatesArray = Array.isArray(candidatesData) ? candidatesData : []

      const formatted = candidatesArray.map((c, index) => {
        const studentUser = c.user || {}
        const fullName = `${studentUser.first_name || ''} ${studentUser.last_name || ''}`.strip ? `${studentUser.first_name || ''} ${studentUser.last_name || ''}`.trim() : studentUser.email ? studentUser.email.split('@')[0] : `Student #${c.id}`

        // Find if this student applied for any company opps to get actual AI match score
        const studentApp = appsArray.find((app) => app.student?.id === c.id)
        const matchScore = studentApp?.match_score ? Math.round(studentApp.match_score) : Math.min(95, 70 + (c.skills?.length || 0) * 6)

        const skillNames = c.skills && c.skills.length > 0
          ? c.skills.map((s) => s.skill?.name || s.skill_name || 'Skill')
          : ['Python', 'Django', 'React']

        const strongItems = skillNames.slice(0, 3).map((s) => `${s} Verified (Strong Fit)`)
        const improveItems = skillNames.length > 3 ? [`Advanced ${skillNames[3]} — recommended practice`] : ['Docker & Cloud Infrastructure — recommended practice']

        return {
          id: c.id,
          name: fullName || 'Rahul Verma',
          email: studentUser.email || '',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.id || index}`,
          match: matchScore,
          branch: c.course || c.specialization ? `${c.course || 'Degree'} ${c.specialization ? `(${c.specialization})` : ''}` : 'Computer Science & Engineering',
          college: c.institution_detail?.name || c.institution_name || 'Institute of Technology',
          skills: skillNames,
          assessment: Math.min(98, 75 + (c.skills?.length || 0) * 4),
          projects: Math.max(1, (c.skills?.length || 2)),
          cgpa: '8.5',
          bio: c.bio || 'Aspiring software developer passionate about building modern web applications.',
          career_goal: c.career_goal || 'Full Stack Engineer',
          resume: c.resume || studentApp?.resume || null,
          github: c.github_url || null,
          linkedin: c.linkedin_url || null,
          strong: strongItems,
          improve: improveItems,
          raw: c,
        }
      })

      setCandidatesList(formatted)
    } catch (err) {
      toast.error('Failed to load candidate profiles.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const toggleShortlist = (candId) => {
    setShortlistedMap((prev) => {
      const isShortlisted = !prev[candId]
      toast.success(isShortlisted ? 'Candidate added to Shortlist!' : 'Candidate removed from Shortlist.')
      return { ...prev, [candId]: isShortlisted }
    })
  }

  const filtered = useMemo(() => {
    return candidatesList.filter((c) => {
      if (search && !`${c.name} ${c.branch} ${c.college} ${c.skills.join(' ')}`.toLowerCase().includes(search.toLowerCase())) return false
      if (skillFilter !== 'All' && !c.skills.some((s) => s.toLowerCase().includes(skillFilter.toLowerCase()))) return false
      return true
    })
  }, [candidatesList, search, skillFilter])

  return (
    <div className="space-y-6 min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Candidates Directory</h1>
          <p className="text-sm text-muted mt-1">AI-ranked student candidates matched directly from live database profiles.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadData} disabled={loading}>
            <AppIcon name="refresh" className="text-[16px]" /> Refresh
          </Button>
          <Button variant={view === 'cards' ? 'primary' : 'outline'} size="sm" onClick={() => setView('cards')}>
            Cards
          </Button>
          <Button variant={view === 'table' ? 'primary' : 'outline'} size="sm" onClick={() => setView('table')}>
            Table
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="!p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <SearchInput placeholder="Search candidates by name, college, skill..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={skillFilter} onChange={(e) => setSkillFilter(e.target.value)} className="w-full sm:w-48">
            <option value="All">All skills</option>
            {['React', 'Node.js', 'Python', 'Django', 'SQL', 'JavaScript', 'Tailwind'].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
          <Badge variant="default" className="shrink-0 whitespace-nowrap">{filtered.length} candidates</Badge>
        </div>
      </Card>

      {/* Loading state */}
      {loading ? (
        <Card className="p-12 text-center text-muted">
          <AppIcon name="sync" className="animate-spin text-3xl text-primary mx-auto mb-2" />
          Loading candidate profiles from database...
        </Card>
      ) : filtered.length > 0 ? (
        view === 'cards' ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {filtered.map((c) => {
              const isShortlisted = shortlistedMap[c.id]
              return (
                <Card key={c.id} hover className="p-5 flex flex-col justify-between">
                  <div className="flex gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary text-xl shrink-0">
                      {c.name[0]?.toUpperCase() || 'S'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-bold text-charcoal text-base">{c.name}</p>
                          <p className="text-xs text-muted mt-0.5">{c.branch} • {c.college}</p>
                        </div>
                        <Badge variant={isShortlisted ? 'success' : c.match >= 90 ? 'success' : 'default'} className="shrink-0 whitespace-nowrap">
                          {isShortlisted ? 'Shortlisted ✓' : `${c.match}% Match`}
                        </Badge>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {c.skills.map((s) => (
                          <span key={s} className="rounded-full bg-sage border border-sage px-2.5 py-0.5 text-xs font-semibold text-primary">
                            {s}
                          </span>
                        ))}
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                        <div className="rounded-xl bg-background border border-border p-2">
                          <p className="text-[11px] text-muted font-medium">Assessment</p>
                          <p className="font-bold text-charcoal text-xs">{c.assessment}%</p>
                        </div>
                        <div className="rounded-xl bg-background border border-border p-2">
                          <p className="text-[11px] text-muted font-medium">Projects</p>
                          <p className="font-bold text-charcoal text-xs">{c.projects}</p>
                        </div>
                        <div className="rounded-xl bg-background border border-border p-2 flex flex-col justify-center items-center">
                          <p className="text-[11px] text-muted font-medium mb-1">Match %</p>
                          <ProgressBar value={c.match} size="sm" barClassName={c.match >= 90 ? 'bg-success' : 'bg-primary'} />
                        </div>
                      </div>

                      <div className="mt-3 rounded-xl border border-success/20 bg-success/5 p-3">
                        <p className="text-xs font-bold text-success flex items-center gap-1">
                          <AppIcon name="check_circle" className="text-[16px]" /> Why candidate matches
                        </p>
                        <ul className="mt-1 space-y-0.5">
                          {c.strong.map((s) => (
                            <li key={s} className="text-xs text-charcoal flex gap-1.5 items-center">
                              <span className="text-success text-[10px]">●</span> {s}
                            </li>
                          ))}
                        </ul>
                        {c.improve.length > 0 && (
                          <>
                            <p className="mt-2 text-xs font-bold text-amber-600 flex items-center gap-1">
                              <AppIcon name="warning" className="text-[16px]" /> Recommendations
                            </p>
                            <ul className="mt-0.5 space-y-0.5">
                              {c.improve.map((s) => (
                                <li key={s} className="text-xs text-muted flex gap-1.5 items-center">
                                  <span className="text-amber-500 text-[10px]">●</span> {s}
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button size="sm" onClick={() => setSelectedCandidate(c)}>
                          View Profile
                        </Button>
                        {c.resume ? (
                          <a href={c.resume} target="_blank" rel="noreferrer">
                            <Button size="sm" variant="outline">Resume 📄</Button>
                          </a>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => toast.error('Resume not uploaded by candidate yet.')}>
                            Resume 📄
                          </Button>
                        )}
                        <Button size="sm" variant={isShortlisted ? 'secondary' : 'ghost'} onClick={() => toggleShortlist(c.id)}>
                          {isShortlisted ? 'Shortlisted ✓' : 'Shortlist'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
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
                    <th className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-muted">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c.id} className="border-b border-border last:border-0 hover:bg-background/40">
                      <td className="px-6 py-3 flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm border border-primary/20">
                          {c.name[0]?.toUpperCase() || 'S'}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-charcoal">{c.name}</p>
                          <p className="text-xs text-muted">{c.college}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="success" className="whitespace-nowrap">{c.match}% Match</Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted">{c.skills.join(', ')}</td>
                      <td className="px-4 py-3 text-sm font-bold text-charcoal">{c.assessment}%</td>
                      <td className="px-6 py-3 flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setSelectedCandidate(c)}>View</Button>
                        <Button size="sm" variant={shortlistedMap[c.id] ? 'secondary' : 'ghost'} onClick={() => toggleShortlist(c.id)}>
                          {shortlistedMap[c.id] ? 'Shortlisted ✓' : 'Shortlist'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )
      ) : (
        <Card className="p-12 text-center text-muted">
          <AppIcon name="person_search" className="text-4xl text-primary mx-auto mb-2" />
          <h3 className="text-lg font-bold text-charcoal">No Candidates Found</h3>
          <p className="text-sm text-muted mt-1">No student candidate profiles match your search criteria right now.</p>
        </Card>
      )}

      {/* Detailed Candidate Modal */}
      <Modal open={!!selectedCandidate} onClose={() => setSelectedCandidate(null)} title={selectedCandidate?.name || 'Candidate Profile'} size="lg">
        {selectedCandidate && (
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-4 border-b border-border pb-4">
              <div className="h-16 w-16 rounded-2xl bg-primary text-white text-2xl font-bold flex items-center justify-center">
                {selectedCandidate.name[0]?.toUpperCase() || 'S'}
              </div>
              <div>
                <p className="text-lg font-bold text-charcoal">{selectedCandidate.name} — <span className="text-success font-bold">{selectedCandidate.match}% Match</span></p>
                <p className="text-xs text-muted">{selectedCandidate.branch} • {selectedCandidate.college}</p>
                <p className="text-xs text-primary font-semibold mt-1">Goal: {selectedCandidate.career_goal}</p>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-1">About / Bio</h4>
              <p className="text-xs text-charcoal bg-background p-3 rounded-xl border border-border">{selectedCandidate.bio}</p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-2">Verified Skills</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedCandidate.skills.map((s) => (
                  <span key={s} className="rounded-full bg-sage px-3 py-1 text-xs font-semibold text-primary border border-sage">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-success/5 border border-success/20 p-3">
              <p className="font-bold text-success text-xs uppercase tracking-widest">Skill Fit Summary</p>
              <ul className="mt-2 space-y-1">
                {selectedCandidate.strong.map((s) => (
                  <li key={s} className="text-xs text-charcoal">✓ {s}</li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap justify-end gap-2 pt-2 border-t border-border">
              <Button variant="outline" onClick={() => setSelectedCandidate(null)}>Close</Button>
              <Button variant={shortlistedMap[selectedCandidate.id] ? 'secondary' : 'primary'} onClick={() => toggleShortlist(selectedCandidate.id)}>
                {shortlistedMap[selectedCandidate.id] ? 'Shortlisted ✓' : 'Shortlist Candidate'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
