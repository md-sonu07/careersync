import { useState, useEffect, useMemo } from 'react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import SearchInput from '../../components/ui/SearchInput'
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/Tabs'
import { ProgressBar } from '../../components/ui/Progress'
import PageHeader from '../../components/common/PageHeader'
import Modal from '../../components/ui/Modal'
import { skillApi } from '../../api/skill.api'
import { mockSkills } from '../../utils/mockData'

const categories = ['All', 'Programming', 'Frontend', 'Backend', 'Database', 'DevOps', 'Cloud', 'AI/ML', 'Soft Skill']

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [skillsList, setSkillsList] = useState([])
  const [availableSkills, setAvailableSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedSkillId, setSelectedSkillId] = useState('')
  const [scoreInput, setScoreInput] = useState(75)
  const [levelInput, setLevelInput] = useState('Intermediate')
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState(null)

  const loadSkills = async () => {
    try {
      setLoading(true)
      const [mySkillsData, allSkillsData] = await Promise.all([
        skillApi.getMySkills().catch(() => null),
        skillApi.getSkills().catch(() => null),
      ])

      if (mySkillsData && mySkillsData.length > 0) {
        const mapped = mySkillsData.map(item => ({
          id: item.id,
          skillId: item.skill?.id,
          name: item.skill?.name,
          category: item.skill?.category || 'Programming',
          level: item.score,
          levelText: item.level,
          trend: 5,
        }))
        setSkillsList(mapped)
      } else {
        setSkillsList([])
      }

      if (allSkillsData) {
        setAvailableSkills(allSkillsData)
      }
    } catch {
      setSkillsList([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSkills()
  }, [])

  const filtered = useMemo(() => {
    return skillsList.filter((s) => {
      if (activeCategory !== 'All' && s.category !== activeCategory) return false
      if (query && !s.name.toLowerCase().includes(query.toLowerCase())) return false
      return true
    })
  }, [activeCategory, query, skillsList])

  const getTone = (level) => {
    if (level >= 80) return { label: 'Strong', color: 'success', bar: 'bg-success' }
    if (level >= 50) return { label: 'Good', color: 'default', bar: 'bg-primary' }
    if (level >= 35) return { label: 'Needs work', color: 'accent', bar: 'bg-warning' }
    return { label: 'Critical', color: 'danger', bar: 'bg-danger' }
  }

  const handleAddSkill = async (e) => {
    e.preventDefault()
    if (!selectedSkillId) return
    setSubmitting(true)
    setToast(null)
    try {
      await skillApi.addMySkill({
        skill_id: selectedSkillId,
        score: Number(scoreInput),
        level: levelInput,
        source: 'manual',
      })
      setToast({ type: 'success', message: 'Skill added to your profile!' })
      setModalOpen(false)
      setSelectedSkillId('')
      loadSkills()
    } catch (err) {
      setToast({ type: 'danger', message: err.response?.data?.detail || 'Failed to add skill.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Skills"
        subtitle="Track your proficiency across skill areas — connected live with CareerSync database."
        actions={
          <div className="flex gap-2">
            <Button variant="primary" icon="add" onClick={() => setModalOpen(true)}>Add Skill</Button>
          </div>
        }
      />

      {toast && (
        <div role="alert" className={`rounded-xl border px-4 py-3 text-sm flex gap-3 items-start ${toast.type === 'success' ? 'bg-success/10 border-success/20 text-success' : 'bg-danger/10 border-danger/20 text-danger'}`}>
          <span className="material-symbols-outlined text-[20px] shrink-0">{toast.type === 'success' ? 'check_circle' : 'error'}</span>
          <span className="leading-relaxed">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-auto opacity-60 hover:opacity-100">✕</button>
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs defaultValue="All" value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="flex-wrap h-auto">
            {categories.map((c) => (
              <TabsTrigger key={c} value={c}>{c}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <SearchInput value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search skills..." wrapperClassName="w-full sm:w-72" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((skill) => {
          const tone = getTone(skill.level)
          return (
            <Card key={skill.id} hover className="flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-charcoal">{skill.name}</h3>
                  <p className="text-xs text-muted">{skill.category}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${tone.label === 'Strong' ? 'bg-success/10 text-success' : tone.label === 'Critical' ? 'bg-danger/10 text-danger' : tone.label === 'Needs work' ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'}`}>
                  {tone.label}
                </span>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-muted">Proficiency ({skill.levelText || 'Intermediate'})</span>
                  <span className="text-sm font-bold tabular-nums text-charcoal">{skill.level}%</span>
                </div>
                <ProgressBar value={skill.level} barClassName={tone.bar} size="md" />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-medium text-success">
                  Connected ✓
                </span>
                <Button variant="outline" size="sm">Assess →</Button>
              </div>
            </Card>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <Card className="text-center py-12">
          <p className="text-sm text-muted">No skills match your filter.</p>
        </Card>
      )}

      {/* Modal for adding a skill from backend library */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Skill to Profile">
        <form onSubmit={handleAddSkill} className="space-y-4 pt-2">
          <div>
            <label className="text-sm font-medium text-charcoal mb-1.5 block">Select Skill from Database</label>
            <select
              value={selectedSkillId}
              onChange={(e) => setSelectedSkillId(e.target.value)}
              required
              className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">-- Choose a Skill --</option>
              {availableSkills.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.category})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Proficiency Score (%)"
              type="number"
              min="0"
              max="100"
              value={scoreInput}
              onChange={(e) => setScoreInput(e.target.value)}
              required
            />
            <Select
              label="Level"
              value={levelInput}
              onChange={(e) => setLevelInput(e.target.value)}
              options={['Beginner', 'Intermediate', 'Advanced', 'Expert']}
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={submitting}>{submitting ? 'Saving...' : 'Add Skill'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
