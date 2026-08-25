import { useState, useEffect } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Input from '../../components/ui/Input'
import Textarea from '../../components/ui/Textarea'
import Modal from '../../components/ui/Modal'
import AppIcon from '../../components/ui/AppIcon'
import { courseApi } from '../../api/course.api'

export default function InstituteCourses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  const [form, setForm] = useState({
    title: '',
    description: '',
    skill_name: '',
    level: 'beginner',
    resource_type: 'course',
    content_url: '',
    duration_minutes: 120,
    thumbnail_url: '',
  })

  const loadCourses = async () => {
    setLoading(true)
    try {
      const data = await courseApi.getMyInstituteCourses()
      setCourses(Array.isArray(data) ? data : data?.results || [])
    } catch {
      setCourses([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCourses()
  }, [])

  const handleOpenCreate = () => {
    setEditingCourse(null)
    setForm({
      title: '',
      description: '',
      skill_name: '',
      level: 'beginner',
      resource_type: 'course',
      content_url: '',
      duration_minutes: 120,
      thumbnail_url: '',
      price: 0,
      original_price: 1499,
      is_free: true,
    })
    setModalOpen(true)
  }

  const handleOpenEdit = (course) => {
    setEditingCourse(course)
    setForm({
      title: course.title || '',
      description: course.description || '',
      skill_name: course.skill?.name || '',
      level: course.level || 'beginner',
      resource_type: course.resource_type || 'course',
      content_url: course.content_url || '',
      duration_minutes: course.duration_minutes || 120,
      thumbnail_url: course.thumbnail_url || '',
      price: course.price || 0,
      original_price: course.original_price || 1499,
      is_free: course.is_free || Number(course.price) === 0,
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setToast(null)

    try {
      if (editingCourse) {
        await courseApi.updateCourse(editingCourse.id, form)
        setToast({ type: 'success', message: 'Course updated successfully!' })
      } else {
        await courseApi.createCourse(form)
        setToast({ type: 'success', message: 'Course published successfully!' })
      }
      setModalOpen(false)
      loadCourses()
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Failed to save course.' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return
    try {
      await courseApi.deleteCourse(id)
      setToast({ type: 'success', message: 'Course deleted successfully!' })
      loadCourses()
    } catch {
      setToast({ type: 'error', message: 'Failed to delete course.' })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal sm:text-3xl">Institutional Courses &amp; Learning Hub</h1>
          <p className="mt-1 text-sm text-muted">
            Create, publish, and manage upskilling courses offered by your institution.
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="flex items-center gap-2">
          <AppIcon name="add" className="text-[20px]" />
          Create New Course
        </Button>
      </div>

      {toast && (
        <div className={`p-4 rounded-xl border flex items-center justify-between text-sm font-semibold ${toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)} className="opacity-60 hover:opacity-100">✕</button>
        </div>
      )}

      {/* Courses Grid */}
      {loading ? (
        <div className="py-24 text-center text-sm text-muted">Loading courses…</div>
      ) : courses.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <Card key={c.id} className="flex flex-col justify-between hover:shadow-card transition-all duration-200 !p-0 overflow-hidden">
              <div className="relative h-44 bg-slate-900 overflow-hidden">
                {c.thumbnail_url ? (
                  <img src={c.thumbnail_url} alt={c.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-primary/80 text-white p-4 text-center">
                    <AppIcon name="menu_book" className="text-4xl opacity-40 mb-2" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                      {c.skill?.name || 'Technical'}
                    </span>
                  </div>
                )}
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <Badge variant="default" className="capitalize bg-black/60 backdrop-blur-md text-white border-0">
                    {c.level}
                  </Badge>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-charcoal text-base line-clamp-1">{c.title}</h3>
                  <p className="text-xs text-muted mt-1 line-clamp-2 leading-relaxed">
                    {c.description || 'Comprehensive curriculum designed to boost student practical proficiency.'}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-border space-y-3">
                  <div className="flex items-center justify-between text-xs text-muted">
                    <span className="flex items-center gap-1">
                      <AppIcon name="schedule" className="text-[14px]" />
                      {Math.round(c.duration_minutes / 60)} Hours
                    </span>
                    <span className="flex items-center gap-1">
                      <AppIcon name="group" className="text-[14px]" />
                      {c.enrolled_count || 0} Enrolled
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm" onClick={() => handleOpenEdit(c)} className="flex-1">
                      Edit
                    </Button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="h-8 w-8 rounded-lg flex items-center justify-center text-muted hover:bg-danger/10 hover:text-danger transition-colors cursor-pointer"
                      title="Delete Course"
                    >
                      <AppIcon name="delete" className="text-[18px]" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="py-20 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3">
            <AppIcon name="menu_book" className="text-3xl" />
          </div>
          <h2 className="text-lg font-bold text-charcoal">No Courses Created Yet</h2>
          <p className="text-xs text-muted max-w-md mx-auto mt-1 leading-relaxed">
            Create and publish technical training courses. Your courses will automatically appear on the Public Courses directory and the Home page!
          </p>
          <div className="mt-5">
            <Button onClick={handleOpenCreate}>Create Your First Course</Button>
          </div>
        </Card>
      )}

      {/* Course Modal */}
      {modalOpen && (
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingCourse ? 'Edit Course' : 'Create New Course'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                Course Title <span className="text-danger">*</span>
              </label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Master React & Node.js Full Stack"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                  Skill / Subject <span className="text-danger">*</span>
                </label>
                <Input
                  value={form.skill_name}
                  onChange={(e) => setForm({ ...form, skill_name: e.target.value })}
                  placeholder="e.g. React, Python, Cloud"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                  Difficulty Level
                </label>
                <select
                  value={form.level}
                  onChange={(e) => setForm({ ...form, level: e.target.value })}
                  className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm text-charcoal shadow-soft focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                  Duration (in Minutes)
                </label>
                <Input
                  type="number"
                  value={form.duration_minutes}
                  onChange={(e) => setForm({ ...form, duration_minutes: Number(e.target.value) })}
                  placeholder="120"
                  min="15"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                  Resource Type
                </label>
                <select
                  value={form.resource_type}
                  onChange={(e) => setForm({ ...form, resource_type: e.target.value })}
                  className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm text-charcoal shadow-soft focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="course">Complete Course</option>
                  <option value="video">Video Lecture</option>
                  <option value="project">Hands-on Project</option>
                  <option value="article">Documentation &amp; Guide</option>
                </select>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="rounded-xl border border-border bg-slate-50/60 p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-charcoal">Course Access & Pricing</label>
                  <p className="text-[11px] text-muted">Is this course 100% free or paid?</p>
                </div>
                <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-bold text-emerald-700">
                  <input
                    type="checkbox"
                    checked={form.is_free}
                    onChange={(e) => setForm({
                      ...form,
                      is_free: e.target.checked,
                      price: e.target.checked ? 0 : (form.price || 499)
                    })}
                    className="h-4 w-4 rounded border-border text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>100% Free Course</span>
                </label>
              </div>

              {!form.is_free && (
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-charcoal mb-1">
                      Selling Price (₹)
                    </label>
                    <Input
                      type="number"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                      placeholder="499"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-charcoal mb-1">
                      Original Price (₹)
                    </label>
                    <Input
                      type="number"
                      value={form.original_price}
                      onChange={(e) => setForm({ ...form, original_price: Number(e.target.value) })}
                      placeholder="1999"
                      min="1"
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                Content / Video Lecture URL
              </label>
              <Input
                type="url"
                value={form.content_url}
                onChange={(e) => setForm({ ...form, content_url: e.target.value })}
                placeholder="https://youtube.com/watch?v=... or lecture link"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                Thumbnail Image URL (Optional)
              </label>
              <Input
                type="url"
                value={form.thumbnail_url}
                onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })}
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                Course Description &amp; Syllabus
              </label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="What will students learn in this course..."
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-border">
              <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Publishing…' : editingCourse ? 'Save Changes' : 'Publish Course'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
