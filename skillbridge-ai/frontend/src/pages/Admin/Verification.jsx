import { useState } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs'
import Textarea from '../../components/ui/Textarea'
import AppIcon from '../../components/ui/AppIcon';

const data = {
  Pending: [
    { id: 1, name: 'TechNova Pvt Ltd', type: 'Company', docs: 'Incorporation.pdf, GST.pdf', date: '2026-02-10', reviewer: '—', reason: '—' },
    { id: 2, name: 'Delhi Technological University', type: 'College', docs: 'Affiliation.pdf, UGC.pdf', date: '2026-02-11', reviewer: '—', reason: '—' },
    { id: 3, name: 'CRED Technologies', type: 'Company', docs: 'Incorporation.pdf', date: '2026-02-12', reviewer: '—', reason: '—' },
  ],
  Verified: [
    { id: 4, name: 'Flipkart Internet', type: 'Company', docs: 'Incorporation.pdf', date: '2026-01-20', reviewer: 'A. Singh', reason: '—' },
    { id: 5, name: 'NSUT Delhi', type: 'College', docs: 'Affiliation.pdf', date: '2026-01-15', reviewer: 'P. Kumar', reason: '—' },
  ],
  Rejected: [
    { id: 6, name: 'Fake Corp Ltd', type: 'Company', docs: 'Incorporation.pdf (invalid)', date: '2026-02-05', reviewer: 'A. Singh', reason: 'Documents not verifiable — incorrect GST' },
  ],
}

export default function Verification() {
  const [tab, setTab] = useState('Pending')
  const [action, setAction] = useState(null)
  const [rejectReason, setRejectReason] = useState('')
  const [lists, setLists] = useState(data)

  const handleVerify = () => {
    if (!action) return
    const item = lists.Pending.find((i) => i.id === action.id)
    if (!item) return
    setLists({
      ...lists,
      Pending: lists.Pending.filter((i) => i.id !== action.id),
      Verified: [...lists.Verified, { ...item, reviewer: 'You', date: new Date().toISOString().slice(0, 10) }],
    })
    setAction(null)
  }

  const handleReject = () => {
    if (!action) return
    const item = lists.Pending.find((i) => i.id === action.id)
    setLists({
      ...lists,
      Pending: lists.Pending.filter((i) => i.id !== action.id),
      Rejected: [...lists.Rejected, { ...item, reviewer: 'You', reason: rejectReason || 'No reason provided' }],
    })
    setAction(null)
    setRejectReason('')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-charcoal">Verification</h1>
        <p className="text-sm text-muted mt-1">Approve companies & colleges — verified entities show ✓ badge across the platform</p>
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
                        <td className="px-6 py-3">
                          {t === 'Pending' ? (
                            <div className="flex gap-1.5">
                              <Button size="sm" className="bg-success hover:bg-success/90" onClick={() => setAction({ ...row, mode: 'verify' })}>Verify</Button>
                              <Button size="sm" variant="outline" className="!text-danger !border-danger/20" onClick={() => setAction({ ...row, mode: 'reject' })}>Reject</Button>
                            </div>
                          ) : t === 'Verified' ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-success/10 text-success px-2.5 py-1 text-xs font-bold">✓ Verified</span>
                          ) : (
                            <span className="inline-flex rounded-full bg-danger/10 text-danger px-2.5 py-1 text-xs font-bold">Rejected</span>
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
