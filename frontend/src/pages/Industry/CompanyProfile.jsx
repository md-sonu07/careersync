import { useState, useEffect } from 'react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Textarea from '../../components/ui/Textarea'
import Select from '../../components/ui/Select'
import AppIcon from '../../components/ui/AppIcon'
import { profileApi } from '../../api/profile.api'
import { opportunityApi } from '../../api/opportunity.api'
import { applicationApi } from '../../api/application.api'
import { toast } from 'react-hot-toast'

export default function CompanyProfile() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [stats, setStats] = useState({ postings: 0, applications: 0 })

  const [form, setForm] = useState({
    company_name: '',
    official_email: '',
    website: '',
    industry_type: 'Software & Technology',
    company_size: '11-50',
    description: '',
    profile_picture: '',
    is_verified: false,
  })

  const loadCompanyData = async () => {
    try {
      setLoading(true)
      const [profileData, oppsData, appsData] = await Promise.all([
        profileApi.getCompanyProfile(),
        opportunityApi.getOpportunities({ my_posts: 'true' }).catch(() => []),
        applicationApi.getCompanyApplications().catch(() => []),
      ])

      if (profileData) {
        setForm({
          company_name: profileData.company_name || '',
          official_email: profileData.official_email || '',
          website: profileData.website || '',
          industry_type: profileData.industry_type || 'Software & Technology',
          company_size: profileData.company_size || '11-50',
          description: profileData.description || '',
          profile_picture: profileData.profile_picture || profileData.logo || '',
          is_verified: profileData.is_verified || false,
        })
      }

      setStats({
        postings: Array.isArray(oppsData) ? oppsData.length : 0,
        applications: Array.isArray(appsData) ? appsData.length : 0,
      })
    } catch (err) {
      toast.error('Failed to load company profile from database.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCompanyData()
  }, [])

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB.')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, profile_picture: reader.result }))
        toast.success('Image loaded for profile logo!')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async (e) => {
    e?.preventDefault()
    try {
      setSaving(true)
      const updated = await profileApi.updateCompanyProfile({
        ...form,
        logo: form.profile_picture,
      })
      toast.success('Company profile & logo updated successfully in Django database!')
      if (updated) {
        setForm((prev) => ({ ...prev, ...updated, profile_picture: updated.profile_picture || updated.logo || prev.profile_picture }))
      }
    } catch (err) {
      toast.error('Failed to update company profile: ' + (err.response?.data?.detail || err.message))
    } finally {
      setSaving(false)
    }
  }

  const logoAvatarUrl = form.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(form.company_name || 'Company')}&background=0D9488&color=ffffff&bold=true&font-size=0.4`

  return (
    <div className="space-y-6 min-h-screen">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Company Profile</h1>
          <p className="text-sm text-muted">Manage your organization logo, details, industry sector, website, and verification status.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={loadCompanyData} disabled={loading}>
            <AppIcon name="refresh" className="text-[16px]" /> Refresh
          </Button>
          <Button variant="primary" size="sm" onClick={handleSave} disabled={saving || loading}>
            {saving ? 'Saving...' : 'Save Profile Changes'}
          </Button>
        </div>
      </div>

      {loading ? (
        <Card className="p-12 text-center text-muted">
          <AppIcon name="sync" className="animate-spin text-3xl text-primary mx-auto mb-2" />
          Loading company profile from database...
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column: Quick Profile Card & Logo Preview */}
          <div className="space-y-6 lg:col-span-1">
            <Card className="p-6 text-center space-y-4">
              <div className="relative inline-block group">
                <img
                  src={logoAvatarUrl}
                  alt={form.company_name}
                  className="h-28 w-28 rounded-3xl mx-auto object-cover border-2 border-primary/20 shadow-md bg-white"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(form.company_name || 'Company')}&background=0D9488&color=ffffff&bold=true`
                  }}
                />
                {form.is_verified && (
                  <span className="absolute bottom-0 right-0 bg-success text-white p-1 rounded-full shadow" title="Verified Employer">
                    <AppIcon name="check_circle" className="text-[18px]" />
                  </span>
                )}
              </div>

              <div>
                <h2 className="text-xl font-bold text-charcoal">{form.company_name || 'Company Name'}</h2>
                <p className="text-xs text-muted mt-0.5">{form.industry_type} • {form.company_size} employees</p>
              </div>

              <div className="pt-2">
                <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl border border-primary text-primary px-3 py-1.5 text-xs font-bold hover:bg-sage transition-colors">
                  <AppIcon name="upload" className="text-[16px]" /> Upload Logo File
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                </label>
              </div>

              <div className="flex justify-center gap-2 pt-1">
                <Badge variant={form.is_verified ? 'success' : 'warning'} className="whitespace-nowrap">
                  {form.is_verified ? 'Verified Employer ✓' : 'Pending Verification'}
                </Badge>
              </div>

              <div className="border-t border-border pt-4 grid grid-cols-2 gap-3 text-center">
                <div className="rounded-2xl bg-background border border-border p-3">
                  <p className="text-xs text-muted font-medium">Postings</p>
                  <p className="text-lg font-bold text-primary">{stats.postings}</p>
                </div>
                <div className="rounded-2xl bg-background border border-border p-3">
                  <p className="text-xs text-muted font-medium">Applicants</p>
                  <p className="text-lg font-bold text-success">{stats.applications}</p>
                </div>
              </div>

              {form.website && (
                <a
                  href={form.website.startsWith('http') ? form.website : `https://${form.website}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline pt-2"
                >
                  <AppIcon name="language" className="text-[16px]" /> Visit Official Website →
                </a>
              )}
            </Card>

            <Card className="p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
                <AppIcon name="verified_user" className="text-[16px] text-primary" /> Verification Status
              </h3>
              <p className="text-xs text-charcoal leading-relaxed">
                Verified companies receive higher applicant response rates and prominent placement on candidate opportunity listings.
              </p>
              <div className="pt-1">
                <Badge variant={form.is_verified ? 'success' : 'default'}>
                  {form.is_verified ? 'Corporate Domain Verified' : 'Submit Docs for Verification'}
                </Badge>
              </div>
            </Card>
          </div>

          {/* Right Column: Edit Profile Form */}
          <div className="lg:col-span-2">
            <Card className="p-6 space-y-5">
              <h2 className="text-lg font-bold text-charcoal border-b border-border pb-3 flex items-center gap-2">
                <AppIcon name="domain" className="text-primary text-[20px]" /> Organization Details
              </h2>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Company Name *"
                    value={form.company_name}
                    onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                    placeholder="e.g. Acme Innovations Tech Pvt Ltd"
                    required
                  />
                  <Input
                    label="Official Email *"
                    type="email"
                    value={form.official_email}
                    onChange={(e) => setForm({ ...form, official_email: e.target.value })}
                    placeholder="e.g. hr@company.com"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Company Logo / Profile Image URL"
                    value={form.profile_picture}
                    onChange={(e) => setForm({ ...form, profile_picture: e.target.value })}
                    placeholder="https://example.com/logo.png or upload above"
                  />
                  <Input
                    label="Official Website URL"
                    value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                    placeholder="e.g. https://company.com"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Industry Sector"
                    value={form.industry_type}
                    onChange={(e) => setForm({ ...form, industry_type: e.target.value })}
                    placeholder="e.g. Software & Technology"
                  />
                  <Select
                    label="Company Size"
                    value={form.company_size}
                    onChange={(e) => setForm({ ...form, company_size: e.target.value })}
                    options={[
                      { value: '1-10', label: '1-10 employees (Micro)' },
                      { value: '11-50', label: '11-50 employees (Small)' },
                      { value: '51-200', label: '51-200 employees (Medium)' },
                      { value: '201-500', label: '201-500 employees (Large)' },
                      { value: '500+', label: '500+ employees (Enterprise)' },
                    ]}
                  />
                </div>

                <Textarea
                  label="Company Bio & Overview"
                  rows={5}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe your company mission, tech stack, culture, and opportunities offered to students..."
                />

                <div className="flex justify-end gap-3 pt-3 border-t border-border">
                  <Button type="button" variant="outline" onClick={loadCompanyData}>
                    Discard Changes
                  </Button>
                  <Button type="submit" variant="primary" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Profile Changes'}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
