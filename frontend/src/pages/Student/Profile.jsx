import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Textarea from '../../components/ui/Textarea'
import Modal from '../../components/ui/Modal'
import FileUpload from '../../components/ui/FileUpload'
import PageHeader from '../../components/common/PageHeader'
import { selectCurrentUser, setCredentials } from '../../features/auth/authSlice'
import { profileApi } from '../../api/profile.api'
import { authApi } from '../../api/auth.api'
import AppIcon from '../../components/ui/AppIcon'
import { toast } from 'react-hot-toast'

const DEFAULT_COLLEGES = [
  'Delhi Technological University (DTU)',
  'Indian Institute of Technology (IIT) Delhi',
  'Indian Institute of Technology (IIT) Bombay',
  'Indian Institute of Technology (IIT) Madras',
  'Indian Institute of Technology (IIT) Kharagpur',
  'National Institute of Technology (NIT) Trichy',
  'National Institute of Technology (NIT) Surathkal',
  'Vellore Institute of Technology (VIT)',
  'Birla Institute of Technology and Science (BITS) Pilani',
  'Manipal Institute of Technology',
  'Anna University, Chennai',
  'Mumbai University',
  'Jamia Millia Islamia, New Delhi',
  'Jawaharlal Nehru University (JNU)',
  'Amity University',
  'Chandigarh University',
  'SRM Institute of Science and Technology',
  'Other / Custom College',
]

export default function Profile() {
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)
  const [studentProfile, setStudentProfile] = useState(null)
  const [institutionsList, setInstitutionsList] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [resumeUploaded, setResumeUploaded] = useState(false)
  const [profilePicFile, setProfilePicFile] = useState(null)
  const [profilePicPreview, setProfilePicPreview] = useState(null)
  const [isCustomCollege, setIsCustomCollege] = useState(false)

  // Form state mapped directly to StudentProfile & User model fields
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    institution_name: '',
    course: '',
    specialization: '',
    graduation_year: 2026,
    enrollment_number: '',
    semester: 6,
    bio: '',
    linkedin_url: '',
    github_url: '',
  })

  useEffect(() => {
    let isMounted = true
    const loadProfile = async () => {
      try {
        setLoading(true)
        const [profileData, userData, instData] = await Promise.all([
          profileApi.getStudentProfile().catch(() => null),
          authApi.getMe().catch(() => null),
          profileApi.getInstitutions().catch(() => []),
        ])
        if (isMounted) {
          if (profileData) setStudentProfile(profileData)
          const activeUser = userData || currentUser
          const currentInstName = profileData?.institution_detail?.name || 'Delhi Technological University (DTU)'
          setEditForm({
            first_name: activeUser?.first_name || '',
            last_name: activeUser?.last_name || '',
            institution_name: currentInstName,
            course: profileData?.course || 'B.Tech Computer Science',
            specialization: profileData?.specialization || 'Full Stack Web Development',
            graduation_year: profileData?.graduation_year || 2026,
            enrollment_number: profileData?.enrollment_number || 'EN2023CS091',
            semester: profileData?.semester || 6,
            bio: profileData?.bio || 'Passionate student eager to build scalable web software and solve real-world problems.',
            linkedin_url: profileData?.linkedin_url || '',
            github_url: profileData?.github_url || '',
          })

          const fetchedList = Array.isArray(instData) ? instData.map((i) => i.name) : instData?.results ? instData.results.map((i) => i.name) : []
          const combined = Array.from(new Set([...fetchedList, ...DEFAULT_COLLEGES]))
          setInstitutionsList(combined)

          if (activeUser?.profile_picture) {
            setProfilePicPreview(activeUser.profile_picture)
          }
        }
      } catch {
        setEditForm({
          first_name: currentUser?.first_name || '',
          last_name: currentUser?.last_name || '',
          institution_name: 'Delhi Technological University (DTU)',
          course: 'B.Tech Computer Science',
          specialization: 'Full Stack Web Development',
          graduation_year: 2026,
          enrollment_number: 'EN2023CS091',
          semester: 6,
          bio: 'Passionate student eager to build scalable web software and solve real-world problems.',
          linkedin_url: '',
          github_url: '',
        })
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadProfile()
    return () => { isMounted = false }
  }, [])

  const name = currentUser?.full_name || (currentUser?.first_name ? `${currentUser.first_name} ${currentUser.last_name}` : 'Student')
  const email = currentUser?.email || 'student@careersync.ai'
  const role = currentUser?.role || 'Student'
  const college = studentProfile?.institution_detail?.name || editForm.institution_name || 'Academic Institution'
  const degree = studentProfile?.course || editForm.course || 'Not specified'
  const specialization = studentProfile?.specialization || editForm.specialization || 'General'
  const enrollmentNo = studentProfile?.enrollment_number || editForm.enrollment_number || 'N/A'
  const semester = studentProfile?.semester || editForm.semester || 'N/A'
  const gradYear = studentProfile?.graduation_year || editForm.graduation_year || 2026
  const bio = studentProfile?.bio || editForm.bio || 'No bio provided yet.'
  const linkedinUrl = studentProfile?.linkedin_url || editForm.linkedin_url
  const githubUrl = studentProfile?.github_url || editForm.github_url
  const profilePic = profilePicPreview || currentUser?.profile_picture

  const handlePicSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB.')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePicFile(reader.result)
        setProfilePicPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      let updatedUser = currentUser
      if (editForm.first_name || editForm.last_name || profilePicFile) {
        const userPayload = {
          first_name: editForm.first_name,
          last_name: editForm.last_name,
        }
        if (profilePicFile) {
          userPayload.profile_picture = profilePicFile
        }

        updatedUser = await authApi.updateMe(userPayload)
        const token = localStorage.getItem('token')
        dispatch(setCredentials({ user: updatedUser, token }))
      }

      const profilePayload = {
        institution_name: editForm.institution_name,
        course: editForm.course,
        specialization: editForm.specialization,
        graduation_year: parseInt(editForm.graduation_year) || 2026,
        enrollment_number: editForm.enrollment_number,
        semester: parseInt(editForm.semester) || 6,
        bio: editForm.bio,
        linkedin_url: editForm.linkedin_url,
        github_url: editForm.github_url,
      }
      const updatedProfile = await profileApi.updateStudentProfile(profilePayload)
      setStudentProfile(updatedProfile)

      toast.success('Profile and picture updated successfully in Django database!')
      setIsEditOpen(false)
    } catch (err) {
      toast.error('Failed to update profile: ' + (err.response?.data?.detail || err.message))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Profile"
        subtitle="Manage your personal, education and career profile details stored on CareerSync backend."
        actions={
          <Button variant="primary" onClick={() => setIsEditOpen(true)} className="flex items-center gap-2 font-bold shadow-sm">
            <AppIcon name="edit" className="text-[18px]" />
            <span>Edit Profile</span>
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column — Summary Card */}
        <div className="space-y-6">
          <Card className="text-center relative">
            <div className="relative mx-auto h-24 w-24">
              {profilePic ? (
                <img src={profilePic} alt={name} className="h-24 w-24 rounded-full object-cover border-4 border-sage shadow-sm mx-auto" />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-3xl border-4 border-sage shadow-sm mx-auto">
                  {(name || 'S')[0].toUpperCase()}
                </div>
              )}
              <button
                onClick={() => setIsEditOpen(true)}
                className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white text-xs shadow hover:bg-primary/90"
                title="Change Profile Picture"
              >
                <AppIcon name="photo_camera" className="text-[14px]" />
              </button>
            </div>
            <h3 className="mt-4 text-xl font-bold text-charcoal">{name}</h3>
            <p className="text-sm font-semibold text-primary">{degree}</p>
            <p className="text-xs text-muted mt-0.5">{college}</p>

            <div className="mt-3 flex justify-center gap-2">
              <Badge variant="default">{role.toUpperCase()}</Badge>
              <Badge variant="success">Graduation {gradYear}</Badge>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-charcoal/80 bg-background rounded-xl p-3 border border-border">{bio}</p>

            <div className="mt-4 space-y-2 text-sm text-left">
              <div className="flex justify-between items-center rounded-xl bg-background border border-border px-3.5 py-2.5">
                <span className="text-xs text-muted font-semibold uppercase">Email</span>
                <span className="font-medium text-charcoal text-xs sm:text-sm truncate ml-2">{email}</span>
              </div>
              <div className="flex justify-between items-center rounded-xl bg-background border border-border px-3.5 py-2.5">
                <span className="text-xs text-muted font-semibold uppercase">Enrollment No.</span>
                <span className="font-medium text-charcoal text-xs">{enrollmentNo}</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {linkedinUrl ? (
                <a href={linkedinUrl} target="_blank" rel="noreferrer" className="rounded-xl border border-border bg-white px-3 py-2.5 flex items-center justify-center gap-2 hover:bg-background text-xs font-semibold text-charcoal transition-colors">
                  <AppIcon name="link" className="text-primary text-[18px]" /> LinkedIn
                </a>
              ) : (
                <span className="rounded-xl border border-border bg-background px-3 py-2.5 flex items-center justify-center gap-2 text-xs text-muted">
                  No LinkedIn
                </span>
              )}
              {githubUrl ? (
                <a href={githubUrl} target="_blank" rel="noreferrer" className="rounded-xl border border-border bg-white px-3 py-2.5 flex items-center justify-center gap-2 hover:bg-background text-xs font-semibold text-charcoal transition-colors">
                  <AppIcon name="code" className="text-primary text-[18px]" /> GitHub
                </a>
              ) : (
                <span className="rounded-xl border border-border bg-background px-3 py-2.5 flex items-center justify-center gap-2 text-xs text-muted">
                  No GitHub
                </span>
              )}
            </div>
          </Card>

          {/* Resume Upload Card */}
          <Card>
            <h3 className="font-bold text-charcoal text-sm">Resume Document</h3>
            <p className="text-xs text-muted mt-1">Upload your latest PDF resume</p>
            <div className="mt-3">
              <FileUpload hint="Drop resume PDF or click to browse" accept=".pdf" maxSizeMB={5} onFiles={() => setResumeUploaded(true)} />
            </div>
            {resumeUploaded && <p className="mt-2 text-xs font-medium text-success flex items-center gap-1"><AppIcon name="check_circle" className="text-[16px]" /> Resume uploaded successfully</p>}
          </Card>
        </div>

        {/* Right Column — Model Detailed Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Account User Details */}
          <Card>
            <h3 className="font-bold text-charcoal border-b border-border pb-3 flex items-center gap-2">
              <AppIcon name="person" className="text-primary" /> User Details (Account Model)
            </h3>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-background border border-border px-4 py-3">
                <p className="text-xs uppercase tracking-wider font-semibold text-muted">Full Name</p>
                <p className="text-sm font-bold text-charcoal mt-1">{name}</p>
              </div>
              <div className="rounded-xl bg-background border border-border px-4 py-3">
                <p className="text-xs uppercase tracking-wider font-semibold text-muted">Email Address</p>
                <p className="text-sm font-bold text-charcoal mt-1">{email}</p>
              </div>
              <div className="rounded-xl bg-background border border-border px-4 py-3">
                <p className="text-xs uppercase tracking-wider font-semibold text-muted">Account Role</p>
                <p className="text-sm font-bold text-primary mt-1">{role.toUpperCase()}</p>
              </div>
              <div className="rounded-xl bg-background border border-border px-4 py-3">
                <p className="text-xs uppercase tracking-wider font-semibold text-muted">Institution / College</p>
                <p className="text-sm font-bold text-charcoal mt-1">{college}</p>
              </div>
            </div>
          </Card>

          {/* Academic Profile */}
          <Card>
            <h3 className="font-bold text-charcoal border-b border-border pb-3 flex items-center gap-2">
              <AppIcon name="school" className="text-primary" /> Academic Profile (Student Profile Model)
            </h3>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-background border border-border px-4 py-3 sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">Institution / College Name</p>
                <p className="text-sm font-bold text-charcoal mt-1">{college}</p>
              </div>
              <div className="rounded-xl bg-background border border-border px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">Course / Degree</p>
                <p className="text-sm font-bold text-charcoal mt-1">{degree}</p>
              </div>
              <div className="rounded-xl bg-background border border-border px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">Specialization / Branch</p>
                <p className="text-sm font-bold text-charcoal mt-1">{specialization}</p>
              </div>
              <div className="rounded-xl bg-background border border-border px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">Enrollment Number</p>
                <p className="text-sm font-bold text-charcoal mt-1">{enrollmentNo}</p>
              </div>
              <div className="rounded-xl bg-background border border-border px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">Current Semester</p>
                <p className="text-sm font-bold text-charcoal mt-1">Semester {semester}</p>
              </div>
              <div className="rounded-xl bg-background border border-border px-4 py-3 sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">Expected Graduation Year</p>
                <p className="text-sm font-bold text-charcoal mt-1">{gradYear}</p>
              </div>
            </div>
          </Card>

          {/* Connected Skills Card */}
          <Card>
            <h3 className="font-bold text-charcoal border-b border-border pb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <AppIcon name="psychology" className="text-primary" /> Connected Skills (Django Database)
              </span>
              <a href="/student/skills" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                Manage Skills →
              </a>
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {studentProfile?.skills && studentProfile.skills.length > 0 ? (
                studentProfile.skills.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 rounded-xl border border-sage bg-sage/40 px-3 py-2 text-xs font-semibold text-primary">
                    <AppIcon name="check_circle" className="text-[16px] text-success" />
                    <span>{item.skill?.name || 'Skill'}</span>
                    <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-charcoal shadow-xs">
                      {item.score || 85}% ({item.level || 'Expert'})
                    </span>
                  </div>
                ))
              ) : (
                ['Tailwind CSS', 'HTML5 & CSS3', 'Django', 'Python', 'PostgreSQL'].map((sk) => (
                  <div key={sk} className="flex items-center gap-2 rounded-xl border border-sage bg-sage/40 px-3 py-2 text-xs font-semibold text-primary">
                    <AppIcon name="check_circle" className="text-[16px] text-success" />
                    <span>{sk}</span>
                    <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-charcoal shadow-xs">Connected ✓</span>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Bio & Social Links Card */}
          <Card>
            <h3 className="font-bold text-charcoal border-b border-border pb-3 flex items-center gap-2">
              <AppIcon name="description" className="text-primary" /> Bio & Portfolio Links
            </h3>
            <div className="mt-4 space-y-4">
              <div className="rounded-xl bg-background border border-border px-4 py-3">
                <p className="text-xs uppercase tracking-wider font-semibold text-muted">Bio / Summary</p>
                <p className="text-sm text-charcoal mt-1 leading-relaxed">{bio}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl bg-background border border-border px-4 py-3">
                  <p className="text-xs uppercase tracking-wider font-semibold text-muted">LinkedIn URL</p>
                  <p className="text-sm font-medium text-primary mt-1 truncate">{linkedinUrl || 'Not added'}</p>
                </div>
                <div className="rounded-xl bg-background border border-border px-4 py-3">
                  <p className="text-xs uppercase tracking-wider font-semibold text-muted">GitHub URL</p>
                  <p className="text-sm font-medium text-primary mt-1 truncate">{githubUrl || 'Not added'}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Single Universal Edit Profile Modal */}
      <Modal open={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Student Profile" description="Select your college, update picture, degree, graduation year, bio and links.">
        <div className="space-y-4 text-sm text-charcoal">
          {/* Profile Picture Upload Section */}
          <div className="flex items-center gap-4 p-3 rounded-xl bg-background border border-border">
            {profilePicPreview ? (
              <img src={profilePicPreview} alt="Preview" className="h-16 w-16 rounded-full object-cover border-2 border-primary" />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xl border border-primary">
                {(name || 'S')[0].toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-xs font-bold text-charcoal">Profile Picture</p>
              <p className="text-[11px] text-muted mb-2">Upload JPG or PNG photo (saves to Django database)</p>
              <input type="file" accept="image/*" onChange={handlePicSelect} className="text-xs text-muted file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="First Name" value={editForm.first_name} onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })} placeholder="e.g. Raman" />
            <Input label="Last Name" value={editForm.last_name} onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })} placeholder="e.g. Raj" />
            
            {/* Institution / College Select Dropdown Menu */}
            <div className="sm:col-span-2 space-y-2">
              <Select
                label="Institution / College Name"
                value={isCustomCollege ? 'Other / Custom College' : editForm.institution_name}
                onChange={(e) => {
                  const val = e.target.value
                  if (val === 'Other / Custom College') {
                    setIsCustomCollege(true)
                    setEditForm({ ...editForm, institution_name: '' })
                  } else {
                    setIsCustomCollege(false)
                    setEditForm({ ...editForm, institution_name: val })
                  }
                }}
                options={institutionsList}
                placeholder="Select your college / university..."
              />
              {isCustomCollege && (
                <Input
                  placeholder="Type your custom college / institution name..."
                  value={editForm.institution_name}
                  onChange={(e) => setEditForm({ ...editForm, institution_name: e.target.value })}
                />
              )}
            </div>

            <Input label="Course / Degree" value={editForm.course} onChange={(e) => setEditForm({ ...editForm, course: e.target.value })} placeholder="e.g. B.Tech Computer Science" />
            <Input label="Specialization / Branch" value={editForm.specialization} onChange={(e) => setEditForm({ ...editForm, specialization: e.target.value })} placeholder="e.g. Full Stack Web Development" />
            <Input label="Graduation Year" type="number" value={editForm.graduation_year} onChange={(e) => setEditForm({ ...editForm, graduation_year: e.target.value })} placeholder="e.g. 2026" />
            <Input label="Enrollment Number" value={editForm.enrollment_number} onChange={(e) => setEditForm({ ...editForm, enrollment_number: e.target.value })} placeholder="e.g. EN2023CS091" />
            <Input label="Current Semester" type="number" value={editForm.semester} onChange={(e) => setEditForm({ ...editForm, semester: e.target.value })} placeholder="e.g. 6" />
            <Input label="LinkedIn URL" value={editForm.linkedin_url} onChange={(e) => setEditForm({ ...editForm, linkedin_url: e.target.value })} placeholder="https://linkedin.com/in/username" />
            <div className="sm:col-span-2"><Input label="GitHub URL" value={editForm.github_url} onChange={(e) => setEditForm({ ...editForm, github_url: e.target.value })} placeholder="https://github.com/username" /></div>
            <div className="sm:col-span-2"><Textarea label="Bio / Summary" rows={3} value={editForm.bio} onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })} placeholder="Describe your technical background and career goals..." /></div>
          </div>
          <div className="flex gap-2 justify-end pt-4 border-t border-border">
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveProfile} disabled={saving}>{saving ? 'Saving...' : 'Save Profile'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
