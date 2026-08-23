import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import SearchInput from '../../components/ui/SearchInput'
import Select from '../../components/ui/Select'
import { ProgressBar } from '../../components/ui/Progress'
import PageHeader from '../../components/common/PageHeader'
import { mockCourses } from '../../utils/mockData'

export default function Learning() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [skill, setSkill] = useState('')

  const filtered = useMemo(() => mockCourses.filter((c) => {
    if (query && !c.title.toLowerCase().includes(query.toLowerCase()) && !c.skills.join(' ').toLowerCase().includes(query.toLowerCase())) return false
    if (category && c.category !== category) return false
    if (difficulty && c.difficulty !== difficulty) return false
    if (skill && !c.skills.includes(skill)) return false
    return true
  }), [query, category, difficulty, skill])

  return (
    <div className="space-y-6">
      <PageHeader title="Learning Catalog" subtitle="Curated LMS courses mapped to your Full Stack Developer roadmap. Search, filter, and track progress." />

      <Card>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <SearchInput value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search courses or skills..." wrapperClassName="lg:col-span-2" />
          <Select placeholder="All Categories" value={category} onChange={(e) => setCategory(e.target.value)} options={['Frontend', 'Backend', 'DevOps']} />
          <Select placeholder="Any Skill" value={skill} onChange={(e) => setSkill(e.target.value)} options={['React', 'Node.js', 'Docker', 'MongoDB', 'TypeScript']} />
          <Select placeholder="Any Difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} options={['Beginner', 'Intermediate', 'Advanced']} />
        </div>
        {(category || difficulty || skill || query) && (
          <button onClick={() => { setCategory(''); setDifficulty(''); setSkill(''); setQuery('') }} className="mt-3 text-xs font-semibold text-primary hover:underline">Clear filters</button>
        )}
      </Card>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((course) => (
          <Card key={course.id} hover className="flex flex-col overflow-hidden !p-0">
            <div className="relative">
              <img src={course.thumbnail} alt={course.title} className="h-40 w-full object-cover" />
              <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-charcoal shadow-soft">{course.difficulty}</span>
              <span className="absolute right-3 top-3 rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-white shadow-soft">{course.duration}</span>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="line-clamp-2 text-sm font-bold leading-snug text-charcoal">{course.title}</h3>
              <p className="mt-1 text-xs text-muted">by {course.instructor}</p>
              <div className="mt-2 flex items-center gap-2 text-xs text-muted">
                <span className="inline-flex items-center gap-1"><span className="material-symbols-outlined text-[14px] text-amber-500">star</span> {course.rating}</span>
                <span>• {course.students.toLocaleString()} students</span>
                {course.certificate && <Badge variant="success" className="!px-2 !py-0">Certificate</Badge>}
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {course.skills.map((s) => (
                  <span key={s} className="rounded-full bg-sage border border-sage px-2 py-0.5 text-[11px] font-semibold text-primary">{s}</span>
                ))}
              </div>
              {course.progress > 0 && (
                <div className="mt-4">
                  <div className="mb-1 flex justify-between text-xs"><span className="text-muted">Progress</span><span className="font-bold text-charcoal">{course.progress}%</span></div>
                  <ProgressBar value={course.progress} size="sm" />
                </div>
              )}
              <Link to={`/student/courses/${course.id}`} className="mt-4">
                <Button variant={course.progress > 0 ? 'primary' : 'outline'} size="sm" className="w-full">{course.progress > 0 ? 'Continue →' : 'View Course'}</Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card className="text-center py-10"><p className="text-sm text-muted">No courses match your filters.</p></Card>
      )}
    </div>
  )
}
