import { useState, useEffect } from 'react'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Pagination from '../../components/ui/Pagination'
import AppIcon from '../../components/ui/AppIcon'
import { authApi } from '../../api/auth.api'
import { toast } from 'react-hot-toast'

export default function UsersPage({ defaultRole = 'All' }) {
  const [usersList, setUsersList] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState(defaultRole)
  const [page, setPage] = useState(1)
  const pageSize = 8

  useEffect(() => {
    setRoleFilter(defaultRole)
  }, [defaultRole])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const data = await authApi.getUsers(defaultRole !== 'All' ? { role: defaultRole } : {})
      if (Array.isArray(data)) {
        setUsersList(data)
      } else if (data && Array.isArray(data.results)) {
        setUsersList(data.results)
      } else {
        setUsersList([])
      }
    } catch {
      toast.error('Failed to load platform users.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [defaultRole])

  const handleToggleActive = async (userId, currentActive) => {
    try {
      const updated = await authApi.toggleUserActive(userId)
      toast.success(updated.is_active ? 'User account activated/unblocked' : 'User account blocked')
      setUsersList((prev) => prev.map((u) => (u.id === userId ? { ...u, is_active: updated.is_active } : u)))
    } catch {
      toast.error('Failed to update user status.')
    }
  }

  const filtered = usersList.filter((u) => {
    const fullName = `${u.first_name || ''} ${u.last_name || ''} ${u.full_name || ''} ${u.email || ''}`.toLowerCase()
    if (search && !fullName.includes(search.toLowerCase())) return false
    if (roleFilter !== 'All' && (u.role || '').toLowerCase() !== roleFilter.toLowerCase()) return false
    return true
  })

  const totalPages = Math.ceil(filtered.length / pageSize) || 1
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)

  const getPageInfo = () => {
    const rf = (roleFilter || 'All').toLowerCase()
    if (rf === 'student') {
      return {
        title: 'Students Directory',
        subtitle: 'All registered student candidates — live Django database feed',
      }
    }
    if (rf === 'industry') {
      return {
        title: 'Industry Partners Directory',
        subtitle: 'All registered companies & industry recruiters — live Django database feed',
      }
    }
    if (rf === 'academician') {
      return {
        title: 'Institutions & Academicians',
        subtitle: 'All registered colleges & academician accounts — live Django database feed',
      }
    }
    if (rf === 'admin') {
      return {
        title: 'Platform Administrators',
        subtitle: 'System administrators & governance accounts — live Django database feed',
      }
    }
    return {
      title: 'Users Directory',
      subtitle: 'All registered platform users — live Django database feed',
    }
  }

  const pageInfo = getPageInfo()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">{pageInfo.title}</h1>
          <p className="text-sm text-muted">{pageInfo.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadUsers} disabled={loading}>
            <AppIcon name="refresh" className="text-[16px]" /> Refresh
          </Button>
          <Badge variant="default">{filtered.length} Users</Badge>
        </div>
      </div>

      <Card className="!p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <Input
              placeholder="Search users by name or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
            />
          </div>
          <Select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value)
              setPage(1)
            }}
            className="w-full sm:w-44"
          >
            <option value="All">All Roles</option>
            <option value="student">Student</option>
            <option value="industry">Industry</option>
            <option value="academician">Academician</option>
            <option value="admin">Admin</option>
          </Select>
        </div>
        <div className="mt-3 flex gap-1.5 flex-wrap">
          {['All', 'Student', 'Industry', 'Academician', 'Admin'].map((r) => (
            <button
              key={r}
              onClick={() => {
                setRoleFilter(r)
                setPage(1)
              }}
              className={`rounded-full border px-3 py-1 text-xs font-bold transition-all ${
                roleFilter.toLowerCase() === r.toLowerCase()
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white border-border text-muted hover:bg-background'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </Card>

      <Card className="!p-0 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-muted">
            <AppIcon name="sync" className="animate-spin text-3xl text-primary mx-auto mb-2" />
            Loading registered users from database...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-background/60">
                  <th className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-muted">User</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-muted">Role</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-muted">Status</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-muted">Joined</th>
                  <th className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((u) => {
                  const displayName = `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.full_name || u.email.split('@')[0]
                  const roleUpper = (u.role || 'STUDENT').toUpperCase()
                  const isBlocked = !u.is_active

                  return (
                    <tr key={u.id} className="border-b border-border last:border-0 hover:bg-background/40">
                      <td className="px-6 py-3 flex items-center gap-3">
                        {u.profile_picture ? (
                          <img src={u.profile_picture} alt={displayName} className="h-9 w-9 rounded-full object-cover border border-primary/20 shrink-0" />
                        ) : (
                          <div className="h-9 w-9 rounded-full bg-slate-900/10 text-slate-900 font-bold flex items-center justify-center text-xs shrink-0">
                            {displayName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-charcoal">{displayName}</p>
                          <p className="text-xs text-muted">{u.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={roleUpper === 'ADMIN' ? 'default' : 'muted'}
                          className={roleUpper === 'ADMIN' ? '!bg-slate-900 !text-white' : ''}
                        >
                          {roleUpper}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                            !isBlocked ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                          }`}
                        >
                          {!isBlocked ? 'Active' : 'Blocked'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted">
                        {u.created_at ? u.created_at.split('T')[0] : '—'}
                      </td>
                      <td className="px-6 py-3 flex gap-1.5">
                        <Button
                          size="sm"
                          variant={isBlocked ? 'success' : 'ghost'}
                          onClick={() => handleToggleActive(u.id, u.is_active)}
                        >
                          {isBlocked ? 'Unblock' : 'Block'}
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
        {!loading && filtered.length === 0 && <p className="text-center text-sm text-muted py-10">No users found matching filters.</p>}
        {!loading && filtered.length > 0 && (
          <div className="flex justify-center border-t border-border p-4">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </Card>
    </div>
  )
}
