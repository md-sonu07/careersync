import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import PageHeader from '../../components/common/PageHeader'
import { mockCertificates } from '../../utils/mockData'
import AppIcon from '../../components/ui/AppIcon';

export default function Certificates() {
  return (
    <div className="space-y-6">
      <PageHeader title="Certificates" subtitle="Verified completions — share on LinkedIn and with recruiters." />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {mockCertificates.map((cert) => (
          <Card key={cert.id} hover className="flex flex-col">
            <div className="flex h-28 items-center justify-center rounded-xl bg-sage border border-sage">
              <AppIcon name="workspace_premium" className="text-primary text-[40px]" />
            </div>
            <h3 className="mt-4 text-sm font-bold text-charcoal">{cert.title}</h3>
            <p className="text-xs text-muted">Issued by {cert.issuer} • {cert.date}</p>
            <p className="mt-1 font-mono text-[11px] text-muted">ID: {cert.credential}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {cert.skills.map((s) => (
                <span key={s} className="rounded-full bg-white border border-border px-2 py-0.5 text-[11px] font-semibold text-charcoal">{s}</span>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Button size="sm" className="flex-1">View</Button>
              <Button size="sm" variant="outline" className="flex-1">Share</Button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="text-center py-10 border-dashed">
        <p className="text-sm text-muted">Complete a course to earn your next certificate — you’re 64% through React Mastery!</p>
      </Card>
    </div>
  )
}
