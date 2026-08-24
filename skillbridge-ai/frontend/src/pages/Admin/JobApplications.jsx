import { useState, useEffect } from 'react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import {
  getJobApplications,
  updateApplicationStatus,
  deleteJobApplication,
} from '../../utils/jobApplications'

export default function JobApplications() {
  const [applications, setApplications] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedApp, setSelectedApp] = useState(null)

  useEffect(() => {
    setApplications(getJobApplications())
  }, [])

  const handleStatusChange = (id, newStatus) => {
    const updated = updateApplicationStatus(id, newStatus)
    setApplications(updated)
    if (selectedApp && selectedApp.id === id) {
      setSelectedApp({ ...selectedApp, status: newStatus })
    }
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      const updated = deleteJobApplication(id)
      setApplications(updated)
      if (selectedApp && selectedApp.id === id) {
        setSelectedApp(null)
      }
    }
  }

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      `${app.applicantName} ${app.email} ${app.jobRole} ${app.company}`
        .toLowerCase()
        .includes(search.toLowerCase())

    const matchesStatus = statusFilter === 'All' || app.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Metrics
  const totalApps = applications.length
  const pendingApps = applications.filter((a) => a.status === 'Pending').length
  const shortlistedApps = applications.filter((a) => a.status === 'Shortlisted').length
  const interviewApps = applications.filter((a) => a.status === 'Interview').length
  const hiredApps = applications.filter((a) => a.status === 'Hired').length

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Shortlisted':
        return <Badge variant="success">Shortlisted</Badge>
      case 'Interview':
        return <span className="rounded-full bg-blue-100 border border-blue-200 px-2.5 py-1 text-xs font-semibold text-blue-700">Interview</span>
      case 'Hired':
        return <span className="rounded-full bg-emerald-100 border border-emerald-200 px-2.5 py-1 text-xs font-semibold text-emerald-800">Hired 🎉</span>
      case 'Rejected':
        return <Badge variant="danger">Rejected</Badge>
      default:
        return <span className="rounded-full bg-amber-100 border border-amber-200 px-2.5 py-1 text-xs font-semibold text-amber-700">Pending Review</span>
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Management Console</span>
          <h1 className="text-2xl font-bold text-slate-900">Job & Internship Applications</h1>
          <p className="text-xs text-slate-500 mt-1">
            Review candidate applications, evaluate skill metrics, and manage recruitment pipeline.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700">
            {totalApps} Total Applications Received
          </span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <Card className="p-4 bg-white">
          <p className="text-xs text-slate-500 font-medium">Total Received</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{totalApps}</p>
        </Card>
        <Card className="p-4 bg-amber-50/50 border-amber-200">
          <p className="text-xs text-amber-700 font-medium">Pending Review</p>
          <p className="text-2xl font-bold text-amber-800 mt-1">{pendingApps}</p>
        </Card>
        <Card className="p-4 bg-emerald-50/50 border-emerald-200">
          <p className="text-xs text-emerald-700 font-medium">Shortlisted</p>
          <p className="text-2xl font-bold text-emerald-800 mt-1">{shortlistedApps}</p>
        </Card>
        <Card className="p-4 bg-blue-50/50 border-blue-200">
          <p className="text-xs text-blue-700 font-medium">Interviews</p>
          <p className="text-2xl font-bold text-blue-800 mt-1">{interviewApps}</p>
        </Card>
        <Card className="p-4 bg-emerald-100/50 border-emerald-300">
          <p className="text-xs text-emerald-900 font-medium">Hired</p>
          <p className="text-2xl font-bold text-emerald-950 mt-1">{hiredApps}</p>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-3 justify-between items-center">
          <div className="w-full md:w-80">
            <input
              type="text"
              placeholder="Search by name, role, email or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs focus:outline-none focus:border-slate-800"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
            {['All', 'Pending', 'Shortlisted', 'Interview', 'Hired', 'Rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  statusFilter === status
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Applications List Table */}
      <Card className="p-0 overflow-hidden">
        {filteredApps.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-sm">
            No applications match the current filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4">Candidate</th>
                  <th className="p-4">Job Role & Company</th>
                  <th className="p-4">Applied Date</th>
                  <th className="p-4">Match %</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="font-bold text-slate-900">{app.applicantName}</p>
                        <p className="text-slate-500 text-[11px]">{app.email} • {app.phone}</p>
                        <span className="text-[10px] text-slate-400 font-medium">Exp: {app.experience}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-semibold text-slate-800">{app.jobRole}</p>
                        <p className="text-slate-500 text-[11px]">{app.company}</p>
                      </div>
                    </td>
                    <td className="p-4 text-slate-500">{app.appliedDate}</td>
                    <td className="p-4">
                      <span className="font-bold text-slate-800">{app.match}%</span>
                    </td>
                    <td className="p-4">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700 focus:outline-none focus:border-slate-800 cursor-pointer"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Interview">Interview</option>
                        <option value="Hired">Hired</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="rounded-md bg-slate-100 px-2.5 py-1 font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDelete(app.id)}
                        className="rounded-md bg-rose-50 px-2.5 py-1 font-semibold text-rose-600 hover:bg-rose-100 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Candidate Detail Modal */}
      {selectedApp && (
        <Modal
          open={Boolean(selectedApp)}
          onClose={() => setSelectedApp(null)}
          size="lg"
          title={`Application Details — ${selectedApp.applicantName}`}
        >
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedApp.applicantName}</h3>
                <p className="text-slate-500">{selectedApp.email} • {selectedApp.phone}</p>
              </div>
              <div>{getStatusBadge(selectedApp.status)}</div>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div>
                <p className="text-slate-400 font-medium">Applied For:</p>
                <p className="font-bold text-slate-800">{selectedApp.jobRole} @ {selectedApp.company}</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">Applied Date:</p>
                <p className="font-bold text-slate-800">{selectedApp.appliedDate}</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">Experience:</p>
                <p className="font-bold text-slate-800">{selectedApp.experience}</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">Skill Match Rating:</p>
                <p className="font-bold text-slate-800">{selectedApp.match}%</p>
              </div>
            </div>

            {selectedApp.skills && (
              <div>
                <p className="font-bold text-slate-700 mb-1">Skills / Key Strengths:</p>
                <p className="text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">{selectedApp.skills}</p>
              </div>
            )}

            {selectedApp.coverNote && (
              <div>
                <p className="font-bold text-slate-700 mb-1">Cover Note / Pitch:</p>
                <p className="text-slate-600 bg-white p-3 rounded-lg border border-slate-200 whitespace-pre-wrap leading-relaxed">
                  {selectedApp.coverNote}
                </p>
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200">
              {selectedApp.resumeUrl && (
                <a
                  href={selectedApp.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  download={selectedApp.resumeFileName || 'resume.pdf'}
                  className="rounded-lg bg-slate-900 text-white px-3.5 py-2 font-semibold text-xs inline-flex items-center gap-1.5 hover:bg-slate-800 transition-colors shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
                  <span>View / Download {selectedApp.resumeFileName || 'Resume (PDF)'}</span>
                </a>
              )}
              {selectedApp.portfolioUrl && (
                <a
                  href={selectedApp.portfolioUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg bg-slate-100 text-slate-800 border border-slate-200 px-3 py-1.5 font-semibold text-xs inline-flex items-center gap-1 hover:bg-slate-200"
                >
                  <span className="material-symbols-outlined text-[16px]">link</span> View Portfolio / GitHub
                </a>
              )}
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-600">Update Status:</span>
                <select
                  value={selectedApp.status}
                  onChange={(e) => handleStatusChange(selectedApp.id, e.target.value)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-semibold text-slate-800 text-xs"
                >
                  <option value="Pending">Pending</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Interview">Interview</option>
                  <option value="Hired">Hired</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <Button variant="outline" onClick={() => setSelectedApp(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
