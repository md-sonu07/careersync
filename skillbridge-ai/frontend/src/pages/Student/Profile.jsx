import { useState } from 'react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import FileUpload from '../../components/ui/FileUpload'
import { ProgressBar } from '../../components/ui/Progress'
import PageHeader from '../../components/common/PageHeader'
import { mockUser, mockSkills, mockProjects, mockCertificates } from '../../utils/mockData'

export default function Profile() {
  const [resumeUploaded, setResumeUploaded] = useState(false)

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Profile"
        subtitle="Manage your personal, education and career info — 87% complete. Add more to boost visibility to recruiters."
        actions={<Button variant="outline">Edit Profile</Button>}
      />

      {/* Completion bar */}
      <Card className="!py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-charcoal">Profile Completion — 87%</p>
            <p className="text-xs text-muted">Add resume + 1 more project to reach 100%</p>
          </div>
          <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-bold text-success">ALMOST THERE</span>
        </div>
        <ProgressBar value={87} size="sm" className="mt-3" barClassName="bg-success" showLabel />
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-6">
          <Card className="text-center">
            <img src={mockUser.avatar} alt={mockUser.name} className="mx-auto h-24 w-24 rounded-full border-4 border-sage object-cover" />
            <h3 className="mt-4 text-lg font-bold text-charcoal">{mockUser.name}</h3>
            <p className="text-sm text-muted">{mockUser.branch}</p>
            <p className="text-xs text-muted">{mockUser.college}</p>
            <div className="mt-3 flex justify-center gap-2">
              <Badge variant="default">{mockUser.careerGoal}</Badge>
              <Badge variant="muted">{mockUser.location}</Badge>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted">{mockUser.bio}</p>
            <div className="mt-4 space-y-2 text-sm text-left">
              <div className="flex justify-between rounded-xl bg-background border border-border px-3 py-2"><span className="text-muted">Email</span><span className="font-medium text-charcoal text-xs sm:text-sm truncate ml-2">{mockUser.email}</span></div>
              <div className="flex justify-between rounded-xl bg-background border border-border px-3 py-2"><span className="text-muted">Phone</span><span className="font-medium text-charcoal">{mockUser.phone}</span></div>
              <div className="flex justify-between rounded-xl bg-background border border-border px-3 py-2"><span className="text-muted">Streak</span><span className="font-bold text-primary">{mockUser.streak} days 🔥</span></div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="primary" className="flex-1" size="sm">Share Profile</Button>
              <Button variant="outline" className="flex-1" size="sm">Download Resume</Button>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <a href="#" className="rounded-xl border border-border bg-white px-3 py-2.5 flex items-center justify-center gap-2 hover:bg-background text-xs font-medium text-charcoal"><span className="material-symbols-outlined text-primary text-[18px]">link</span> LinkedIn</a>
              <a href="#" className="rounded-xl border border-border bg-white px-3 py-2.5 flex items-center justify-center gap-2 hover:bg-background text-xs font-medium text-charcoal"><span className="material-symbols-outlined text-primary text-[18px]">code</span> GitHub</a>
            </div>
          </Card>

          <Card>
            <h3 className="font-bold text-charcoal text-sm">Resume</h3>
            <p className="text-xs text-muted mt-1">Upload PDF — improves match accuracy</p>
            <div className="mt-3">
              <FileUpload hint="Drop resume PDF or click to browse" accept=".pdf" maxSizeMB={5} onFiles={()=>setResumeUploaded(true)} />
            </div>
            {resumeUploaded && <p className="mt-2 text-xs font-medium text-success">Resume uploaded ✓ — ATS score 82%</p>}
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="outline" className="flex-1">Preview</Button>
              <Button size="sm" className="flex-1">Analyze</Button>
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="font-bold text-charcoal">Personal Information</h3>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-background border border-border px-4 py-3"><p className="text-xs uppercase tracking-wider font-semibold text-muted">Full Name</p><p className="text-sm font-semibold text-charcoal mt-1">{mockUser.name}</p></div>
              <div className="rounded-xl bg-background border border-border px-4 py-3"><p className="text-xs uppercase tracking-wider font-semibold text-muted">Email</p><p className="text-sm font-semibold text-charcoal mt-1">{mockUser.email}</p></div>
              <div className="rounded-xl bg-background border border-border px-4 py-3"><p className="text-xs uppercase tracking-wider font-semibold text-muted">Phone</p><p className="text-sm font-semibold text-charcoal mt-1">{mockUser.phone}</p></div>
              <div className="rounded-xl bg-background border border-border px-4 py-3"><p className="text-xs uppercase tracking-wider font-semibold text-muted">Location</p><p className="text-sm font-semibold text-charcoal mt-1">{mockUser.location}</p></div>
              <div className="rounded-xl bg-background border border-border px-4 py-3 sm:col-span-2"><p className="text-xs uppercase tracking-wider font-semibold text-muted">Bio</p><p className="text-sm text-charcoal mt-1 leading-relaxed">{mockUser.bio}</p></div>
            </div>
          </Card>

          <Card>
            <h3 className="font-bold text-charcoal">Education</h3>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-background border border-border px-4 py-3"><p className="text-xs font-semibold uppercase tracking-wider text-muted">College</p><p className="text-sm font-semibold text-charcoal mt-1">{mockUser.college}</p></div>
              <div className="rounded-xl bg-background border border-border px-4 py-3"><p className="text-xs font-semibold uppercase tracking-wider text-muted">Degree</p><p className="text-sm font-semibold text-charcoal mt-1">B.Tech Computer Science</p></div>
              <div className="rounded-xl bg-background border border-border px-4 py-3"><p className="text-xs font-semibold uppercase tracking-wider text-muted">Semester</p><p className="text-sm font-semibold text-charcoal mt-1">6th Semester — 3rd Year</p></div>
            </div>
            <div className="mt-3 rounded-xl bg-sage border border-sage p-3 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-border text-primary"><span className="material-symbols-outlined text-[18px]">school</span></span>
              <div><p className="text-sm font-semibold text-charcoal">CGPA 8.4 / 10</p><p className="text-xs text-muted">Expected graduation 2027</p></div>
            </div>
          </Card>

          <Card>
            <h3 className="font-bold text-charcoal">Career Info</h3>
            <div className="mt-4 rounded-2xl bg-sage border border-sage p-4 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shrink-0"><span className="material-symbols-outlined">flag</span></div>
              <div>
                <p className="font-bold text-charcoal">Full Stack Developer</p>
                <p className="text-sm text-charcoal/70">82% readiness — target 85% for top internship matches</p>
              </div>
              <Badge variant="success" className="ml-auto hidden sm:inline-flex">ON TRACK</Badge>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-background border border-border px-3 py-2.5"><p className="text-xs text-muted">Target Industry</p><p className="font-semibold text-charcoal">Technology / SaaS</p></div>
              <div className="rounded-xl bg-background border border-border px-3 py-2.5"><p className="text-xs text-muted">Work Preference</p><p className="font-semibold text-charcoal">Internship → Full-time</p></div>
            </div>
          </Card>

          <Card>
            <h3 className="font-bold text-charcoal">Skills</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {mockSkills.slice(0,10).map(s=>(
                <span key={s.id} className="rounded-full bg-sage border border-sage px-3 py-1.5 text-xs font-semibold text-primary">{s.name} • {s.level}%</span>
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-charcoal">Projects</h3>
              <span className="text-xs text-muted">{mockProjects.length} projects</span>
            </div>
            <div className="mt-4 space-y-3">
              {mockProjects.map(p=>(
                <div key={p.id} className="rounded-xl border border-border bg-white p-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-charcoal">{p.title}</p>
                    <p className="text-xs text-muted mt-1">{p.desc}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">{p.skills.map(s=> <span key={s} className="rounded-full bg-background border border-border px-2 py-0.5 text-[11px] font-semibold text-charcoal">{s}</span>)}</div>
                  </div>
                  <Badge variant={p.status==='Completed' ? 'success' : 'default'} className="shrink-0">{p.status}</Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="font-bold text-charcoal">Certifications</h3>
            <div className="mt-4 space-y-3">
              {mockCertificates.map(c=>(
                <div key={c.id} className="rounded-xl border border-border bg-background/50 p-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-charcoal">{c.title}</p>
                    <p className="text-xs text-muted">{c.issuer} • {c.date} • {c.credential}</p>
                  </div>
                  <Button size="sm" variant="outline">View</Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
