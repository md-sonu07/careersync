import { useState, useEffect } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs'
import Textarea from '../../components/ui/Textarea'
import AppIcon from '../../components/ui/AppIcon'
import apiClient from '../../api/axios'
import { toast } from 'react-hot-toast'

export default function Verification({ defaultType = 'company' }) {
  const [tab, setTab] = useState('Pending')
  const [action, setAction] = useState(null)
  const [rejectReason, setRejectReason] = useState('')
  const [loading, setLoading] = useState(true)
  const [lists, setLists] = useState({
    Pending: [],
    Verified: [],
    Rejected: [],
  })

  const loadVerifications = async () => {
    try {
      setLoading(true)
      const { data } = await apiClient.get('/companies/verifications/')
      let items = Array.isArray(data) ? data : []

      if (defaultType === 'company') {
        items = items.filter((i) => i.type === 'Company' || i.entity_type === 'company')
      } else if (defaultType === 'college') {
        items = items.filter((i) => i.type === 'College' || i.entity_type === 'institution')
      }

      const pending = items.filter((i) => !i.is_verified && i.reason === '—')
      const verified = items.filter((i) => i.is_verified)
      const rejected = items.filter((i) => !i.is_verified && i.reason !== '—')

      setLists({
        Pending: pending,
        Verified: verified,
        Rejected: rejected,
      })
    } catch {
      toast.error('Failed to load verification list.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadVerifications()
  }, [defaultType])

  const handleVerify = async () => {
    if (!action) return
    try {
      await apiClient.post(`/companies/verifications/${action.id}/action/`, { action: 'verify' })
      toast.success(`${action.name} verified successfully ✓`)
      setAction(null)
      loadVerifications()
    } catch {
      toast.error('Failed to verify entity.')
    }
  }

  const handleReject = async () => {
    if (!action) return
    try {
      await apiClient.post(`/companies/verifications/${action.id}/action/`, { action: 'reject', reason: rejectReason })
      toast.success(`${action.name} verification rejected`)
      setAction(null)
      setRejectReason('')
      loadVerifications()
    } catch {
      toast.error('Failed to reject entity.')
    }
  }

  const pageTitle = defaultType === 'college' ? 'College Verification Console' : defaultType === 'company' ? 'Industry Verification Console' : 'Verification Console'
  const pageSubtitle = defaultType === 'college' ? 'Approve & verify colleges & universities — verified institutions show ✓ badge across the platform' : 'Approve & verify industry partners — verified companies show ✓ badge across the platform'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">{pageTitle}</h1>
          <p className="text-sm text-muted mt-1">{pageSubtitle}</p>
        </div>
        <Button variant="outline" size="sm" onClick={loadVerifications} disabled={loading}>
          <AppIcon name="refresh" className="text-[16px]" /> Refresh
        </Button>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="Pending">Pending ({lists.Pending.length})</TabsTrigger>
          <TabsTrigger value="Verified">Verified ({lists.Verified.length})</TabsTrigger>
          <TabsTrigger value="Rejected">Rejected ({lists.Rejected.length})</TabsTrigger>
        </TabsList>

        {['Pending', 'Verified', 'Rejected'].map((t) => (
          <TabsContent key={t} value={t}>
            <Card className="!p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border bg-background/60">
                      <th className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-muted">Entity</th>
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-muted">Type</th>
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-muted">Documents</th>
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-muted">Verification Date</th>
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-muted">Reviewer</th>
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-muted">Reason (if rejected)</th>
                      <th className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-muted">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lists[t].map((row) => (
                      <tr key={row.id} className="border-b border-border last:border-0 hover:bg-background/40">
                        <td className="px-6 py-3">
                          <p className="text-sm font-semibold text-charcoal flex items-center gap-1.5">
                            {row.name} {t === 'Verified' && <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-success text-white text-[10px]">✓</span>}
                          </p>
                        </td>
                        <td className="px-4 py-3"><Badge variant={row.type === 'Company' ? 'default' : 'accent'}>{row.type}</Badge></td>
                        <td className="px-4 py-3 text-xs text-primary underline cursor-pointer">{row.docs}</td>
                        <td className="px-4 py-3 text-sm text-muted">{row.date}</td>
                        <td className="px-4 py-3 text-sm text-muted">{row.reviewer}</td>
                        <td className="px-4 py-3 text-xs text-danger max-w-[200px] truncate">{row.reason}</td>
                        <td className="px-6 py-3 whitespace-nowrap">
                          {t === 'Pending' ? (
                            <div className="flex gap-1.5 whitespace-nowrap">
                              <Button size="sm" className="bg-success hover:bg-success/90" onClick={() => setAction({ ...row, mode: 'verify' })}>Verify</Button>
                              <Button size="sm" variant="outline" className="!text-danger !border-danger/20" onClick={() => setAction({ ...row, mode: 'reject' })}>Reject</Button>
                            </div>
                          ) : t === 'Verified' ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-success/10 text-success px-3 py-1 text-xs font-bold whitespace-nowrap shrink-0">✓ Verified</span>
                          ) : (
                            <span className="inline-flex rounded-full bg-danger/10 text-danger px-3 py-1 text-xs font-bold whitespace-nowrap shrink-0">Rejected</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {lists[t].length === 0 && <p className="text-center text-sm text-muted py-10">No entries in {t}.</p>}
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <Modal open={!!action} onClose={() => setAction(null)} title={action?.mode === 'verify' ? `Verify ${action?.name}?` : `Reject ${action?.name}?`} description={action?.mode === 'verify' ? 'This entity will show a verified badge ✓ across the platform.' : 'Provide a reason for rejection.'}>
        {action?.mode === 'verify' ? (
          <div className="space-y-4">
            <div className="rounded-xl bg-success/5 border border-success/20 p-3 flex gap-2 text-sm text-success"><AppIcon name="verified" /> Verifying will grant <strong className="mx-1">{action.name}</strong> a ✓ badge and enable posting.</div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setAction(null)}>Cancel</Button>
              <Button className="bg-success hover:bg-success/90" onClick={handleVerify}>Confirm Verify ✓</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Textarea label="Rejection reason" placeholder="Explain why documents were insufficient..." value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} rows={3} />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setAction(null)}>Cancel</Button>
              <Button variant="primary" className="!bg-danger hover:!bg-danger/90" onClick={handleReject}>Confirm Reject</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
