import { useState, useEffect } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Select from '../../components/ui/Select'
import Badge from '../../components/ui/Badge'
import { ProgressBar } from '../../components/ui/Progress'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs'
import PageHeader from '../../components/common/PageHeader'
import { mockAIQuestions } from '../../utils/mockData'

export default function AIPractice() {
  const [tab, setTab] = useState('setup')
  const [form, setForm] = useState({ skill: 'React', difficulty: 'Medium', num: '5', time: '15 min' })
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(900)

  useEffect(() => {
    if (tab !== 'practice' || submitted) return
    const t = setInterval(() => setTimeLeft((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(t)
  }, [tab, submitted])

  const score = Object.entries(answers).filter(([i, v]) => mockAIQuestions[Number(i)]?.answer === v).length
  const q = mockAIQuestions[idx]

  const start = () => {
    setAnswers({})
    setIdx(0)
    setSubmitted(false)
    setTimeLeft(15 * 60)
    setTab('practice')
  }

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  return (
    <div className="space-y-6">
      <PageHeader title="AI Practice — MCQs" subtitle="Generate unlimited fresh MCQs. Timed practice with instant scoring and topic-wise feedback." />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="setup">Setup</TabsTrigger>
          <TabsTrigger value="practice">Practice</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="setup">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <h3 className="font-bold text-charcoal">Configure your practice</h3>
              <div className="mt-5 space-y-4">
                <Select label="Skill" value={form.skill} onChange={(e) => setForm({ ...form, skill: e.target.value })} options={['React', 'JavaScript', 'Node.js', 'MongoDB', 'Docker']} />
                <Select label="Difficulty" value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} options={['Easy', 'Medium', 'Hard']} />
                <Select label="Number of questions" value={form.num} onChange={(e) => setForm({ ...form, num: e.target.value })} options={['5', '10', '15']} />
                <Select label="Time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} options={['10 min', '15 min', '20 min', '30 min']} />
                <Button className="w-full" size="lg" onClick={start}>Generate & Start Practice →</Button>
              </div>
            </Card>
            <Card className="!bg-sage !border-sage">
              <h3 className="font-bold text-charcoal">How AI Practice works</h3>
              <ul className="mt-3 space-y-2 text-sm text-charcoal/80">
                <li>• AI generates unique questions per skill & difficulty</li>
                <li>• Timer + progress bar keep you focused</li>
                <li>• No repeats — every attempt is fresh</li>
                <li>• Instant results with weak-topic mapping</li>
              </ul>
              <div className="mt-6 rounded-xl bg-white border border-border p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-muted">Last result</p>
                <p className="mt-1 text-2xl font-bold text-charcoal">7/10 • 70%</p>
                <p className="text-xs text-muted">Weak topics: Docker, Testing</p>
                <button onClick={() => setTab('results')} className="mt-2 text-xs font-semibold text-primary hover:underline">View breakdown →</button>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="practice">
          <Card>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="default">{form.skill} • {form.difficulty}</Badge>
                <span className="text-sm text-muted">Q {idx + 1} / {mockAIQuestions.length}</span>
              </div>
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-bold ${timeLeft < 60 ? 'bg-danger text-white border-danger' : 'bg-white border-border text-charcoal'}`}>
                <span className="material-symbols-outlined text-[18px]">timer</span> {formatTime(timeLeft)}
              </span>
            </div>

            <ProgressBar value={((idx + 1) / mockAIQuestions.length) * 100} size="sm" className="mt-4" />

            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-widest text-muted">{q.topic}</p>
              <h3 className="mt-2 text-lg font-semibold leading-snug text-charcoal">{idx + 1}. {q.q}</h3>
              <div className="mt-5 grid grid-cols-1 gap-3">
                {q.options.map((opt, i) => {
                  const selected = answers[idx] === i
                  return (
                    <button
                      key={i}
                      onClick={() => setAnswers({ ...answers, [idx]: i })}
                      className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors ${selected ? 'bg-primary text-white border-primary' : 'bg-white border-border hover:bg-background text-charcoal'}`}
                    >
                      <span className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold shrink-0 ${selected ? 'bg-white text-primary border-white' : 'bg-background border-border'}`}>{String.fromCharCode(65 + i)}</span>
                      {opt}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <Button variant="outline" disabled={idx === 0} onClick={() => setIdx(idx - 1)}>← Previous</Button>
              <div className="flex gap-2">
                {idx < mockAIQuestions.length - 1 ? (
                  <Button onClick={() => setIdx(idx + 1)}>Next →</Button>
                ) : (
                  <Button onClick={() => { setSubmitted(true); setTab('results') }}>Submit Assessment</Button>
                )}
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="results">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <h3 className="font-bold text-charcoal">Your Results</h3>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-2xl bg-sage border border-sage p-4">
                  <p className="text-2xl font-bold text-primary">{score}/{mockAIQuestions.length}</p>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">Score</p>
                </div>
                <div className="rounded-2xl bg-white border border-border p-4">
                  <p className="text-2xl font-bold text-charcoal">{Math.round((score / mockAIQuestions.length) * 100)}%</p>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">Accuracy</p>
                </div>
                <div className="rounded-2xl bg-white border border-border p-4">
                  <p className="text-2xl font-bold text-charcoal">{formatTime(900 - timeLeft)}</p>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">Time spent</p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {mockAIQuestions.map((qq, i) => {
                  const chosen = answers[i]
                  const correct = qq.answer
                  const isCorrect = chosen === correct
                  return (
                    <div key={qq.id} className={`rounded-xl border p-4 ${chosen === undefined ? 'bg-white border-border' : isCorrect ? 'bg-success/5 border-success/20' : 'bg-danger/5 border-danger/20'}`}>
                      <p className="text-sm font-medium text-charcoal">{i + 1}. {qq.q}</p>
                      <p className="mt-2 text-xs text-muted">Your answer: <span className={`font-semibold ${isCorrect ? 'text-success' : 'text-danger'}`}>{chosen !== undefined ? qq.options[chosen] : '— Skipped'}</span> {isCorrect ? '✓' : chosen !== undefined ? '✗' : ''}</p>
                      {!isCorrect && <p className="text-xs text-success">Correct: {qq.options[correct]}</p>}
                    </div>
                  )
                })}
              </div>
            </Card>

            <div className="space-y-6">
              <Card className="!bg-sage !border-sage">
                <h3 className="font-bold text-charcoal">Weak Topics Detected</h3>
                <ul className="mt-3 space-y-2 text-sm text-charcoal/80">
                  <li>• Docker — layer caching (review)</li>
                  <li>• REST — idempotency concepts</li>
                </ul>
                <p className="mt-4 text-xs font-semibold text-primary">Recommended lessons</p>
                <div className="mt-2 space-y-2">
                  <a href="/student/learning" className="block rounded-xl bg-white border border-border px-3 py-2 text-sm font-medium text-charcoal hover:bg-background">Docker & DevOps Essentials →</a>
                  <a href="/student/learning" className="block rounded-xl bg-white border border-border px-3 py-2 text-sm font-medium text-charcoal hover:bg-background">REST API Design (module 5) →</a>
                </div>
              </Card>
              <Button className="w-full" onClick={start}>Retry New Set →</Button>
              <Button variant="outline" className="w-full" onClick={() => setTab('setup')}>Back to Setup</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
