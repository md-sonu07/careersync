import { useState } from 'react'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Pagination from '../../components/ui/Pagination'

const users = [
  { id: 1, name: 'Rahul Sharma', email: 'rahul@example.com', role: 'Student', college: 'DTU', status: 'Active', joined: '2025-08-12' },
  { id: 2, name: 'TechNova Pvt Ltd', email: 'hiring@technova.com', role: 'Industry', college: '—', status: 'Verified', joined: '2025-09-01' },
  { id: 3, name: 'Dr. Anjali Mehta', email: 'anjali@dtu.ac.in', role: 'Academician', college: 'DTU', status: 'Active', joined: '2025-07-20' },
  { id: 4, name: 'Priya Nair', email: 'priya@example.com', role: 'Student', college: 'IGDTUW', status: 'Active', joined: '2025-08-20' },
  { id: 5, name: 'Super Admin', email: 'admin@skillbridge.ai', role: 'Admin', college: '—', status: 'Active', joined: '2025-01-01' },
  { id: 6, name: 'Flipkart', email: 'careers@flipkart.com', role: 'Industry', college: '—', status: 'Pending', joined: '2026-02-10' },
  { id: 7, name: 'NSUT Admin', email: 'admin@nsut.ac.in', role: 'Academician', college: 'NSUT', status: 'Active', joined: '2025-09-10' },
  { id: 8, name: 'Aman Verma', email: 'aman@example.com', role: 'Student', college: 'NSUT', status: 'Active', joined: '2025-08-18' },
  { id: 9, name: 'CRED Tech', email: 'hiring@cred.club', role: 'Industry', college: '—', status: 'Verified', joined: '2025-10-05' },
  { id: 10, name: 'Sneha Kapoor', email: 'sneha@example.com', role: 'Student', college: 'DTU', status: 'Blocked', joined: '2025-08-25' },
]

export default function UsersPage() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [page, setPage] = useState(1)
  const pageSize = 6

  const filtered = users.filter((u) => {
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false
    if (roleFilter !== 'All' && u.role !== roleFilter) return false
    return true
  })
  const totalPages = Math.ceil(filtered.length / pageSize) || 1
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-charcoal">Users</h1><p className="text-sm text-muted">All platform users — filter by role, search, paginate</p></div>
        <Badge variant="default">{filtered.length} users</Badge>
      </div>

      <Card className="!p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1"><Input placeholder="Search by name or email..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} /></div>
          <Select value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(1) }} className="w-full sm:w-44">
            <option value="All">All Roles</option><option>Student</option><option>Industry</option><option>Academician</option><option>Admin</option>
          </Select>
        </div>
        <div className="mt-3 flex gap-1.5 flex-wrap">
          {['All', 'Student', 'Industry', 'Academician', 'Admin'].map((r) => (
            <button key={r} onClick={() => { setRoleFilter(r); setPage(1) }} className={`rounded-full border px-3 py-1 text-xs font-bold ${roleFilter === r ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-border text-muted hover:bg-background'}`}>{r}</button>
          ))}
        </div>
      </Card>

      <Card className="!p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-background/60">
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-muted">User</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-muted">Role</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-muted">College / Org</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-muted">Status</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-muted">Joined</th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((u) => (
                <tr key={u.id} className="border-b border-border last:border-0 hover:bg-background/40">
                  <td className="px-6 py-3"><p className="text-sm font-semibold text-charcoal">{u.name}</p><p className="text-xs text-muted">{u.email}</p></td>
                  <td className="px-4 py-3"><Badge variant={u.role === 'Admin' ? 'default' : 'muted'} className={u.role === 'Admin' ? '!bg-slate-900 !text-white' : ''}>{u.role}</Badge></td>
                  <td className="px-4 py-3 text-sm text-muted">{u.college}</td>
                  <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${u.status === 'Active' || u.status === 'Verified' ? 'bg-success/10 text-success' : u.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-danger/10 text-danger'}`}>{u.status}</span></td>
                  <td className="px-4 py-3 text-sm text-muted">{u.joined}</td>
                  <td className="px-6 py-3 flex gap-1.5"><Button size="sm" variant="outline">View</Button><Button size="sm" variant="ghost">Block</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <p className="text-center text-sm text-muted py-10">No users found.</p>}
        <div className="flex justify-center border-t border-border p-4">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </Card>
    </div>
  )
}
