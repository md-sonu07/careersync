import { useState } from 'react'
import Modal from './Modal'
import Button from './Button'
import { saveJobApplication } from '../../utils/jobApplications'

const JobApplicationModal = ({ open, onClose, job }) => {
  const [formData, setFormData] = useState({
    applicantName: '',
    email: '',
    phone: '',
    experience: '1-2 years',
    skills: '',
    portfolioUrl: '',
    resumeUrl: '',
    coverNote: '',
  })

  const [resumeFile, setResumeFile] = useState(null)
  const [resumeMode, setResumeMode] = useState('upload') // 'upload' | 'link'
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  if (!job) return null

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be under 10MB.')
      return
    }

    setError('')
    setResumeFile(file)

    // Generate local Object URL for preview/download
    const objectUrl = URL.createObjectURL(file)
    setFormData((prev) => ({
      ...prev,
      resumeUrl: objectUrl,
      resumeFileName: file.name,
      resumeFileSize: (file.size / 1024).toFixed(1) + ' KB',
    }))
  }

  const handleRemoveFile = () => {
    setResumeFile(null)
    setFormData((prev) => ({
      ...prev,
      resumeUrl: '',
      resumeFileName: '',
      resumeFileSize: '',
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.applicantName || !formData.email || !formData.phone) {
      setError('Please fill in all required fields (Name, Email, Phone).')
      return
    }

    if (!formData.resumeUrl && !resumeFile) {
      setError('Please upload your Resume PDF or provide a Resume Link.')
      return
    }

    const result = saveJobApplication({
      jobId: job.id,
      jobRole: job.role,
      company: job.company,
      match: job.match || 90,
      ...formData,
      resumeFileName: resumeFile?.name || formData.resumeFileName || 'resume.pdf',
    })

    if (result) {
      setSubmitted(true)
      setError('')
    } else {
      setError('Failed to submit application. Please try again.')
    }
  }

  const handleClose = () => {
    setSubmitted(false)
    setResumeFile(null)
    setResumeMode('upload')
    setFormData({
      applicantName: '',
      email: '',
      phone: '',
      experience: '1-2 years',
      skills: '',
      portfolioUrl: '',
      resumeUrl: '',
      coverNote: '',
    })
    setError('')
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} size="lg" title="">
      {submitted ? (
        <div className="py-10 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 bg-success/15 border-2 border-success rounded-full flex items-center justify-center text-success animate-bounce">
            <span className="material-symbols-outlined text-4xl">check_circle</span>
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-success">Application Received</span>
            <h3 className="text-2xl font-bold text-charcoal">Successfully Applied! 🎉</h3>
            <p className="text-sm text-muted mt-1 max-w-md">
              Your resume and application for <span className="font-semibold text-charcoal">{job.role}</span> at <span className="font-semibold text-charcoal">{job.company}</span> have been sent to Admin Management Console.
            </p>
          </div>
          <div className="pt-4">
            <Button onClick={handleClose} size="lg">
              Close & Browse More Jobs
            </Button>
          </div>
        </div>
      ) : (
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
            <div>
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">Job Application</span>
              <h3 className="text-xl font-bold text-charcoal">Apply for {job.role}</h3>
              <p className="text-xs text-muted mt-0.5">{job.company} • {job.location} • {job.salary}</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-sage border border-sage px-3 py-1 text-xs font-semibold text-primary">
              {job.match}% Skill Match
            </span>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-charcoal mb-1">Full Name *</label>
                <input
                  type="text"
                  name="applicantName"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.applicantName}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-border px-3 py-2 text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal mb-1">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="rahul@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-border px-3 py-2 text-xs focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-charcoal mb-1">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-border px-3 py-2 text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal mb-1">Relevant Experience</label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-border px-3 py-2 text-xs focus:outline-none focus:border-primary bg-white"
                >
                  <option value="Fresher / Entry Level">Fresher / Entry Level</option>
                  <option value="1-2 years">1-2 years</option>
                  <option value="2-4 years">2-4 years</option>
                  <option value="5+ years">5+ years</option>
                </select>
              </div>
            </div>

            {/* Resume Upload / Link Section */}
            <div className="space-y-2 border border-border rounded-xl p-3 bg-surface">
              <div className="flex items-center justify-between">
                <label className="block font-bold text-charcoal">Resume / CV *</label>
                <div className="flex bg-white rounded-lg p-0.5 border border-border text-[11px] font-semibold">
                  <button
                    type="button"
                    onClick={() => setResumeMode('upload')}
                    className={`px-2.5 py-1 rounded-md transition-colors ${resumeMode === 'upload' ? 'bg-primary text-white' : 'text-muted hover:text-charcoal'}`}
                  >
                    Upload PDF / File
                  </button>
                  <button
                    type="button"
                    onClick={() => setResumeMode('link')}
                    className={`px-2.5 py-1 rounded-md transition-colors ${resumeMode === 'link' ? 'bg-primary text-white' : 'text-muted hover:text-charcoal'}`}
                  >
                    Provide URL Link
                  </button>
                </div>
              </div>

              {resumeMode === 'upload' ? (
                <div>
                  {!resumeFile ? (
                    <label className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-white px-4 py-6 text-center cursor-pointer hover:border-primary/50 transition-colors">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage text-primary mb-2">
                        <span className="material-symbols-outlined text-2xl">upload_file</span>
                      </div>
                      <p className="font-semibold text-charcoal text-xs">Click to browse or drop your Resume (PDF / DOCX)</p>
                      <p className="text-[11px] text-muted mt-0.5">Supports PDF, DOC, DOCX up to 10MB</p>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="flex items-center justify-between rounded-xl border border-primary/30 bg-sage/30 px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-2xl">picture_as_pdf</span>
                        <div>
                          <p className="font-bold text-charcoal">{resumeFile.name}</p>
                          <p className="text-[11px] text-muted">{(resumeFile.size / 1024).toFixed(1)} KB • Ready to submit</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="text-danger font-semibold hover:underline text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <input
                    type="url"
                    name="resumeUrl"
                    placeholder="https://ik.imagekit.io/crms/my_resume.pdf or Google Drive URL"
                    value={formData.resumeUrl}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-border px-3 py-2 text-xs focus:outline-none focus:border-primary bg-white"
                  />
                  <p className="text-[10px] text-muted mt-1">Provide a public link from Google Drive, ImageKit, or Dropbox.</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-charcoal mb-1">Key Skills</label>
                <input
                  type="text"
                  name="skills"
                  placeholder="e.g. React, Node.js, SQL"
                  value={formData.skills}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-border px-3 py-2 text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal mb-1">Portfolio / GitHub / LinkedIn URL</label>
                <input
                  type="url"
                  name="portfolioUrl"
                  placeholder="https://github.com/yourusername"
                  value={formData.portfolioUrl}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-border px-3 py-2 text-xs focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-charcoal mb-1">Cover Note / Pitch</label>
              <textarea
                name="coverNote"
                rows="3"
                placeholder="Briefly explain your background, passion and why you're a great fit for this role..."
                value={formData.coverNote}
                onChange={handleChange}
                className="w-full rounded-lg border border-border p-3 text-xs focus:outline-none focus:border-primary"
              />
            </div>

            <div className="pt-2 flex gap-3">
              <Button type="submit" className="flex-1" size="lg">
                Submit Resume & Apply →
              </Button>
              <Button type="button" variant="outline" onClick={handleClose} size="lg">
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}
    </Modal>
  )
}

export default JobApplicationModal
