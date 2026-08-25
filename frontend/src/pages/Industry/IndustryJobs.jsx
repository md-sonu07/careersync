import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Textarea from '../../components/ui/Textarea'
import Select from '../../components/ui/Select'
import Modal from '../../components/ui/Modal'
import SearchInput from '../../components/ui/SearchInput'
import AppIcon from '../../components/ui/AppIcon'
import { opportunityApi } from '../../api/opportunity.api'
import { timeSince } from '../../utils/helpers'
import { toast } from 'react-hot-toast'

export default function IndustryJobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  // Edit Modal State
  const [editingItem, setEditingItem] = useState(null)
  const [editForm, setEditForm] = useState({
    title: '',
    location: '',
    work_mode: 'remote',
    stipend_salary: '',
    deadline: '',
    status: 'published',
    description: '',
  })
  const [saving, setSaving] = useState(false)

  // Delete Confirmation State
  const [deletingId, setDeletingId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const loadJobs = async () => {
    try {
      setLoading(true)
      const data = await opportunityApi.getOpportunities({ type: 'job', my_posts: 'true' })
      if (Array.isArray(data)) {
        setJobs(data.filter((opp) => opp.opportunity_type === 'job'))
      }
    } catch (err) {
      toast.error('Failed to load job postings.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadJobs()
  }, [])

  const filteredJobs = useMemo(() => {
    return jobs.filter((item) => {
      if (search && !`${item.title} ${item.location} ${item.description}`.toLowerCase().includes(search.toLowerCase())) return false
      if (statusFilter !== 'All' && item.status !== statusFilter) return false
      return true
    })
  }, [jobs, search, statusFilter])

  const handleEditClick = (item) => {
    setEditingItem(item)
    setEditForm({
      title: item.title || '',
      location: item.location || '',
      work_mode: item.work_mode || 'remote',
      stipend_salary: item.stipend_salary || '₹8–12 LPA',
      deadline: item.deadline || '2026-09-30',
      status: item.status || 'published',
      description: item.description || '',
    })
  }

  const handleSaveEdit = async () => {
    if (!editingItem) return
    try {
      setSaving(true)
      await opportunityApi.updateOpportunity(editingItem.id, editForm)
      toast.success('Job posting updated successfully!')
      setEditingItem(null)
      loadJobs()
    } catch (err) {
      toast.error('Failed to update job post.')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deletingId) return
    try {
      setDeleting(true)
      await opportunityApi.deleteOpportunity(deletingId)
      toast.success('Job post deleted successfully!')
      setDeletingId(null)
      loadJobs()
    } catch (err) {
      toast.error('Failed to delete job post.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Manage Posted Jobs</h1>
          <p className="text-sm text-muted">View, edit, update and manage all full-time job postings by your company.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={loadJobs} disabled={loading}>
            <AppIcon name="refresh" className="text-[16px]" /> Refresh
          </Button>
          <Link to="/industry/job/new">
            <Button variant="primary" size="sm" className="font-bold flex items-center gap-1">
              <AppIcon name="add" className="text-[18px]" /> Post New Job
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 flex flex-col sm:flex-row items-center gap-3">
        <div className="flex-1 w-full">
          <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search jobs by role, location, or keyword..." />
        </div>
        <div className="w-full sm:w-48">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            placeholder="Status"
            options={['All', 'published', 'draft', 'closed']}
          />
        </div>
      </Card>

      {/* Listings Grid */}
      {loading ? (
        <Card className="p-12 text-center text-muted">
          <AppIcon name="sync" className="animate-spin text-3xl text-primary mx-auto mb-2" />
          Loading your company's job postings...
        </Card>
      ) : filteredJobs.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((item) => (
            <Card key={item.id} hover className="p-5 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-lg text-charcoal leading-snug">{item.title}</h3>
                    <p className="text-xs text-muted mt-0.5">{item.company?.company_name || 'My Company'} • {item.location}</p>
                  </div>
                  <Badge variant={item.status === 'published' ? 'success' : 'muted'} className="shrink-0 whitespace-nowrap">
                    {item.status.toUpperCase()}
                  </Badge>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-xl bg-background border border-border px-3 py-2 flex items-center gap-1.5 font-semibold">
                    <AppIcon name="payments" className="text-[16px] text-muted" /> {item.stipend_salary || '₹8–12 LPA'}
                  </div>
                  <div className="rounded-xl bg-background border border-border px-3 py-2 flex items-center gap-1.5">
                    <AppIcon name="work_history" className="text-[16px] text-muted" /> {item.work_mode || 'Hybrid'}
                  </div>
                </div>

                {item.skill_requirements && item.skill_requirements.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {item.skill_requirements.map((req) => (
                      <span key={req.id || req.skill?.name} className="rounded-full bg-sage border border-sage px-2.5 py-0.5 text-xs font-semibold text-primary">
                        {req.skill?.name || req.skill_name || 'Skill'}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-5 border-t border-border pt-3.5 space-y-3">
                <div className="flex items-center justify-between text-xs text-muted">
                  <span>Posted: <strong className="text-charcoal">{item.created_at ? timeSince(item.created_at) : 'Recent'}</strong></span>
                  <span><strong className="text-primary font-bold">{item.applicants_count || 0}</strong> applicants</span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <Link to="/industry/applications" className="text-xs font-bold text-primary hover:underline">
                    View Applicants ({item.applicants_count || 0}) →
                  </Link>
                  <div className="flex items-center gap-1.5">
                    <Button size="xs" variant="outline" onClick={() => handleEditClick(item)}>
                      <AppIcon name="edit" className="text-[14px]" /> Edit
                    </Button>
                    <Button size="xs" variant="ghost" className="text-red-600 hover:bg-red-50" onClick={() => setDeletingId(item.id)}>
                      <AppIcon name="delete" className="text-[14px]" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center text-muted">
          <AppIcon name="business_center" className="text-4xl text-primary mx-auto mb-2" />
          <h3 className="text-lg font-bold text-charcoal">No Job Postings Found</h3>
          <p className="text-sm text-muted mt-1 max-w-md mx-auto">You haven't posted any full-time jobs matching your search yet.</p>
          <Link to="/industry/job/new" className="inline-block mt-4">
            <Button variant="primary" size="sm">Post New Job Now</Button>
          </Link>
        </Card>
      )}

      {/* Edit Job Modal */}
      <Modal open={!!editingItem} onClose={() => setEditingItem(null)} title="Edit Job Posting" size="lg">
        <div className="space-y-4">
          <Input
            label="Job Title"
            value={editForm.title}
            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
            placeholder="e.g. Senior Frontend Developer"
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Location"
              value={editForm.location}
              onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
              placeholder="e.g. Bengaluru / Remote"
            />
            <Select
              label="Work Mode"
              value={editForm.work_mode}
              onChange={(e) => setEditForm({ ...editForm, work_mode: e.target.value })}
              options={['remote', 'hybrid', 'onsite']}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Salary Package"
              value={editForm.stipend_salary}
              onChange={(e) => setEditForm({ ...editForm, stipend_salary: e.target.value })}
              placeholder="e.g. ₹10–14 LPA"
            />
            <Select
              label="Status"
              value={editForm.status}
              onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
              options={['published', 'draft', 'closed']}
            />
          </div>

          <Input
            label="Deadline Date"
            type="date"
            value={editForm.deadline}
            onChange={(e) => setEditForm({ ...editForm, deadline: e.target.value })}
          />

          <Textarea
            label="Description"
            rows={4}
            value={editForm.description}
            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            placeholder="Describe job role, responsibilities, and requirements..."
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setEditingItem(null)}>Cancel</Button>
            <Button variant="primary" onClick={handleSaveEdit} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={!!deletingId} onClose={() => setDeletingId(null)} title="Delete Job Posting" size="sm">
        <div className="space-y-4 text-center py-2">
          <AppIcon name="warning" className="text-4xl text-amber-500 mx-auto" />
          <h4 className="font-bold text-charcoal text-base">Are you sure you want to delete this job post?</h4>
          <p className="text-xs text-muted">This action cannot be undone and will remove all student application tracking for this post.</p>
          <div className="flex justify-center gap-3 pt-2">
            <Button variant="outline" onClick={() => setDeletingId(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDeleteConfirm} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Yes, Delete Post'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
