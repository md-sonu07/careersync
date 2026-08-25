import { useState } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'

const initialSkills = [
  { id: 1, name: 'React', category: 'Frontend', difficulty: 'Intermediate', courses: 8 },
  { id: 2, name: 'Node.js', category: 'Backend', difficulty: 'Intermediate', courses: 6 },
  { id: 3, name: 'Python', category: 'Programming', difficulty: 'Beginner', courses: 7 },
  { id: 4, name: 'SQL', category: 'Database', difficulty: 'Beginner', courses: 5 },
  { id: 5, name: 'MongoDB', category: 'Database', difficulty: 'Intermediate', courses: 4 },
  { id: 6, name: 'AWS', category: 'Cloud', difficulty: 'Advanced', courses: 3 },
  { id: 7, name: 'Docker', category: 'DevOps', difficulty: 'Intermediate', courses: 3 },
  { id: 8, name: 'TensorFlow', category: 'AI/ML', difficulty: 'Advanced', courses: 2 },
  { id: 9, name: 'Jest', category: 'Backend', difficulty: 'Intermediate', courses: 2 },
  { id: 10, name: 'TypeScript', category: 'Frontend', difficulty: 'Intermediate', courses: 4 },
]

const categories = ['All', 'Programming', 'Frontend', 'Backend', 'Database', 'Cloud', 'DevOps', 'AI/ML']

export default function SkillManagement() {
  const [skills, setSkills] = useState(initialSkills)
  const [filterCat, setFilterCat] = useState('All')
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', category: 'Frontend', difficulty: 'Beginner' })

  const filtered = skills.filter((s) => {
    if (filterCat !== 'All' && s.category !== filterCat) return false
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const openAdd = () => { setForm({ name: '', category: 'Frontend', difficulty: 'Beginner' }); setEditing(null); setShowAdd(true) }
  const openEdit = (s) => { setForm({ name: s.name, category: s.category, difficulty: s.difficulty }); setEditing(s); setShowAdd(true) }
  const save = () => {
    if (editing) setSkills(skills.map((s) => s.id === editing.id ? { ...s, ...form } : s))
    else setSkills([...skills, { id: Date.now(), ...form, courses: 0 }])
    setShowAdd(false)
  }
  const remove = (id) => setSkills(skills.filter((s) => s.id !== id))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-charcoal">Skill Library</h1><p className="text-sm text-muted">Manage global skills — categorized, difficulty-tagged, linked to courses</p></div>
        <Button onClick={openAdd}>+ Add Skill</Button>
      </div>

      <Card className="!p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1"><Input placeholder="Search skills..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
          <Select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className="w-full sm:w-48">
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
          <Badge variant="default">{filtered.length} skills</Badge>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {categories.slice(1).map((c) => (
            <button key={c} onClick={() => setFilterCat(c)} className={`rounded-full border px-3 py-1 text-xs font-bold ${filterCat === c ? 'bg-primary text-white border-primary' : 'bg-white border-border text-muted hover:bg-background'}`}>{c}</button>
          ))}
        </div>
      </Card>

      <Card className="!p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-background/60">
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-muted">Skill Name</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-muted">Category</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-muted">Difficulty</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-muted">Related Courses</th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b border-border last:border-0 hover:bg-background/40">
                  <td className="px-6 py-3 text-sm font-semibold text-charcoal">{s.name}</td>
                  <td className="px-4 py-3"><Badge variant="muted">{s.category}</Badge></td>
                  <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${s.difficulty === 'Beginner' ? 'bg-success/10 text-success' : s.difficulty === 'Intermediate' ? 'bg-accent/10 text-accent' : 'bg-danger/10 text-danger'}`}>{s.difficulty}</span></td>
                  <td className="px-4 py-3 text-sm font-bold text-primary">{s.courses} courses</td>
                  <td className="px-6 py-3 flex gap-1.5">
                    <Button size="sm" variant="outline" onClick={() => openEdit(s)}>Edit</Button>
                    <Button size="sm" variant="ghost" className="!text-danger" onClick={() => remove(s.id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <p className="text-center text-sm text-muted py-10">No skills found.</p>}
      </Card>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title={editing ? 'Edit Skill' : 'Add Skill'}>
        <div className="space-y-4">
          <Input label="Skill Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Kubernetes" />
          <Select label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {categories.slice(1).map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
          <Select label="Difficulty" value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
            <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
          </Select>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button onClick={save}>{editing ? 'Save' : 'Add'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
