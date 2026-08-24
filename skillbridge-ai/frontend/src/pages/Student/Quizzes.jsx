import { useState, useEffect } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import PageHeader from '../../components/common/PageHeader'
import Modal from '../../components/ui/Modal'
import { Table, THead, TBody, TR, TH, TD } from '../../components/ui/Table'
import { assessmentApi } from '../../api/assessment.api'
import { mockAssessments } from '../../utils/mockData'
import AppIcon from '../../components/ui/AppIcon';

export default function Quizzes() {
  const [assessments, setAssessments] = useState([])
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  // Quiz Modal State
  const [quizModalOpen, setQuizModalOpen] = useState(false)
  const [activeAssessment, setActiveAssessment] = useState(null)
  const [activeAttempt, setActiveAttempt] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentQIndex, setCurrentQIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [resultSummary, setResultSummary] = useState(null)

  const loadData = async () => {
    try {
      setLoading(true)
      const [assData, attemptsData] = await Promise.all([
        assessmentApi.getAssessments().catch(() => null),
        assessmentApi.getMyAttempts().catch(() => null),
      ])

      if (assData && assData.length > 0) setAssessments(assData)
      if (attemptsData && attemptsData.length > 0) setHistory(attemptsData)
    } catch {
      // Fallback
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleStartAssessment = async (ass) => {
    try {
      setSubmitting(true)
      setActiveAssessment(ass)
      const detail = await assessmentApi.getAssessmentDetail(ass.id)
      const qs = detail.questions || []
      if (qs.length === 0) {
        alert('No questions available for this assessment.')
        return
      }

      const attempt = await assessmentApi.startAttempt(ass.id)
      setActiveAttempt(attempt)
      setQuestions(qs)
      setCurrentQIndex(0)
      setUserAnswers({})
      setResultSummary(null)
      setQuizModalOpen(true)
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to start quiz attempt.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSelectOption = (questionId, optionId) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }))
  }

  const handleSubmitQuiz = async () => {
    if (!activeAttempt) return
    try {
      setSubmitting(true)
      const formattedAnswers = Object.entries(userAnswers).map(([qId, optId]) => ({
        question_id: qId,
        selected_option_id: optId,
      }))

      const result = await assessmentApi.submitAttempt(activeAttempt.id, {
        answers: formattedAnswers,
      })

      setResultSummary(result)
      loadData()
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to submit quiz.')
    } finally {
      setSubmitting(false)
    }
  }

  const currentQ = questions[currentQIndex]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quizzes & Practice"
        subtitle="Skill assessments with verified scoring connected live to CareerSync database."
      />

      {/* Assessment cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {assessments.length > 0 ? (
          assessments.map((a) => (
            <Card key={a.id} hover className="flex flex-col">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage border border-sage text-primary">
                  <AppIcon name="quiz" />
                </div>
                <Badge variant="muted">{a.question_count || 3} Qs</Badge>
              </div>
              <h3 className="mt-3 text-sm font-bold text-charcoal">{a.title}</h3>
              <p className="text-xs text-muted mt-1">{a.skill?.name} • {a.difficulty} • {a.time_limit} min</p>
              <div className="mt-4 flex gap-2">
                <Button size="sm" className="w-full" onClick={() => handleStartAssessment(a)} disabled={submitting}>
                  Start Quiz →
                </Button>
              </div>
            </Card>
          ))
        ) : (
          [
            { id: 'python', name: 'Python Core & OOP', count: 3, difficulty: 'Intermediate', timed: '15 min' },
            { id: 'react', name: 'React 19 & Component Architecture', count: 3, difficulty: 'Intermediate', timed: '15 min' },
            { id: 'django', name: 'Django Framework & ORM', count: 2, difficulty: 'Intermediate', timed: '20 min' },
          ].map((t) => (
            <Card key={t.id} hover className="flex flex-col">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage border border-sage text-primary">
                  <AppIcon name="quiz" />
                </div>
                <Badge variant="muted">{t.count} Qs</Badge>
              </div>
              <h3 className="mt-3 text-sm font-bold text-charcoal">{t.name}</h3>
              <p className="text-xs text-muted mt-1">{t.difficulty} • {t.timed} • MCQs</p>
            </Card>
          ))
        )}
      </div>

      {/* History */}
      <Card className="!p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-bold text-charcoal">Attempt History</h3>
          <Badge variant="default">{history.length} attempts</Badge>
        </div>
        <Table>
          <THead>
            <TR>
              <TH>Assessment & Date</TH>
              <TH>Score</TH>
              <TH>Percentage</TH>
              <TH>Status</TH>
            </TR>
          </THead>
          <TBody>
            {history.length > 0 ? (
              history.map((h) => (
                <TR key={h.id}>
                  <TD>
                    <p className="font-semibold text-charcoal">{h.assessment_title}</p>
                    <p className="text-xs text-muted">{new Date(h.started_at).toLocaleDateString()}</p>
                  </TD>
                  <TD className="tabular-nums font-semibold">{h.score}</TD>
                  <TD>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                        h.percentage >= 80 ? 'bg-green-100 text-green-700' : h.percentage >= 60 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {h.percentage}%
                    </span>
                  </TD>
                  <TD>
                    <Badge variant={h.status === 'completed' ? 'success' : 'muted'}>{h.status}</Badge>
                  </TD>
                </TR>
              ))
            ) : (
              mockAssessments.map((h) => (
                <TR key={h.id}>
                  <TD>
                    <p className="font-semibold text-charcoal">{h.skill}</p>
                    <p className="text-xs text-muted">{h.date}</p>
                  </TD>
                  <TD className="font-semibold">{h.score}</TD>
                  <TD><span className="rounded-full px-2.5 py-1 text-xs font-bold bg-green-100 text-green-700">{h.accuracy}%</span></TD>
                  <TD><Badge variant="success">Completed</Badge></TD>
                </TR>
              ))
            )}
          </TBody>
        </Table>
      </Card>

      {/* Quiz Modal */}
      <Modal
        open={quizModalOpen}
        onClose={() => setQuizModalOpen(false)}
        title={resultSummary ? 'Assessment Summary' : activeAssessment?.title || 'Quiz'}
        size="lg"
      >
        {resultSummary ? (
          <div className="space-y-6 pt-2 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success text-2xl font-bold">
              ✓
            </div>
            <div>
              <h3 className="text-2xl font-bold text-charcoal">Quiz Submitted!</h3>
              <p className="text-sm text-muted mt-1">Verified score updated in CareerSync database.</p>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
              <div className="p-4 rounded-xl bg-background border border-border">
                <p className="text-xs font-semibold text-muted uppercase">Final Score</p>
                <p className="text-xl font-bold text-charcoal mt-1">{resultSummary.percentage}%</p>
              </div>
              <div className="p-4 rounded-xl bg-background border border-border">
                <p className="text-xs font-semibold text-muted uppercase">Status</p>
                <p className="text-xl font-bold text-success mt-1">{resultSummary.percentage >= 60 ? 'Verified ✓' : 'Completed'}</p>
              </div>
            </div>

            <div className="pt-4 flex justify-center">
              <Button onClick={() => setQuizModalOpen(false)}>Close & Return</Button>
            </div>
          </div>
        ) : currentQ ? (
          <div className="space-y-6 pt-2">
            <div className="flex items-center justify-between text-xs text-muted border-b border-border pb-3">
              <span>Question {currentQIndex + 1} of {questions.length}</span>
              <Badge variant="muted">{currentQ.difficulty}</Badge>
            </div>

            <div>
              <p className="text-base font-bold text-charcoal leading-relaxed">{currentQ.question_text}</p>
            </div>

            <div className="space-y-2.5">
              {currentQ.options?.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => handleSelectOption(currentQ.id, opt.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer flex items-center gap-3 transition-all ${
                    userAnswers[currentQ.id] === opt.id
                      ? 'border-primary bg-primary/10 font-semibold text-primary'
                      : 'border-border bg-white hover:bg-background'
                  }`}
                >
                  <div className={`h-5 w-5 rounded-full border flex items-center justify-center text-xs ${
                    userAnswers[currentQ.id] === opt.id ? 'border-primary bg-primary text-white' : 'border-border'
                  }`}>
                    {userAnswers[currentQ.id] === opt.id ? '✓' : ''}
                  </div>
                  <span className="text-sm">{opt.option_text}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-border">
              <Button
                variant="outline"
                disabled={currentQIndex === 0}
                onClick={() => setCurrentQIndex((i) => Math.max(0, i - 1))}
              >
                ← Previous
              </Button>

              {currentQIndex < questions.length - 1 ? (
                <Button onClick={() => setCurrentQIndex((i) => Math.min(questions.length - 1, i + 1))}>
                  Next →
                </Button>
              ) : (
                <Button variant="primary" onClick={handleSubmitQuiz} disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Quiz'}
                </Button>
              )}
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}
