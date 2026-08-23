import { useState } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Select from '../../components/ui/Select'
import Badge from '../../components/ui/Badge'
import { Table, THead, TBody, TR, TH, TD } from '../../components/ui/Table'
import PageHeader from '../../components/common/PageHeader'
import { mockAssessments } from '../../utils/mockData'

const skillOptions = ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Docker', 'Testing', 'TypeScript']
const difficultyOptions = ['Easy', 'Medium', 'Hard']
const numQsOptions = ['5', '10', '15', '20']
const timeOptions = ['10 min', '15 min', '20 min', '30 min']

export default function Assessment() {
  const [form, setForm] = useState({ skill: 'React', difficulty: 'Medium', numQs: '10', time: '15 min' })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Skill Assessment"
        subtitle="AI-generated MCQs tailored to your career goal. Attemptex, get instant feedback, and close your gaps faster."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Start card */}
        <Card className="lg:col-span-1">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
              <span className="material-symbols-outlined">auto_awesome</span>
            </div>
            <div>
              <h3 className="font-bold text-charcoal">Start New Assessment</h3>
              <p className="text-xs text-muted">AI will generate fresh questions</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <Select label="Skill" options={skillOptions} value={form.skill} onChange={(e) => setForm({ ...form, skill: e.target.value })} />
            <Select label="Difficulty" options={difficultyOptions} value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} />
            <Select label="Number of Questions" options={numQsOptions} value={form.numQs} onChange={(e) => setForm({ ...form, numQs: e.target.value })} />
            <Select label="Time per assessment" options={timeOptions} value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
            <Button className="w-full" size="lg">Generate & Start →</Button>
            <div className="rounded-xl bg-sage border border-sage p-3 text-xs leading-relaxed text-charcoal/80">
              <p className="font-semibold text-charcoal flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">info</span> How it works</p>
              <ol className="mt-1.5 list-decimal list-inside space-y-0.5">
                <li>AI generates unique MCQs per skill & difficulty</li>
                <li>Timer starts — answer and flag for review</li>
                <li>Submit to see score, weak topics & lessons</li>
              </ol>
            </div>
          </div>
        </Card>

        {/* History */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-charcoal">Assessment History</h3>
            <Badge variant="muted">{mockAssessments.length} attempts</Badge>
          </div>
          <Table>
            <THead>
              <TR>
                <TH>Date</TH>
                <TH>Skill</TH>
                <TH>Score</TH>
                <TH>Accuracy</TH>
                <TH>Status</TH>
                <TH></TH>
              </TR>
            </THead>
            <TBody>
              {mockAssessments.map((a) => (
                <TR key={a.id}>
                  <TD className="whitespace-nowrap">{a.date}</TD>
                  <TD>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-primary" /> {a.skill}
                    </span>
                    <span className="ml-2 text-xs text-muted">{a.difficulty}</span>
                  </TD>
                  <TD className="font-semibold">{a.score}</TD>
                  <TD>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 rounded-full bg-background border border-border overflow-hidden">
                        <div className={`h-full ${a.accuracy >= 70 ? 'bg-success' : a.accuracy >= 50 ? 'bg-warning' : 'bg-danger'}`} style={{ width: `${a.accuracy}%` }} />
                      </div>
                      <span className="text-xs font-medium">{a.accuracy}%</span>
                    </div>
                  </TD>
                  <TD><Badge variant={a.status === 'Completed' ? 'success' : 'muted'}>{a.status}</Badge></TD>
                  <TD><Button variant="ghost" size="sm">View</Button></TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
