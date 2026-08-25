import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import SearchInput from '../../components/ui/SearchInput'
import Select from '../../components/ui/Select'
import PageHeader from '../../components/common/PageHeader'
import { courseApi } from '../../api/course.api'
import { mockCourses } from '../../utils/mockData'

export default function Learning() {
  const [query, setQuery] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    courseApi.getResources()
      .then((data) => {
        if (isMounted && data && data.length > 0) setResources(data)
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoading(false)
      })
    return () => { isMounted = false }
  }, [])

  const filtered = useMemo(() => {
    if (resources.length > 0) {
      return resources.filter((res) => {
        if (query && !res.title.toLowerCase().includes(query.toLowerCase()) && !res.description.toLowerCase().includes(query.toLowerCase())) return false
        if (difficulty && res.level !== difficulty) return false
        if (typeFilter && res.resource_type !== typeFilter) return false
        return true
      })
    }
    return mockCourses.filter((c) => {
      if (query && !c.title.toLowerCase().includes(query.toLowerCase())) return false
      if (difficulty && c.difficulty !== difficulty) return false
      return true
    })
  }, [query, difficulty, typeFilter, resources])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Learning Catalog"
        subtitle="Curated skill resources mapped live to your CareerSync roadmap. Search, filter, and master new skills."
      />

      <Card>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SearchInput value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search learning resources..." wrapperClassName="lg:col-span-2" />
          <Select placeholder="Resource Type" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} options={['course', 'article', 'video', 'project', 'documentation']} />
          <Select placeholder="Any Difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} options={['Beginner', 'Intermediate', 'Advanced']} />
        </div>
        {(typeFilter || difficulty || query) && (
          <button onClick={() => { setTypeFilter(''); setDifficulty(''); setQuery('') }} className="mt-3 text-xs font-semibold text-primary hover:underline">Clear filters</button>
        )}
      </Card>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <Card key={item.id} hover className="flex flex-col overflow-hidden !p-5">
            <div className="flex items-center justify-between">
              <Badge variant="muted">{item.resource_type || 'Course'}</Badge>
              <Badge variant="default">{item.level || item.difficulty || 'Beginner'}</Badge>
            </div>

            <h3 className="mt-3 text-base font-bold text-charcoal">{item.title}</h3>
            <p className="mt-1 text-xs text-muted line-clamp-2">{item.description}</p>

            <div className="mt-4 flex items-center justify-between text-xs text-muted">
              <span>{item.skill?.name || 'Skill'}</span>
              <span>{item.duration_minutes ? `${item.duration_minutes} mins` : item.duration}</span>
            </div>

            <div className="mt-5 pt-3 border-t border-border flex gap-2">
              {item.content_url ? (
                <a href={item.content_url} target="_blank" rel="noopener noreferrer" className="w-full">
                  <Button size="sm" className="w-full">Open Resource ↗</Button>
                </a>
              ) : (
                <Link to={`/student/courses/${item.id}`} className="w-full">
                  <Button size="sm" className="w-full">View Details →</Button>
                </Link>
              )}
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card className="text-center py-10"><p className="text-sm text-muted">No learning resources match your filters.</p></Card>
      )}
    </div>
  )
}
