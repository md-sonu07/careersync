import { useState, useEffect } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { Table, THead, TBody, TR, TH, TD } from '../../components/ui/Table'
import PageHeader from '../../components/common/PageHeader'
import Modal from '../../components/ui/Modal'
import { ProgressBar } from '../../components/ui/Progress'
import { toast } from 'react-hot-toast'
import { assessmentApi } from '../../api/assessment.api'
import { mockAssessments } from '../../utils/mockData'
import AppIcon from '../../components/ui/AppIcon';

export default function Assessment() {
  const [assessments, setAssessments] = useState([])
  const [attempts, setAttempts] = useState([])
  const [selectedAssessment, setSelectedAssessment] = useState(null)
  const [loading, setLoading] = useState(true)

  // Active quiz state
  const [activeAttempt, setActiveAttempt] = useState(null)
  const [activeQuestions, setActiveQuestions] = useState([])
  const [currentQIndex, setCurrentQIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState({}) // { questionId: selectedOptionId }
  const [submitting, setSubmitting] = useState(false)
  const [resultSummary, setResultSummary] = useState(null)
  const [quizModalOpen, setQuizModalOpen] = useState(false)

  const loadData = async () => {
    try {
      setLoading(true)
      const [assData, attemptsData] = await Promise.all([
        assessmentApi.getAssessments().catch(() => {
          toast.error('Could not load assessments. Please try again.')
          return []
        }),
        assessmentApi.getMyAttempts().catch(() => {
          toast.error('Could not load assessment attempts. Please try again.')
          return []
        }),
      ])

      if (assData && assData.length > 0) {
        setAssessments(assData)
        setSelectedAssessment(assData[0])
      }

      if (attemptsData && attemptsData.length > 0) {
        setAttempts(attemptsData)
      }
    } catch {
      toast.error('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleStartQuiz = async () => {
    if (!selectedAssessment) return
    try {
      setSubmitting(true)
      // 1. Fetch full details (questions and options)
      const detail = await assessmentApi.getAssessmentDetail(selectedAssessment.id)
      const questions = detail.questions || []
      if (questions.length === 0) {
        toast.error('There are no questions currently available for this assessment.')
        return
      }

      // 2. Start attempt on backend
      const attempt = await assessmentApi.startAttempt(selectedAssessment.id)
      setActiveAttempt(attempt)
      setActiveQuestions(questions)
      setCurrentQIndex(0)
      setUserAnswers({})
      setResultSummary(null)
      setQuizModalOpen(true)
    } catch {
      toast.error('Failed to start assessment attempt.')
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
      toast.success('Your assessment has been submitted successfully.')
    } catch {
      toast.error('Failed to submit assessment.')
    } finally {
      setSubmitting(false)
    }
  }

  const currentQ = activeQuestions[currentQIndex]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Skill Assessment"
        subtitle="Take skill-based assessments connected live to CareerSync database and earn verified skill badges."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Available Assessments List */}
        <Card className="lg:col-span-1 space-y-4">
          <div className="flex items-center gap-3 border-b border-border pb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
              <AppIcon name="quiz" />
            </div>
            <div>
              <h3 className="font-bold text-charcoal">Available Assessments</h3>
              <p className="text-xs text-muted">Select an assessment to start</p>
            </div>
          </div>

          <div className="space-y-2">
            {assessments.map((a) => (
              <div
                key={a.id}
                onClick={() => setSelectedAssessment(a)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedAssessment?.id === a.id
                    ? 'border-primary bg-primary/5 shadow-soft'
                    : 'border-border bg-white hover:bg-background'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-charcoal">{a.title}</h4>
                  <Badge variant="muted">{a.difficulty}</Badge>
                </div>
                <p className="text-xs text-muted mt-1">{a.skill?.name} • {a.time_limit} mins • {a.question_count} questions</p>
              </div>
            ))}
          </div>

          <Button
            className="w-full mt-4"
            size="lg"
            onClick={handleStartQuiz}
            disabled={submitting || !selectedAssessment}
          >
            {submitting ? 'Preparing Quiz...' : 'Start Assessment →'}
          </Button>
        </Card>

        {/* Attempt History */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-charcoal">My Assessment History</h3>
            <Badge variant="muted">{attempts.length} attempts</Badge>
          </div>
          <Table>
            <THead>
              <TR>
                <TH>Date</TH>
                <TH>Assessment</TH>
                <TH>Score</TH>
                <TH>Percentage</TH>
                <TH>Status</TH>
              </TR>
            </THead>
            <TBody>
              {attempts.length > 0 ? (
                attempts.map((att) => (
                  <TR key={att.id}>
                    <TD className="whitespace-nowrap">{new Date(att.started_at).toLocaleDateString()}</TD>
                    <TD>
                      <span className="font-semibold text-charcoal">{att.assessment_title}</span>
                      <span className="ml-2 text-xs text-muted">({att.skill_name})</span>
                    </TD>
                    <TD className="font-semibold">{att.score}</TD>
                    <TD>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 rounded-full bg-background border border-border overflow-hidden">
                          <div
                            className={`h-full ${
                              att.percentage >= 70 ? 'bg-success' : att.percentage >= 50 ? 'bg-warning' : 'bg-danger'
                            }`}
                            style={{ width: `${att.percentage}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium">{att.percentage}%</span>
                      </div>
                    </TD>
                    <TD>
                      <Badge variant={att.status === 'completed' ? 'success' : 'muted'}>{att.status}</Badge>
                    </TD>
                  </TR>
                ))
              ) : (
                mockAssessments.map((a) => (
                  <TR key={a.id}>
                    <TD className="whitespace-nowrap">{a.date}</TD>
                    <TD>
                      <span className="font-semibold text-charcoal">{a.skill}</span>
                      <span className="ml-2 text-xs text-muted">{a.difficulty}</span>
                    </TD>
                    <TD className="font-semibold">{a.score}</TD>
                    <TD>
                      <span className="text-xs font-medium">{a.accuracy}%</span>
                    </TD>
                    <TD><Badge variant="success">Completed</Badge></TD>
                  </TR>
                ))
              )}
            </TBody>
          </Table>
        </div>
      </div>

      {/* Quiz Modal */}
      <Modal
        open={quizModalOpen}
        onClose={() => setQuizModalOpen(false)}
        title={resultSummary ? 'Assessment Results' : selectedAssessment?.title || 'Skill Assessment'}
        size="lg"
      >
        {resultSummary ? (
          <div className="space-y-6 pt-2 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success text-2xl font-bold">
              ✓
            </div>
            <div>
              <h3 className="text-2xl font-bold text-charcoal">Assessment Completed!</h3>
              <p className="text-sm text-muted mt-1">Your score has been verified and saved to your skill profile.</p>
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
              <Button onClick={() => setQuizModalOpen(false)}>Done & Return</Button>
            </div>
          </div>
        ) : currentQ ? (
          <div className="space-y-6 pt-2">
            <div className="flex items-center justify-between text-xs text-muted border-b border-border pb-3">
              <span>Question {currentQIndex + 1} of {activeQuestions.length}</span>
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

              {currentQIndex < activeQuestions.length - 1 ? (
                <Button onClick={() => setCurrentQIndex((i) => Math.min(activeQuestions.length - 1, i + 1))}>
                  Next →
                </Button>
              ) : (
                <Button variant="primary" onClick={handleSubmitQuiz} disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Assessment'}
                </Button>
              )}
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}
