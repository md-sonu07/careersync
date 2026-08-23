import { useState } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import Textarea from '../../components/ui/Textarea'

const initialCourses = [
  { id: 'c1', title: 'Complete React Mastery 2026', instructor: 'Anjali Mehta', difficulty: 'Intermediate', skills: ['React', 'Hooks'], published: true, students: 12450, modules: 7 },
  { id: 'c2', title: 'Node.js Backend Bootcamp', instructor: 'Rohit Verma', difficulty: 'Intermediate', skills: ['Node.js', 'MongoDB'], published: true, students: 8920, modules: 6 },
  { id: 'c3', title: 'Docker & DevOps Essentials', instructor: 'Kiran Patel', difficulty: 'Beginner', skills: ['Docker', 'AWS'], published: false, students: 6320, modules: 5 },
  { id: 'c4', title: 'Testing with Jest & RTL', instructor: 'Sneha Kapoor', difficulty: 'Intermediate', skills: ['Jest', 'Testing'], published: true, students: 4100, modules: 4 },
]

export default function CourseManagement() {
  const [courses, setCourses] = useState(initialCourses)
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ title: '', instructor: '', difficulty: 'Beginner', skills: '', published: true })
  const [moduleForm, setModuleForm] = useState({ lesson: '', video: '', pdf: '', quiz: '' })

  const openAdd = () => { setForm({ title: '', instructor: '', difficulty: 'Beginner', skills: '', published: true }); setEditing(null); setShowAdd(true) }
  const openEdit = (c) => { setForm({ title: c.title, instructor: c.instructor, difficulty: c.difficulty, skills: c.skills.join(', '), published: c.published }); setEditing(c); setShowAdd(true) }
  const save = () => {
    if (editing) {
      setCourses(courses.map((c) => c.id === editing.id ? { ...c, title: form.title, instructor: form.instructor, difficulty: form.difficulty, skills: form.skills.split(',').map(s=>s.trim()).filter(Boolean), published: form.published } : c))
    } else {
      setCourses([...courses, { id: `c${Date.now()}`, title: form.title, instructor: form.instructor, difficulty: form.difficulty, skills: form.skills.split(',').map(s=>s.trim()).filter(Boolean), published: form.published, students: 0, modules: 0 }])
    }
    setShowAdd(false)
  }
  const togglePublish = (id) => setCourses(courses.map((c) => c.id === id ? { ...c, published: !c.published } : c))
  const remove = (id) => setCourses(courses.filter((c) => c.id !== id))
  const archive = (id) => setCourses(courses.map((c) => c.id === id ? { ...c, archived: !c.archived } : c))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-charcoal">Course Management</h1><p className="text-sm text-muted">Add/edit/delete/archive courses — manage modules, lessons, videos, PDFs, quizzes</p></div>
        <Button onClick={openAdd}>+ Add Course</Button>
      </div>

      <Card className="!p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-background/60">
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-muted">Course</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-muted">Instructor</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-muted">Difficulty</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-muted">Skills</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-muted">Students</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-muted">Status</th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.filter(c=>!c.archived).map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-background/40">
                  <td className="px-6 py-3"><p className="text-sm font-semibold text-charcoal">{c.title}</p><p className="text-xs text-muted">{c.modules} modules</p></td>
                  <td className="px-4 py-3 text-sm text-muted">{c.instructor}</td>
                  <td className="px-4 py-3"><Badge variant="muted">{c.difficulty}</Badge></td>
                  <td className="px-4 py-3 text-xs text-muted">{c.skills.join(', ')}</td>
                  <td className="px-4 py-3 text-sm font-bold text-charcoal">{c.students.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => togglePublish(c.id)} className={`rounded-full px-2.5 py-1 text-xs font-bold ${c.published ? 'bg-success/10 text-success' : 'bg-amber-100 text-amber-700'}`}>
                      {c.published ? 'Published' : 'Draft'}
                    </button>
                  </td>
                  <td className="px-6 py-3 flex gap-1.5 flex-wrap">
                    <Button size="sm" variant="outline" onClick={() => openEdit(c)}>Edit</Button>
                    <Button size="sm" variant="ghost" onClick={() => togglePublish(c.id)}>{c.published ? 'Unpublish' : 'Publish'}</Button>
                    <Button size="sm" variant="ghost" onClick={() => archive(c.id)}>Archive</Button>
                    <Button size="sm" variant="outline" className="!text-danger !border-danger/20" onClick={() => remove(c.id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {courses.filter(c=>c.archived).length > 0 && <p className="px-6 py-2 text-xs text-muted">{courses.filter(c=>c.archived).length} archived — hidden from students</p>}
      </Card>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title={editing ? 'Edit Course' : 'Add Course'} size="lg">
        <div className="space-y-4">
          <Input label="Course Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Advanced TypeScript" />
          <Input label="Instructor" value={form.instructor} onChange={(e) => setForm({ ...form, instructor: e.target.value })} placeholder="Instructor name" />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Difficulty" value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}><option>Beginner</option><option>Intermediate</option><option>Advanced</option></Select>
            <Input label="Skills (comma separated)" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="React, Node.js" />
          </div>
          <label className="flex items-center gap-2 text-sm font-medium text-charcoal"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Published</label>

          <div className="rounded-xl border border-border bg-background p-4 space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-muted">Add Modules / Lessons / Content</p>
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="Lesson title" value={moduleForm.lesson} onChange={(e) => setModuleForm({ ...moduleForm, lesson: e.target.value })} />
              <Input placeholder="Video URL (YouTube / S3)" value={moduleForm.video} onChange={(e) => setModuleForm({ ...moduleForm, video: e.target.value })} />
              <Input placeholder="PDF URL" value={moduleForm.pdf} onChange={(e) => setModuleForm({ ...moduleForm, pdf: e.target.value })} />
              <Input placeholder="Quiz title" value={moduleForm.quiz} onChange={(e) => setModuleForm({ ...moduleForm, quiz: e.target.value })} />
            </div>
            <p className="text-xs text-muted">Videos, PDFs and quizzes are attached per lesson. Module builder would persist to API — mocked here.</p>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button onClick={save}>{editing ? 'Save Changes' : 'Add Course'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
