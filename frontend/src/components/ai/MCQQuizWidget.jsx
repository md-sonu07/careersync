import React, { useState } from 'react'
import AppIcon from '../ui/AppIcon'
import { toast } from 'react-hot-toast'

export function parseMCQsFromText(text) {
  if (!text || typeof text !== 'string') return []

  // Check if text has MCQ markers (Answer: / Correct Answer: / Option A/B/C/D)
  if (!/(?:Answer|Correct answer|A\)|B\)|\bA\.\s)/i.test(text)) {
    return []
  }

  const questions = []
  // Split into question blocks by numbers (1. , 2. , Question 1, ### Question 1)
  const blocks = text.split(/(?=(?:\r?\n|^)(?:\d+[\.\)]\s+|###?\s*Question|\*\*Question\s*\d+))/i)

  for (const block of blocks) {
    if (!block.trim()) continue

    // Extract Question text
    const qMatch = block.match(/(?:\d+[\.\)]\s+|###?\s*Question\s*\d*:?\s*|\*\*Question\s*\d+:\*\*\s*)([^\n]+)/i)
    if (!qMatch) continue
    const questionText = qMatch[1].replace(/\*\*/g, '').trim()

    // Extract Options (A), B), C), D) or A. B. C. D. or - [A] text
    const options = []
    const lines = block.split(/\r?\n/)

    for (const line of lines) {
      // Inline option parser for "A) text B) text C) text D) text"
      const inlineOpts = [...line.matchAll(/(?:^|\s|\t)([A-D])[\)\.]\s*([^A-D\)\.]{2,})/gi)]
      if (inlineOpts.length >= 2) {
        for (const m of inlineOpts) {
          const key = m[1].toUpperCase()
          const text = m[2].replace(/(?:Answer|Explanation|Correct).*/i, '').replace(/\*\*/g, '').trim()
          if (key && text && !options.some((o) => o.key === key)) {
            options.push({ key, text })
          }
        }
        continue
      }

      // Line-by-line option parser
      const lineOpt = line.match(/^\s*(?:(?:-|\*)\s*)?(?:\[?([A-D])\]?[\.\)]|\b([A-D])[\.\)]|\[-?([A-D])\])\s*(.+)/i)
      if (lineOpt) {
        const key = (lineOpt[1] || lineOpt[2] || lineOpt[3]).toUpperCase()
        const text = lineOpt[4].replace(/(?:Answer|Explanation|Correct).*/i, '').replace(/\*\*/g, '').trim()
        if (key && text && !options.some((o) => o.key === key)) {
          options.push({ key, text })
        }
      }
    }

    if (options.length < 2) continue

    // Extract Answer (Answer: C, Correct Answer: B, Answer: C) To call...)
    const ansMatch = block.match(/(?:Correct\s*)?Answer\s*:?\s*\*?\[?([A-D])\]?\*?/i)
    const answerKey = ansMatch ? ansMatch[1].toUpperCase() : options[0].key

    // Extract Explanation
    const expMatch = block.match(/Explanation\s*:?\s*([\s\S]+?)(?=\r?\n\r?\n|\r?\n\d+[\.\)]|\r?\n###|$)/i)
    const explanation = expMatch ? expMatch[1].replace(/\*\*/g, '').trim() : ''

    questions.push({
      id: questions.length + 1,
      question: questionText,
      options: options.sort((a, b) => a.key.localeCompare(b.key)),
      answer: answerKey,
      explanation,
    })
  }

  return questions
}

function detectTopic(questions) {
  const fullText = questions.map((q) => q.question + ' ' + (q.explanation || '')).join(' ')
  if (/javascript|js\b/i.test(fullText)) return 'JavaScript'
  if (/java\b/i.test(fullText)) return 'Java'
  if (/python/i.test(fullText)) return 'Python'
  if (/react/i.test(fullText)) return 'React'
  if (/sql|database/i.test(fullText)) return 'SQL'
  if (/dsa|algorithm|structure/i.test(fullText)) return 'DSA'
  return 'Programming'
}

export default function MCQQuizWidget({ questions, theme = 'dark' }) {
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [showExplanations, setShowExplanations] = useState({})

  if (!questions || questions.length === 0) return null

  const topic = detectTopic(questions)

  const handleSelectOption = (qId, optionKey) => {
    if (selectedAnswers[qId]) return // Already answered

    setSelectedAnswers((prev) => ({ ...prev, [qId]: optionKey }))
    setShowExplanations((prev) => ({ ...prev, [qId]: true }))

    const q = questions.find((item) => item.id === qId)
    if (q && q.answer === optionKey) {
      toast.success('Correct Answer! 🎉')
    } else {
      toast.error('Incorrect Answer. See explanation below.')
    }
  }

  const handleSendAction = (actionText) => {
    const customEvt = new CustomEvent('careersync:chat:send', { detail: { text: actionText } })
    window.dispatchEvent(customEvt)
  }

  const answeredCount = Object.keys(selectedAnswers).length
  const correctCount = questions.filter((q) => selectedAnswers[q.id] === q.answer).length
  const isFinished = answeredCount === questions.length

  const actions = [
    `Generate More ${topic} MCQs`,
    `Find ${topic} Jobs`,
    `Practice ${topic} Interview Questions`,
    `Find ${topic} Internships`,
  ]

  return (
    <div className="my-4 space-y-4 font-sans text-left">
      {/* Quiz Header Bar */}
      <div
        className={`p-4 rounded-2xl border shadow-sm flex items-center justify-between transition-colors ${
          theme === 'dark' ? 'bg-[#252525] border-[#383838] text-white' : 'bg-primary/5 border-primary/20 text-charcoal'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8.5 h-8.5 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold shrink-0">
            <AppIcon name="quiz" className="text-[20px]" />
          </div>
          <div>
            <h4 className="font-bold text-sm leading-tight flex items-center gap-2">
              <span>Career AI Interactive Quiz</span>
              <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                {topic}
              </span>
            </h4>
            <p className="text-[11px] text-muted mt-0.5">Test your skills with instant feedback</p>
          </div>
        </div>

        <div>
          {answeredCount === 0 ? (
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-surface border border-border text-muted">
              0 / {questions.length} Answered
            </span>
          ) : (
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full border shadow-xs ${
                correctCount > 0
                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-500 border-rose-500/30'
              }`}
            >
              Score: {correctCount} / {questions.length}
            </span>
          )}
        </div>
      </div>

      {/* Questions Cards */}
      <div className="space-y-4">
        {questions.map((q, idx) => {
          const selected = selectedAnswers[q.id]
          const isAnswered = !!selected
          const isCorrect = selected === q.answer

          return (
            <div
              key={q.id}
              className={`p-5 rounded-2xl border shadow-sm transition-all ${
                theme === 'dark' ? 'bg-[#1a1a1a] border-[#2e2e2e]' : 'bg-white border-border/80'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-start gap-3 mb-4">
                <span
                  className={`px-2.5 py-1 rounded-lg text-xs font-extrabold uppercase shrink-0 ${
                    theme === 'dark' ? 'bg-[#2a2a2a] text-primary-light' : 'bg-primary/10 text-primary'
                  }`}
                >
                  Q{idx + 1}
                </span>
                <h3 className={`text-sm font-semibold leading-relaxed ${theme === 'dark' ? 'text-gray-100' : 'text-charcoal'}`}>
                  {q.question}
                </h3>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 gap-2.5 my-3">
                {q.options.map((opt) => {
                  const isThisSelected = selected === opt.key
                  const isThisCorrect = q.answer === opt.key

                  let btnStyle =
                    theme === 'dark'
                      ? 'bg-[#242424] border-[#333333] text-gray-200 hover:bg-[#2c2c2c] hover:border-primary/40'
                      : 'bg-surface border-border text-charcoal hover:bg-primary/5 hover:border-primary/30'

                  if (isAnswered) {
                    if (isThisCorrect) {
                      btnStyle =
                        'bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold shadow-xs'
                    } else if (isThisSelected) {
                      btnStyle =
                        'bg-rose-500/15 border-rose-500 text-rose-600 dark:text-rose-400 font-bold shadow-xs'
                    } else {
                      btnStyle = 'opacity-50 cursor-not-allowed border-transparent'
                    }
                  }

                  return (
                    <button
                      key={opt.key}
                      type="button"
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(q.id, opt.key)}
                      className={`w-full p-3.5 rounded-xl border text-xs text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${btnStyle}`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <span
                          className={`w-6.5 h-6.5 rounded-lg text-[11px] font-bold flex items-center justify-center shrink-0 ${
                            isAnswered && isThisCorrect
                              ? 'bg-emerald-500 text-white'
                              : isAnswered && isThisSelected
                              ? 'bg-rose-500 text-white'
                              : theme === 'dark'
                              ? 'bg-[#333333] text-gray-300'
                              : 'bg-gray-200 text-charcoal'
                          }`}
                        >
                          {opt.key}
                        </span>
                        <span className="leading-relaxed mt-0.5 font-medium">{opt.text}</span>
                      </div>

                      {isAnswered && isThisCorrect && (
                        <span className="text-emerald-500 flex items-center gap-1 font-bold text-[11px] shrink-0">
                          <AppIcon name="check_circle" className="text-[16px]" />
                          <span>Correct</span>
                        </span>
                      )}

                      {isAnswered && isThisSelected && !isThisCorrect && (
                        <span className="text-rose-500 flex items-center gap-1 font-bold text-[11px] shrink-0">
                          <AppIcon name="cancel" className="text-[16px]" />
                          <span>Incorrect</span>
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Explanation Box */}
              {showExplanations[q.id] && q.explanation && (
                <div className="mt-3.5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs leading-relaxed animate-in fade-in duration-200">
                  <div className="flex items-center gap-1.5 font-bold text-amber-700 dark:text-amber-400 mb-1">
                    <AppIcon name="lightbulb" className="text-[16px]" />
                    <span>Explanation</span>
                  </div>
                  <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} m-0`}>{q.explanation}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
