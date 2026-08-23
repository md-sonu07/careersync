import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import PageHeader from '../../components/common/PageHeader'

export default function Settings() {
  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader title="Settings" subtitle="Manage your account and preferences." />
      <Card>
        <h3 className="font-bold text-charcoal">Profile Settings</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Full name" defaultValue="Rahul Sharma" />
          <Input label="Email" defaultValue="rahul.sharma@example.com" />
          <Input label="Career Goal" defaultValue="Full Stack Developer" />
          <Input label="Location" defaultValue="New Delhi, India" />
        </div>
        <Button className="mt-4">Save Changes</Button>
      </Card>
      <Card>
        <h3 className="font-bold text-charcoal">Preferences</h3>
        <div className="mt-3 space-y-3 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Email notifications for new matches</label>
          <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Weekly skill report</label>
          <label className="flex items-center gap-2"><input type="checkbox" /> Dark mode (coming soon)</label>
        </div>
      </Card>
    </div>
  )
}
