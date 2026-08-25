import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import toast from 'react-hot-toast'
import AppIcon from '../../components/ui/AppIcon'
import { aiAPI } from '../../api/ai.api'

function MarkdownRenderer({ content }) {
  return (
    <ReactMarkdown
      components={{
        h1: ({ children }) => <h1 className="text-base font-bold mt-3 mb-1 text-charcoal">{children}</h1>,
        h2: ({ children }) => <h2 className="text-sm font-bold mt-2.5 mb-1 text-charcoal">{children}</h2>,
        h3: ({ children }) => <h3 className="text-xs font-bold mt-2 mb-1 text-charcoal">{children}</h3>,
        p: ({ children }) => <p className="text-[13px] leading-relaxed text-charcoal/90 my-1.5">{children}</p>,
        ul: ({ children }) => <ul className="space-y-1 list-disc pl-4 text-[13px] my-2 text-charcoal/90">{children}</ul>,
        ol: ({ children }) => <ol className="space-y-1 list-decimal pl-4 text-[13px] my-2 text-charcoal/90">{children}</ol>,
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        code: ({ node, inline, className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || '')
          const lang = match ? match[1] : ''
          if (!inline) {
            return (
              <div className="my-2 rounded-lg overflow-hidden border border-gray-700 bg-[#1e1e1e] shadow-xs text-left">
                <div className="flex items-center justify-between px-3 py-1 bg-[#2d2d2d] border-b border-gray-700 text-[10px] text-gray-300 font-mono">
                  <span className="font-semibold capitalize">{lang || 'code'}</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(String(children).replace(/\n$/, ''))
                      toast.success('Code copied!')
                    }}
                    className="hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-[10px] text-gray-400"
                  >
                    <AppIcon name="Copy" className="text-[11px]" />
                    <span>Copy</span>
                  </button>
                </div>
                <pre className="p-3 text-[11px] font-mono text-emerald-400 overflow-x-auto m-0 leading-relaxed">
                  <code>{children}</code>
                </pre>
              </div>
            )
          }
          return (
            <code className="bg-gray-100 text-primary px-1 py-0.5 rounded text-[11px] font-mono font-semibold" {...props}>
              {children}
            </code>
          )
        }
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

export default function DocumentAnalyzer() {
  const [file, setFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStep, setUploadStep] = useState(0) // 1: Extracting, 2: Analyzing, 3: Done
  const [error, setError] = useState(null)
  const [documentData, setDocumentData] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  // Document Chat state
  const [chatMessages, setChatMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [isChatSending, setIsChatSending] = useState(false)

  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0]
    if (selected) {
      validateAndSetFile(selected)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const dropped = e.dataTransfer.files?.[0]
    if (dropped) {
      validateAndSetFile(dropped)
    }
  }

  const validateAndSetFile = (selectedFile) => {
    setError(null)
    const ext = selectedFile.name.split('.').pop()?.toLowerCase()
    if (!['pdf', 'docx', 'doc', 'txt'].includes(ext)) {
      setError('Invalid file format. Please upload a PDF, DOCX, or TXT file.')
      return
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size exceeds the 10MB limit.')
      return
    }
    setFile(selectedFile)
  }

  const handleUploadAndAnalyze = async () => {
    if (!file) return
    setIsUploading(true)
    setError(null)
    setUploadStep(1) // Extracting text

    try {
      setTimeout(() => setUploadStep(2), 1200) // Analyzing AI

      const result = await aiAPI.uploadDocument(file)
      setDocumentData(result)
      setUploadStep(3)
      if (result.chat_messages) {
        setChatMessages(result.chat_messages)
      }
    } catch (err) {
      console.error('Document analysis failed:', err)
      setError(err.response?.data?.error || 'Failed to analyze document. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSendChatMessage = async (presetText = null) => {
    const textToSend = presetText || chatInput
    if (!textToSend.trim() || !documentData?.id || isChatSending) return

    const userMsg = { role: 'user', content: textToSend, id: Date.now() }
    setChatMessages((prev) => [...prev, userMsg])
    if (!presetText) setChatInput('')
    setIsChatSending(true)

    try {
      const res = await aiAPI.sendDocumentMessage(documentData.id, textToSend)
      const assistantMsg = {
        role: 'assistant',
        content: res.response,
        id: res.assistant_message_id || Date.now() + 1,
      }
      setChatMessages((prev) => [...prev, assistantMsg])
    } catch (err) {
      console.error('Document chat error:', err)
      const errorMsg = {
        role: 'assistant',
        content: 'Failed to process question about this document.',
        id: Date.now() + 1,
      }
      setChatMessages((prev) => [...prev, errorMsg])
    } finally {
      setIsChatSending(false)
    }
  }

  const analysis = documentData?.analysis_result || {}
  const docType = documentData?.document_type || 'general'
  const isResume = docType === 'resume'

  return (
    <div className="min-h-screen bg-[#f8fafc] text-charcoal flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-white border-b border-border/80 px-6 py-4 sticky top-0 z-20 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/student" className="text-muted hover:text-charcoal transition-colors">
            <AppIcon name="arrow_back" className="text-[20px]" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
              📄
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-charcoal">AI Document Analyzer</h1>
              <p className="text-xs text-muted">Upload Resumes, Course Papers, DOCX, or TXT for AI analysis & recommendations</p>
            </div>
          </div>
        </div>

        {documentData && (
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
              Provider: {documentData.ai_provider === 'ollama' ? 'Ollama (Local AI)' : 'Gemini (Cloud AI)'}
            </span>
            <button
              onClick={() => {
                setDocumentData(null)
                setFile(null)
                setChatMessages([])
              }}
              className="text-xs px-3 py-1.5 rounded-lg border border-border bg-white hover:bg-slate-50 text-charcoal font-medium transition-colors cursor-pointer flex items-center gap-1"
            >
              <AppIcon name="refresh" className="text-[14px]" /> Upload New File
            </button>
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {!documentData ? (
          /* Upload State Component */
          <div className="max-w-2xl mx-auto my-12 bg-white rounded-3xl border border-border shadow-sm p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto text-3xl shadow-xs">
              <AppIcon name="cloud_upload" className="text-[36px]" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-charcoal">Upload Document for AI Analysis</h2>
              <p className="text-sm text-muted mt-1">
                Upload your Resume/CV, Course syllabus, or Technical document to get instant AI recommendations, course matches, career roles, and interview prep.
              </p>
            </div>

            {/* Drag & Drop Box */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border hover:border-primary/60 hover:bg-primary/5 rounded-2xl p-8 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 bg-slate-50/50"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.docx,.doc,.txt"
                className="hidden"
              />
              <div className="w-12 h-12 rounded-full bg-white shadow-xs border border-border flex items-center justify-center text-primary">
                <AppIcon name="upload_file" className="text-[24px]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-charcoal">
                  {file ? file.name : 'Click to upload or drag & drop file'}
                </p>
                <p className="text-xs text-muted mt-0.5">Supports PDF, DOCX, TXT (Max size 10MB)</p>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-danger/10 text-danger text-xs font-semibold border border-danger/20 flex items-center justify-center gap-2">
                <AppIcon name="error" className="text-[16px]" /> {error}
              </div>
            )}

            {isUploading ? (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-sm font-semibold text-primary">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  {uploadStep === 1 ? 'Extracting readable text...' : 'Analyzing document with AI...'}
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all duration-500 rounded-full"
                    style={{ width: uploadStep === 1 ? '45%' : '85%' }}
                  />
                </div>
              </div>
            ) : (
              <button
                onClick={handleUploadAndAnalyze}
                disabled={!file}
                className="w-full py-3.5 px-6 rounded-2xl bg-charcoal text-white font-semibold text-sm hover:bg-charcoal/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer"
              >
                Analyze Document Now
              </button>
            )}
          </div>
        ) : (
          /* Results Dashboard */
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header Banner */}
            <div className="bg-white rounded-2xl border border-border/80 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold shrink-0">
                  {isResume ? '👤' : '📘'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-charcoal">
                      {isResume ? (analysis.candidate?.name || 'Resume Analysis') : (analysis.title || documentData.filename)}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 capitalize">
                      {docType.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-muted mt-1 max-w-2xl leading-relaxed">
                    {analysis.summary || 'Document analysis completed successfully.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Contextual Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleSendChatMessage('What are my top strengths in this document?')}
                className="px-3 py-1.5 rounded-xl border border-border bg-white text-xs font-medium text-charcoal hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                💡 Top Strengths
              </button>
              <button
                onClick={() => handleSendChatMessage('What courses should I take based on my document?')}
                className="px-3 py-1.5 rounded-xl border border-border bg-white text-xs font-medium text-charcoal hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                📚 Recommended Courses
              </button>
              <button
                onClick={() => handleSendChatMessage('What job roles fit my background best?')}
                className="px-3 py-1.5 rounded-xl border border-border bg-white text-xs font-medium text-charcoal hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                💼 Career Roles
              </button>
              <button
                onClick={() => handleSendChatMessage('Generate 3 technical interview questions for me.')}
                className="px-3 py-1.5 rounded-xl border border-border bg-white text-xs font-medium text-charcoal hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                🎤 Interview Prep
              </button>
            </div>

            {/* Content Tabs Navigation */}
            <div className="flex border-b border-border bg-white rounded-xl px-2 pt-2 gap-1 overflow-x-auto shadow-2xs">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-all cursor-pointer border-b-2 ${
                  activeTab === 'overview'
                    ? 'border-primary text-primary bg-primary/5'
                    : 'border-transparent text-muted hover:text-charcoal'
                }`}
              >
                🛠 Skills & Overview
              </button>
              <button
                onClick={() => setActiveTab('courses')}
                className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-all cursor-pointer border-b-2 ${
                  activeTab === 'courses'
                    ? 'border-primary text-primary bg-primary/5'
                    : 'border-transparent text-muted hover:text-charcoal'
                }`}
              >
                📚 Recommended Courses ({analysis.recommended_courses?.length || 0})
              </button>
              {isResume && (
                <button
                  onClick={() => setActiveTab('jobs')}
                  className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-all cursor-pointer border-b-2 ${
                    activeTab === 'jobs'
                      ? 'border-primary text-primary bg-primary/5'
                      : 'border-transparent text-muted hover:text-charcoal'
                  }`}
                >
                  💼 Career Roles ({analysis.recommended_jobs?.length || 0})
                </button>
              )}
              <button
                onClick={() => setActiveTab('interview')}
                className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-all cursor-pointer border-b-2 ${
                  activeTab === 'interview'
                    ? 'border-primary text-primary bg-primary/5'
                    : 'border-transparent text-muted hover:text-charcoal'
                }`}
              >
                🎤 Interview Prep
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-all cursor-pointer border-b-2 ${
                  activeTab === 'chat'
                    ? 'border-primary text-primary bg-primary/5'
                    : 'border-transparent text-muted hover:text-charcoal'
                }`}
              >
                💬 Document Chat
              </button>
            </div>

            {/* TAB CONTENT */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Extracted Skills Badge */}
                <div className="bg-white rounded-2xl border border-border p-6 shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-charcoal flex items-center gap-2">
                    <AppIcon name="code" className="text-[18px] text-primary" /> Extracted Skills & Tech Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(analysis.skills || analysis.related_skills || []).map((sk, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-xl bg-slate-100 text-charcoal text-xs font-semibold border border-border/60"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>

                  {analysis.missing_skills && analysis.missing_skills.length > 0 && (
                    <div className="pt-3 border-t border-border/60">
                      <h4 className="text-xs font-bold text-danger mb-2 flex items-center gap-1">
                        🎯 Missing / Recommended Next Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {analysis.missing_skills.map((msk, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-lg bg-danger/10 text-danger text-xs font-medium border border-danger/20"
                          >
                            {msk}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Overall Feedback & Strengths */}
                <div className="bg-white rounded-2xl border border-border p-6 shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-charcoal flex items-center gap-2">
                    <AppIcon name="insights" className="text-[18px] text-emerald-600" /> Key Insights & Strengths
                  </h3>

                  {analysis.strengths && analysis.strengths.length > 0 && (
                    <ul className="space-y-1.5 text-xs text-charcoal/90">
                      {analysis.strengths.map((str, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-emerald-500 font-bold">✓</span> {str}
                        </li>
                      ))}
                    </ul>
                  )}

                  {analysis.overall_feedback && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-border text-xs text-muted leading-relaxed">
                      {analysis.overall_feedback}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Recommended Courses Tab */}
            {activeTab === 'courses' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(analysis.recommended_courses || []).map((crs, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-border/80 p-5 shadow-xs hover:border-primary/40 transition-all space-y-3">
                    <div className="flex items-start justify-between">
                      <h4 className="font-bold text-sm text-charcoal">{crs.course_name}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        crs.priority === 'High' ? 'bg-danger/10 text-danger' : 'bg-primary/10 text-primary'
                      }`}>
                        {crs.priority || 'Medium'} Priority
                      </span>
                    </div>
                    <p className="text-xs text-muted leading-relaxed">{crs.reason}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-border/50 text-[11px] text-muted">
                      <span>Level: <strong className="text-charcoal">{crs.level || 'Intermediate'}</strong></span>
                      <span className="text-primary font-semibold">Smart Match</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Career Roles Tab */}
            {activeTab === 'jobs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(analysis.recommended_jobs || []).map((jb, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-border/80 p-5 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-charcoal">{jb.role}</h4>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {jb.experience_level || 'Entry-Level'}
                      </span>
                    </div>
                    <p className="text-xs text-muted leading-relaxed">{jb.reason}</p>
                    {jb.matching_skills && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {jb.matching_skills.map((ms, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-medium">
                            ✓ {ms}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Interview Prep Tab */}
            {activeTab === 'interview' && (
              <div className="bg-white rounded-2xl border border-border p-6 shadow-xs space-y-6">
                <h3 className="text-sm font-bold text-charcoal">Personalized Technical Interview Questions</h3>
                <div className="space-y-4">
                  {(analysis.interview_questions?.technical_questions || analysis.questions_and_answers || []).map((q, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-border/80 space-y-2">
                      <p className="text-xs font-bold text-charcoal">Q{idx + 1}: {typeof q === 'string' ? q : q.question}</p>
                      {q.answer && <p className="text-xs text-muted leading-relaxed">{q.answer}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Document Chat Tab */}
            {activeTab === 'chat' && (
              <div className="bg-white rounded-2xl border border-border shadow-xs flex flex-col h-[500px]">
                <div className="p-4 border-b border-border bg-slate-50 rounded-t-2xl flex items-center justify-between">
                  <span className="text-xs font-bold text-charcoal">Grounded Document Q&A</span>
                  <span className="text-[11px] text-muted">Ask questions based on {documentData.filename}</span>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatMessages.length === 0 ? (
                    <div className="text-center text-xs text-muted my-12">
                      Ask any question about your uploaded document. Career AI will answer using the document context.
                    </div>
                  ) : (
                    chatMessages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs ${
                          msg.role === 'user' ? 'bg-charcoal text-white' : 'bg-slate-100 text-charcoal border border-border/80'
                        }`}>
                          {msg.role === 'user' ? msg.content : <MarkdownRenderer content={msg.content} theme="light" />}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-3 border-t border-border flex items-center gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                    placeholder="Ask a question about this document..."
                    className="flex-1 text-xs px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:border-primary"
                  />
                  <button
                    onClick={() => handleSendChatMessage()}
                    disabled={!chatInput.trim() || isChatSending}
                    className="px-4 py-2.5 rounded-xl bg-charcoal text-white text-xs font-semibold disabled:opacity-50 cursor-pointer"
                  >
                    Send
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
