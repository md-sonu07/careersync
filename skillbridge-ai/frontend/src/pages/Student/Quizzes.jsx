import { useState } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import PageHeader from '../../components/common/PageHeader'
import { Table, THead, TBody, TR, TH, TD } from '../../components/ui/Table'

const topics = [
  { id:'react', name:'React & Hooks', icon:'code', count: 48, difficulty:'Intermediate', timed:'12 min' },
  { id:'js', name:'JavaScript', icon:'javascript', count: 62, difficulty:'Mixed', timed:'15 min' },
  { id:'node', name:'Node.js & Express', icon:'dns', count: 36, difficulty:'Intermediate', timed:'12 min' },
  { id:'mongo', name:'MongoDB', icon:'storage', count: 28, difficulty:'Beginner', timed:'10 min' },
  { id:'docker', name:'Docker Basics', icon:'deployed_code', count: 24, difficulty:'Beginner', timed:'10 min' },
  { id:'dsa', name:'DSA Fundamentals', icon:'account_tree', count: 54, difficulty:'Hard', timed:'20 min' },
]

const history = [
  { id:1, topic:'React Hooks', date:'2026-02-18', score:'8/10', percent:80, time:'09:42', mode:'Timed' },
  { id:2, topic:'JavaScript', date:'2026-02-12', score:'6/10', percent:60, time:'11:03', mode:'Untimed' },
  { id:3, topic:'Node.js', date:'2026-02-05', score:'7/10', percent:70, time:'10:18', mode:'Timed' },
  { id:4, topic:'MongoDB', date:'2026-01-28', score:'9/10', percent:90, time:'07:55', mode:'Timed' },
]

export default function Quizzes() {
  const [active, setActive] = useState(null)
  const [mode, setMode] = useState('Timed')
  const [difficulty, setDifficulty] = useState('Medium')

  return (
    <div className="space-y-6">
      <PageHeader title="Quizzes & Practice" subtitle="Topic-wise MCQs with timed and untimed modes. Track scores and improve weak areas." />

      {/* Topic cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map(t=>(
          <Card key={t.id} hover className="flex flex-col">
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage border border-sage text-primary">
                <span className="material-symbols-outlined">{t.icon}</span>
              </div>
              <Badge variant="muted">{t.count} Qs</Badge>
            </div>
            <h3 className="mt-3 text-sm font-bold text-charcoal">{t.name}</h3>
            <p className="text-xs text-muted mt-1">{t.difficulty} • {t.timed} • MCQs</p>
            <div className="mt-4 flex gap-2">
              <Button size="sm" className="flex-1" onClick={()=>setActive(t)}>Start Quiz</Button>
              <Button size="sm" variant="outline" className="flex-1">Practice</Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Start flow */}
      {active && (
        <Card className="!border-primary/20 !bg-primary/[0.04]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="font-bold text-charcoal">Start — {active.name}</h3>
              <p className="text-xs text-muted mt-1">Choose difficulty and mode. You can pause untimed quizzes.</p>
            </div>
            <Button variant="ghost" size="sm" onClick={()=>setActive(null)}>Close ✕</Button>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs font-semibold text-charcoal mb-2">Difficulty</p>
              <div className="flex gap-2 flex-wrap">
                {['Easy','Medium','Hard'].map(d=>(
                  <button key={d} onClick={()=>setDifficulty(d)} className={`rounded-full px-4 py-2 text-xs font-bold border ${difficulty===d ? 'bg-primary text-white border-primary' : 'bg-white border-border text-charcoal'}`}>{d}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-charcoal mb-2">Mode</p>
              <div className="flex gap-2">
                {['Timed','Untimed'].map(m=>(
                  <button key={m} onClick={()=>setMode(m)} className={`rounded-full px-4 py-2 text-xs font-bold border ${mode===m ? 'bg-primary text-white border-primary' : 'bg-white border-border text-charcoal'}`}>{m}</button>
                ))}
              </div>
            </div>
            <div className="flex items-end">
              <Button className="w-full">Begin {mode} Quiz — {difficulty}</Button>
            </div>
          </div>
        </Card>
      )}

      {/* History */}
      <Card className="!p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-bold text-charcoal">MCQ History</h3>
          <Badge variant="default">{history.length} attempts</Badge>
        </div>
        <Table>
          <THead>
            <TR><TH>Topic & Date</TH><TH>Score</TH><TH>Time</TH><TH>Mode</TH><TH>Action</TH></TR>
          </THead>
          <TBody>
            {history.map(h=>(
              <TR key={h.id}>
                <TD><p className="font-semibold text-charcoal">{h.topic}</p><p className="text-xs text-muted">{h.date}</p></TD>
                <TD><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${h.percent>=80 ? 'bg-green-100 text-green-700' : h.percent>=60 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{h.score} • {h.percent}%</span></TD>
                <TD className="tabular-nums">{h.time}</TD>
                <TD><Badge variant="muted">{h.mode}</Badge></TD>
                <TD><Button size="sm" variant="outline">Review</Button></TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </Card>
    </div>
  )
}
