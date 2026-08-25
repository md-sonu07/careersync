import { useState, useEffect } from 'react'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Badge from '../../components/ui/Badge'
import AppIcon from '../../components/ui/AppIcon'
import { profileApi } from '../../api/profile.api'

export default function InstituteStudents() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    let isMounted = true
    profileApi.getCandidates()
      .then((data) => {
        if (isMounted) {
          const list = Array.isArray(data) ? data : data?.results || []
          setStudents(list)
        }
      })
      .catch(() => {
        if (isMounted) setStudents([])
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })
    return () => { isMounted = false }
  }, [])

  const filtered = students.filter((s) => {
    const name = s.user?.full_name || `${s.user?.first_name || ''} ${s.user?.last_name || ''}`.trim() || s.full_name || ''
    const email = s.user?.email || s.email || ''
    if (search && !name.toLowerCase().includes(search.toLowerCase()) && !email.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Enrolled Students Directory</h1>
          <p className="text-sm text-muted mt-1">Live enrolled students linked to your academic institution.</p>
        </div>
        <Badge variant="default">{students.length} Total Enrolled</Badge>
      </div>

      <Card className="!p-4">
        <div className="max-w-md">
          <Input placeholder="Filter students by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </Card>

      <Card className="!p-0 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-sm text-muted">Loading student directory…</div>
        ) : filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-background/60">
                  <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-muted">Student</th>
                  <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-widest text-muted">Contact Email</th>
                  <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-widest text-muted">Phone</th>
                  <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-muted">Verified Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, idx) => {
                  const name = s.user?.full_name || `${s.user?.first_name || ''} ${s.user?.last_name || ''}`.trim() || `Student ${idx + 1}`
                  const email = s.user?.email || s.email || '—'
                  const phone = s.phone || '—'
                  return (
                    <tr key={s.id || idx} className="border-b border-border last:border-0 hover:bg-background/40 transition-colors">
                      <td className="px-6 py-3.5 flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                          {name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-semibold text-charcoal">{name}</span>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-muted">{email}</td>
                      <td className="px-4 py-3.5 text-sm text-muted">{phone}</td>
                      <td className="px-6 py-3.5">
                        <Badge variant={s.user?.is_verified ? "success" : "default"}>
                          {s.user?.is_verified ? "Verified" : "Registered"}
                        </Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3">
              <AppIcon name="school" className="text-2xl" />
            </div>
            <h3 className="text-base font-bold text-charcoal">No Students Enrolled Yet</h3>
            <p className="text-xs text-muted max-w-sm mx-auto mt-1">
              Students who register with your institute will automatically appear in this live directory.
            </p>
          </div>
        )}
      </Card>
    </div>
  )
}
