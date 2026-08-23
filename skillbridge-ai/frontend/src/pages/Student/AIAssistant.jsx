import { useState, useRef, useEffect } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Badge from '../../components/ui/Badge'
import PageHeader from '../../components/common/PageHeader'
import { mockChatMessages } from '../../utils/mockData'

const chips = ['Explain topic', 'Generate MCQs', 'Create study plan', 'Analyze my skills', 'Mock interview', 'Fix my code']

export default function AIAssistant() {
  const [messages, setMessages] = useState(mockChatMessages)
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const send = () => {
    if (!input.trim()) return
    const userMsg = { id: Date.now(), role: 'user', text: input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setTimeout(() => {
      setMessages((m) => [...m, { id: Date.now() + 1, role: 'ai', text: `Got it! As your SkillBridge AI, here’s a quick take on “${userMsg.text.slice(0, 60)}”: I’ll map this to your Full Stack roadmap and suggest the next best step. Try asking “Generate 5 MCQs on this” for practice.`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])
    }, 600)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] lg:h-[calc(100vh-120px)]">
      <div className="shrink-0">
        <PageHeader title="SkillBridge AI Assistant" subtitle="Your 24/7 mentor — ask about skills, courses, roadmap, or generate practice on demand." />
        <div className="mt-4 flex flex-wrap gap-2">
          {chips.map((c) => (
            <button key={c} onClick={() => setInput(c)} className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-charcoal hover:bg-background hover:border-primary/20 transition-colors">
              {c}
            </button>
          ))}
        </div>
      </div>

      <Card className="mt-4 flex flex-1 flex-col overflow-hidden !p-0">
        <div className="flex items-center gap-3 border-b border-border px-5 py-3 bg-sage/40">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white"><span className="material-symbols-outlined text-[20px]">smart_toy</span></div>
          <div>
            <p className="text-sm font-bold text-charcoal">SkillBridge AI</p>
            <p className="text-xs text-muted">Context: React • Full Stack Developer track • 82% ready</p>
          </div>
          <Badge variant="success" className="ml-auto">ONLINE</Badge>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 bg-background/30">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${m.role === 'user' ? 'bg-primary text-white rounded-br-sm' : 'bg-white border border-border text-charcoal rounded-bl-sm shadow-soft'}`}>
                <p>{m.text}</p>
                <p className={`mt-1.5 text-[11px] ${m.role === 'user' ? 'text-white/70' : 'text-muted'}`}>{m.time}</p>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-border bg-white px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Ask anything — e.g. 'Explain Docker layers' or 'Create 2-week plan'"
                className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm text-charcoal placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <Button onClick={send} className="shrink-0" icon="send">Send</Button>
          </div>
          <p className="mt-1.5 text-[11px] text-muted">AI may generate practice content — verify with official docs for exams.</p>
        </div>
      </Card>
    </div>
  )
}
