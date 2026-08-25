import { useState } from 'react'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Badge from '../../components/ui/Badge'
import { ProgressBar } from '../../components/ui/Progress'
import AppIcon from '../../components/ui/AppIcon';

const students = [
  { id: 1, name: 'Rahul Sharma', avatar: 'https://i.pravatar.cc/150?img=12', dept: 'CSE', sem: '6th', skill: 'React', course: 64, assess: 82, growth: '+8%', streak: 12, internship: 'Flipkart', performance: 'Strong' },
  { id: 2, name: 'Aman Verma', avatar: 'https://i.pravatar.cc/150?img=15', dept: 'IT', sem: '6th', skill: 'Node.js', course: 42, assess: 71, growth: '+5%', streak: 7, internship: '—', performance: 'Average' },
  { id: 3, name: 'Priya Nair', avatar: 'https://i.pravatar.cc/150?img=32', dept: 'CSE', sem: '8th', skill: 'Python', course: 88, assess: 91, growth: '+12%', streak: 21, internship: 'Zomato', performance: 'Strong' },
  { id: 4, name: 'Sara Khan', avatar: 'https://i.pravatar.cc/150?img=25', dept: 'ECE', sem: '6th', skill: 'SQL', course: 34, assess: 58, growth: '+2%', streak: 3, internship: '—', performance: 'Needs Support' },
  { id: 5, name: 'Dev Patel', avatar: 'https://i.pravatar.cc/150?img=33', dept: 'CSE', sem: '4th', skill: 'Java', course: 56, assess: 64, growth: '+6%', streak: 9, internship: 'CRED', performance: 'Average' },
  { id: 6, name: 'Neha Gupta', avatar: 'https://i.pravatar.cc/150?img=26', dept: 'IT', sem: '8th', skill: 'AWS', course: 22, assess: 41, growth: '-1%', streak: 1, internship: '—', performance: 'Needs Support' },
  { id: 7, name: 'Kiran Rao', avatar: 'https://i.pravatar.cc/150?img=20', dept: 'CSE', sem: '6th', skill: 'Docker', course: 18, assess: 38, growth: '+1%', streak: 2, internship: '—', performance: 'Needs Support' },
  { id: 8, name: 'Arjun Mehta', avatar: 'https://i.pravatar.cc/150?img=14', dept: 'CSE', sem: '6th', skill: 'React', course: 72, assess: 86, growth: '+10%', streak: 15, internship: 'Postman', performance: 'Strong' },
]

export default function InstituteStudents() {
  const [search, setSearch] = useState('')
  const [dept, setDept] = useState('All')
  const [sem, setSem] = useState('All')
  const [skill, setSkill] = useState('All')
  const [perf, setPerf] = useState('All')

  const filtered = students.filter((s) => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false
    if (dept !== 'All' && s.dept !== dept) return false
    if (sem !== 'All' && s.sem !== sem) return false
    if (skill !== 'All' && s.skill !== skill) return false
    if (perf !== 'All' && s.performance !== perf) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-charcoal">Students</h1>
        <p className="text-sm text-muted mt-1">Search & filter by department, semester, skill, performance</p>
      </div>

      <Card className="!p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-6">
          <div className="sm:col-span-2"><Input placeholder="Search students..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
          <Select value={dept} onChange={(e) => setDept(e.target.value)}><option value="All">All Depts</option><option>CSE</option><option>IT</option><option>ECE</option></Select>
          <Select value={sem} onChange={(e) => setSem(e.target.value)}><option value="All">All Semesters</option><option>4th</option><option>6th</option><option>8th</option></Select>
          <Select value={skill} onChange={(e) => setSkill(e.target.value)}><option value="All">All Skills</option><option>React</option><option>Node.js</option><option>Python</option><option>SQL</option><option>AWS</option><option>Docker</option></Select>
          <Select value={perf} onChange={(e) => setPerf(e.target.value)}><option value="All">All Performance</option><option>Strong</option><option>Average</option><option>Needs Support</option></Select>
        </div>
        <p className="mt-3 text-xs text-muted">{filtered.length} students • showing filtered results</p>
      </Card>

      <Card className="!p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-background/60">
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-muted">Student</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-muted">Dept / Sem</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-muted">Primary Skill</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-muted">Course Progress</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-muted">Assessment</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-muted">Growth</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-muted">Streak</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-muted">Internship</th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-muted">Performance</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b border-border last:border-0 hover:bg-background/40">
                  <td className="px-6 py-3 flex items-center gap-3">
                    <img src={s.avatar} alt="" className="h-9 w-9 rounded-full border border-border" />
                    <span className="text-sm font-semibold text-charcoal">{s.name}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted">{s.dept} • {s.sem}</td>
                  <td className="px-4 py-3"><Badge variant="default">{s.skill}</Badge></td>
                  <td className="px-4 py-3 w-36"><div className="flex items-center gap-2"><ProgressBar value={s.course} size="sm" className="flex-1" barClassName={s.course >= 70 ? 'bg-success' : s.course >= 40 ? 'bg-primary' : 'bg-danger'} /><span className="text-xs font-bold text-charcoal">{s.course}%</span></div></td>
                  <td className="px-4 py-3 text-sm font-bold text-charcoal">{s.assess}%</td>
                  <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-bold ${s.growth.startsWith('+') ? 'bg-success/10 text-success' : s.growth.startsWith('-') ? 'bg-danger/10 text-danger' : 'bg-background text-muted'}`}>{s.growth}</span></td>
                  <td className="px-4 py-3"><span className="inline-flex items-center gap-1 text-sm font-bold text-charcoal"><AppIcon name="local_fire_department" className="text-[16px] text-orange-500" />{s.streak}</span></td>
                  <td className="px-4 py-3 text-xs font-medium text-muted">{s.internship}</td>
                  <td className="px-6 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${s.performance === 'Strong' ? 'bg-success/10 text-success' : s.performance === 'Average' ? 'bg-accent/10 text-accent' : 'bg-danger/10 text-danger'}`}>{s.performance}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <p className="text-center text-sm text-muted py-10">No students match filters.</p>}
      </Card>
    </div>
  )
}
