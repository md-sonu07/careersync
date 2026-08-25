import { useState, useEffect } from 'react'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import AppIcon from '../../components/ui/AppIcon'
import { useAuth } from '../../hooks/useAuth'
import { profileApi } from '../../api/profile.api'

export default function InstituteProfile() {
  const { user: currentUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const [formData, setFormData] = useState({
    institution_name: '',
    website: '',
    city: '',
    state: '',
    country: 'India',
    designation: '',
    department: '',
  })

  useEffect(() => {
    let isMounted = true
    profileApi.getAcademicianProfile()
      .then((data) => {
        if (isMounted && data) {
          setProfile(data)
          const inst = data.institution_detail || {}
          setFormData({
            institution_name: inst.name || data.institution_name || (currentUser?.first_name ? `${currentUser.first_name}` : ''),
            website: inst.website || '',
            city: inst.city || '',
            state: inst.state || '',
            country: inst.country || 'India',
            designation: data.designation || '',
            department: data.department || '',
          })
        }
      })
      .catch((err) => {
        if (isMounted) {
          setFormData({
            institution_name: currentUser?.first_name || '',
            website: '',
            city: '',
            state: '',
            country: 'India',
            designation: '',
            department: '',
          })
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })
    return () => { isMounted = false }
  }, [currentUser])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSuccessMsg('')
    setErrorMsg('')

    try {
      const updated = await profileApi.updateAcademicianProfile(formData)
      setProfile(updated)
      setSuccessMsg('Institution profile updated successfully!')
      setTimeout(() => setSuccessMsg(''), 4000)
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const isVerified = profile?.institution_detail?.is_verified || profile?.user?.is_verified

  if (loading) {
    return (
      <div className="py-20 text-center text-sm text-muted">
        Loading institutional profile…
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal sm:text-3xl">Institute Profile &amp; Settings</h1>
          <p className="mt-1 text-sm text-muted">Manage your institution details, campus location, and official website.</p>
        </div>
        <Badge variant={isVerified ? "success" : "warning"} icon={isVerified ? "verified" : "schedule"}>
          {isVerified ? "Verified Institution" : "Pending Verification"}
        </Badge>
      </div>

      {successMsg && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold animate-fadeIn">
          <AppIcon name="check_circle" className="text-[20px] text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-semibold animate-fadeIn">
          <AppIcon name="error" className="text-[20px] text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Profile Card Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="space-y-6">
          <div className="flex items-center gap-4 pb-5 border-b border-border">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-2xl shadow-sm">
              <AppIcon name="apartment" className="text-[32px]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-charcoal">
                {formData.institution_name || 'Academic Institution'}
              </h2>
              <p className="text-xs text-muted mt-0.5">
                {profile?.user?.email} • {isVerified ? 'Official Institutional Account' : 'Verification In Review'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1.5">
                Institute / University Name <span className="text-danger">*</span>
              </label>
              <Input
                value={formData.institution_name}
                onChange={(e) => setFormData({ ...formData, institution_name: e.target.value })}
                placeholder="e.g. Aryabhatta Knowledge University (AKU)"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1.5">
                Official Website
              </label>
              <Input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://aku.ac.in"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1.5">
                Registered Contact Email
              </label>
              <Input
                value={profile?.user?.email || currentUser?.email || ''}
                disabled
                className="bg-background cursor-not-allowed opacity-75"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1.5">
                City / Campus Location
              </label>
              <Input
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="e.g. Patna"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1.5">
                State / Province
              </label>
              <Input
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="e.g. Bihar"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1.5">
                Country
              </label>
              <Input
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="India"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1.5">
                Department / Faculty Lead
              </label>
              <Input
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="e.g. Training & Placement Cell"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button type="submit" disabled={saving} className="min-w-[140px]">
              {saving ? 'Saving changes…' : 'Save Changes'}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  )
}
