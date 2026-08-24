import { Link, useParams } from 'react-router-dom'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import PageHeader from '../components/common/PageHeader'
import AppIcon from '../components/ui/AppIcon';

const PublicCourseDetail = () => {
  const { id } = useParams()
  return (
    <div className="max-w-6xl mx-auto px-6 md:px-8 py-10 space-y-6">
      <PageHeader
        title={`React & Modern Frontend ${id ? `#${id}` : ''}`}
        subtitle="Intermediate • 24 Lessons • 6h 40m • Certificate"
        actions={
          <div className="flex gap-3">
            <Link to="/courses">
              <Button variant="outline">Back</Button>
            </Link>
            <Link to="/register">
              <Button>Enroll Now</Button>
            </Link>
          </div>
        }
      />
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-0 overflow-hidden">
            <div className="aspect-video bg-sage flex items-center justify-center">
              <AppIcon name="play_circle" className="text-5xl text-primary" />
            </div>
            <div className="p-6">
              <h4 className="font-bold mb-2">What you will learn</h4>
              <ul className="list-disc pl-5 text-sm text-charcoal/70 space-y-1">
                <li>Component architecture and reusable patterns</li>
                <li>State management with hooks and context</li>
                <li>API integration and performance optimization</li>
              </ul>
              <div className="mt-4 flex gap-2">
                <Badge>React</Badge>
                <Badge>JavaScript</Badge>
                <Badge>APIs</Badge>
              </div>
            </div>
          </Card>
        </div>
        <Card>
          <h4 className="font-bold mb-2">Instructor</h4>
          <p className="text-sm font-medium">Dr. Sarah Chen</p>
          <p className="text-xs text-muted">Senior Frontend Engineer, TechNova</p>
          <div className="mt-4 text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-muted">Rating</span>
              <span>4.8 ★ (2.4k)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Students</span>
              <span>12,482</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Certificate</span>
              <span className="text-success">Included</span>
            </div>
          </div>
          <Link to="/register" className="block mt-6">
            <Button className="w-full">Enroll — Free</Button>
          </Link>
        </Card>
      </div>
    </div>
  )
}

export default PublicCourseDetail
