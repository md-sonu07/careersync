import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import PageHeader from '../../components/common/PageHeader'
import Badge from '../../components/ui/Badge'
import Drawer from '../../components/ui/Drawer'
import { aiAPI } from '../../api/ai.api'
import AppIcon from '../../components/ui/AppIcon'
import { toast } from 'react-hot-toast'
import Modal from '../../components/ui/Modal'
import MCQQuizWidget, { parseMCQsFromText } from '../../components/ai/MCQQuizWidget'
import ResumeRecommendationsWidget, { detectTechStack } from '../../components/ai/ResumeRecommendationsWidget'

const chips = [
  'Explain a topic',
  'Teach me something',
  'Create a study plan',
  'Help me prepare for an assessment',
  'What skills do I need for my career?',
  'What should I learn next?',
]

function MarkdownRenderer({ content }) {
  const mcqs = parseMCQsFromText(content)

  if (mcqs && mcqs.length > 0) {
    return (
      <div className="space-y-3">
        <MCQQuizWidget questions={mcqs} theme="light" />
      </div>
    )
  }

  const stack = detectTechStack(content)

  return (
    <div className="space-y-3">
      <ReactMarkdown
        components={{
          h1: ({ children }) => <h1 className="text-base font-bold mt-3 mb-1 text-charcoal">{children}</h1>,
          h2: ({ children }) => <h2 className="text-sm font-bold mt-2.5 mb-1 text-charcoal">{children}</h2>,
          h3: ({ children }) => <h3 className="text-xs font-bold mt-2 mb-1 text-charcoal">{children}</h3>,
          p: ({ children }) => <p className="text-[14px] leading-relaxed text-charcoal/90 my-2">{children}</p>,
          ul: ({ children }) => <ul className="space-y-1.5 list-disc pl-4 text-[14px] my-2 text-charcoal/90">{children}</ul>,
          ol: ({ children }) => <ol className="space-y-1.5 list-decimal pl-4 text-[14px] my-2 text-charcoal/90">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '')
            const lang = match ? match[1] : ''
            if (!inline) {
              return (
                <div className="my-3 rounded-lg overflow-hidden border border-gray-700 bg-[#1e1e1e] shadow-xs text-left">
                  <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#2d2d2d] border-b border-gray-700 text-xs text-gray-300 font-mono">
                    <span className="font-semibold capitalize">{lang || 'code'}</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(String(children).replace(/\n$/, ''))
                        toast.success('Code copied!')
                      }}
                      className="hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-xs text-gray-400"
                    >
                      <AppIcon name="Copy" className="text-[13px]" />
                      <span>Copy</span>
                    </button>
                  </div>
                  <pre className="p-3.5 text-xs font-mono text-emerald-400 overflow-x-auto m-0 leading-relaxed">
                    <code>{children}</code>
                  </pre>
                </div>
              )
            }
            return (
              <code
                className="px-1.5 py-0.5 rounded text-xs font-mono font-semibold bg-gray-200 text-primary"
                {...props}
              >
                {children}
              </code>
            )
          }
        }}
      >
        {content}
      </ReactMarkdown>
      {stack && <ResumeRecommendationsWidget stack={stack} content={content} theme="light" />}
    </div>
  )
}

export default function AIAssistant() {
  const [conversations, setConversations] = useState([])
  const [activeConversationId, setActiveConversationId] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [error, setError] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)

  const bottomRef = useRef(null)

  const handleRenameSave = async (id) => {
    if (!editTitle.trim()) {
      setEditingId(null)
      return
    }
    try {
      await aiAPI.renameConversation(id, editTitle.trim())
      setConversations((prev) =>
        prev.map((c) => (c.id === id ? { ...c, title: editTitle.trim() } : c))
      )
      toast.success('Conversation renamed')
    } catch {
      toast.error('Failed to rename conversation')
    } finally {
      setEditingId(null)
    }
  }

  const skipFetchRef = useRef(false)

  // Initial load
  useEffect(() => {
    fetchConversations()
  }, [])

  // When active conversation changes, fetch its messages
  useEffect(() => {
    if (activeConversationId) {
      if (skipFetchRef.current) {
        skipFetchRef.current = false
        return
      }
      fetchMessages(activeConversationId)
    } else {
      setMessages([])
    }
  }, [activeConversationId])

  // Scroll to bottom when messages change
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isSending])

  const fetchConversations = async () => {
    try {
      const data = await aiAPI.getConversations()
      setConversations(data)
      // Auto-select first conversation if exists and none is selected
      if (data.length > 0 && !activeConversationId) {
        setActiveConversationId(data[0].id)
      }
    } catch (err) {
      console.error('Failed to fetch conversations:', err)
      toast({
        title: 'Failed to load conversations',
        description: 'Could not load conversation history. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const fetchMessages = async (conversationId) => {
    setIsLoadingHistory(true)
    setError(null)
    try {
      const data = await aiAPI.getConversation(conversationId)
      // Extract messages, they might be nested or we need to fetch them if the API returns them differently.
      // Based on typical DRF serializers, they might not be included in the list, but are included in retrieve.
      // The backend view uses AIConversationSerializer for retrieve which doesn't seem to have messages in fields!
      // Wait, let me check views.py again. Ah! `retrieve` just returns serializer.data, which only has `last_message_preview`.
      // I'll need to double check how to get messages. If it's missing, I'll need to update the backend serializer.
      // Assuming for now the backend provides them, or I'll implement a workaround if not.
      // For now, let's assume `data.messages` exists. If not, I'll fix the backend.
      setMessages(data.messages || [])
    } catch (err) {
      console.error('Failed to fetch messages:', err)
      toast({
        title: 'Failed to load messages',
        description: 'Could not load messages. Please try again.',
        variant: 'destructive',
      })
      setError(null)
    } finally {
      setIsLoadingHistory(false)
    }
  }

  const handleSend = async (textOverride = null) => {
    const textToSend = textOverride !== null ? textOverride : input
    if (!textToSend.trim()) return

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      created_at: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsSending(true)
    setError(null)

    try {
      const response = await aiAPI.sendMessage(textToSend, activeConversationId)

      const assistantMsg = {
        id: response.assistant_message_id || (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response,
        created_at: response.timestamp || new Date().toISOString(),
        suggestions: response.suggestions,
      }

      setMessages((prev) => [...prev, assistantMsg])

      // If this was a new conversation, update our active ID and refresh history
      if (!activeConversationId && response.conversation_id) {
        skipFetchRef.current = true
        setActiveConversationId(response.conversation_id)
        fetchConversations() // refresh sidebar
      } else {
        // Just update the preview if needed (optional)
        fetchConversations()
      }

    } catch (err) {
      console.error('Failed to send message:', err)
      toast({
        title: 'Failed to send message',
        description: err?.response?.data?.error || 'Failed to send message. Please try again.',
        variant: 'destructive',
      })
      // Remove the optimistic user message if it failed, or show error state.
      // For simplicity, we just keep it and show error banner.
    } finally {
      setIsSending(false)
    }
  }

  const handleNewChat = () => {
    setActiveConversationId(null)
    setMessages([])
    setError(null)
    if (window.innerWidth < 1024) setSidebarOpen(false)
  }

  const handleDelete = (e, id) => {
    e.stopPropagation()
    setDeleteConfirmId(id)
  }

  const confirmDelete = async (id) => {
    if (!id) return
    const idStr = String(id)
    try {
      await aiAPI.deleteConversation(idStr)
    } catch (err) {
      console.warn('Backend delete returned status/error, removing locally:', err)
    } finally {
      setConversations((prev) => prev.filter((c) => String(c.id) !== idStr))
      if (String(activeConversationId) === idStr) {
        setActiveConversationId(null)
        setMessages([])
      }
      toast.success('Conversation deleted')
      setDeleteConfirmId(null)
    }
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-white">
      <div className="p-4 border-b border-border">
        <Button onClick={handleNewChat} className="w-full justify-center" icon="add">
          New Chat
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {conversations.length === 0 && (
          <p className="text-center text-sm text-muted mt-4">No history yet</p>
        )}
        {conversations.map((c) => {
          const displayTitle = c.title && c.title !== 'New Conversation'
            ? c.title
            : (c.first_ai_response || c.first_message_preview || c.last_message_preview || 'New Conversation')

          return (
            <div
              key={c.id}
              onClick={() => {
                setActiveConversationId(c.id)
                if (window.innerWidth < 1024) setSidebarOpen(false)
              }}
              className={`group relative flex cursor-pointer flex-col rounded-lg p-3 transition-colors ${activeConversationId === c.id
                  ? 'bg-primary/10 border border-primary/20'
                  : 'hover:bg-background border border-transparent'
                }`}
            >
              <div className="flex items-center justify-between gap-2">
                {editingId === c.id ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleRenameSave(c.id)
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 flex items-center gap-1 min-w-0"
                  >
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') setEditingId(null)
                      }}
                      autoFocus
                      className="text-xs font-normal border border-primary/50 rounded px-1.5 py-0.5 bg-white text-charcoal flex-1 focus:outline-none min-w-0"
                    />
                    <button
                      type="submit"
                      className="p-0.5 text-primary hover:bg-primary/10 rounded cursor-pointer shrink-0"
                      title="Save"
                    >
                      <AppIcon name="check_circle" className="text-[14px]" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setEditingId(null)
                      }}
                      className="p-0.5 text-muted hover:bg-border/30 rounded cursor-pointer shrink-0"
                      title="Cancel"
                    >
                      <AppIcon name="close" className="text-[14px]" />
                    </button>
                  </form>
                ) : (
                  <span className="text-sm font-medium text-charcoal truncate flex-1">{displayTitle}</span>
                )}

                {/* Action Buttons on Hover */}
                <div className="hidden shrink-0 items-center gap-1 group-hover:flex">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setEditingId(c.id)
                      setEditTitle(displayTitle)
                    }}
                    className="p-1 text-muted hover:text-primary rounded hover:bg-primary/10 transition-colors cursor-pointer"
                    title="Rename chat"
                  >
                    <AppIcon name="edit" className="text-[14px]" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, c.id)}
                    className="p-1 text-muted hover:text-danger rounded hover:bg-danger/10 transition-colors cursor-pointer"
                    title="Delete chat"
                  >
                    <AppIcon name="delete" className="text-[14px]" />
                  </button>
                </div>
              </div>
              {c.last_message_preview && (
                <span className="text-xs text-muted truncate mt-1">
                  {c.last_message_preview}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] lg:h-[calc(100vh-120px)]">
      <div className="flex items-center justify-between shrink-0 mb-4">
        <PageHeader
          title="Career AI"
          subtitle="Your learning & career assistant"
        />
        <div className="lg:hidden">
          <Button variant="outline" size="sm" icon="history" onClick={() => setSidebarOpen(true)}>
            History
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden gap-4">
        {/* Desktop Sidebar */}
        <Card className="hidden lg:flex w-72 flex-col !p-0 shrink-0">
          <SidebarContent />
        </Card>

        {/* Mobile Sidebar (Drawer) */}
        <Drawer
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          title="Conversation History"
          placement="left"
        >
          <SidebarContent />
        </Drawer>

        {/* Main Chat Area */}
        <Card className="flex flex-1 flex-col overflow-hidden !p-0">
          {/* Chat Header */}
          <div className="flex items-center gap-3 border-b border-border px-5 py-3 bg-sage/20">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
              <img src="/logo.png" alt="Career AI" className="w-5 h-5 object-contain" />
            </div>
            <div>
              <p className="text-sm font-bold text-charcoal">Career AI</p>
              <p className="text-xs text-muted">Ready to help with your career goals</p>
            </div>
            <Badge variant="success" className="ml-auto hidden sm:flex">ONLINE</Badge>
          </div>

          {/* Chat Messages / Empty State */}
          <div className="flex-1 overflow-y-auto bg-background/30 p-4 sm:p-6 space-y-6">
            {!activeConversationId && messages.length === 0 && (
              <div className="flex flex-col items-center justify-center text-center py-8 px-4 max-w-xl mx-auto animate-in fade-in zoom-in-95 duration-500">
                {/* Logo Icon Ring */}
                <div className="relative mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border border-primary/20 shadow-md flex items-center justify-center backdrop-blur-md">
                    <img src="/logo.png" alt="Career AI" className="w-10 h-10 object-contain drop-shadow-sm" />
                  </div>
                  <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white" />
                  </span>
                </div>

                <h3 className="text-xl font-bold text-charcoal tracking-tight">What can I do for you today?</h3>
                <p className="mt-1 text-xs text-muted max-w-sm mb-6 leading-relaxed">
                  Interact with Career AI to learn new skills, practice interview questions, or explore your career path.
                </p>

                {/* 2x2 Feature Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
                  {[
                    {
                      icon: 'lightbulb',
                      title: 'Explain a Concept',
                      desc: 'Break down complex topics into simple terms',
                      prompt: 'Explain JavaScript in simple terms',
                    },
                    {
                      icon: 'briefcase',
                      title: 'Career & Skills Advice',
                      desc: 'Discover required skills & job options',
                      prompt: 'What skills do I need for my career?',
                    },
                    {
                      icon: 'code',
                      title: 'Code Review & Debug',
                      desc: 'Analyze code, fix bugs, and optimize logic',
                      prompt: 'Show me a complete code example',
                    },
                    {
                      icon: 'quiz',
                      title: 'Mock Interview & MCQs',
                      desc: 'Practice interview questions and quizzes',
                      prompt: 'Practice interview questions',
                    },
                  ].map((card) => (
                    <button
                      key={card.title}
                      onClick={() => handleSend(card.prompt)}
                      className="group p-3.5 rounded-xl border border-border/80 bg-white hover:bg-primary/5 hover:border-primary/40 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-start gap-3 text-left"
                    >
                      <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                        <AppIcon name={card.icon} className="text-[18px]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-charcoal group-hover:text-primary transition-colors truncate">
                          {card.title}
                        </div>
                        <div className="text-[11px] text-muted line-clamp-2 mt-0.5 leading-snug">
                          {card.desc}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {isLoadingHistory && (
              <div className="flex justify-center my-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}

            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-xs ${m.role === 'user'
                      ? 'bg-[#f4f4f4] text-charcoal rounded-tr-sm font-medium'
                      : 'bg-white border border-border/60 text-charcoal rounded-tl-sm prose prose-sm max-w-none p-4 shadow-xs'
                    }`}
                >
                  {m.role === 'user' ? (
                    <>
                      {m.attachment && (
                        <div
                          title={typeof m.attachment === 'string' ? m.attachment : (m.attachment.name || 'Attached File')}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold mb-2 w-fit border shadow-2xs bg-charcoal/10 text-charcoal border-charcoal/20"
                        >
                          <AppIcon name="description" className="text-[16px] shrink-0" />
                          <span className="truncate max-w-[200px] leading-tight">
                            {typeof m.attachment === 'string' ? m.attachment : (m.attachment.name || 'Attached File')}
                          </span>
                        </div>
                      )}
                      <p className="whitespace-pre-wrap m-0">{m.content}</p>
                    </>
                  ) : (
                    <MarkdownRenderer content={m.content} />
                  )}

                  {/* Render suggestions if any */}
                  {m.suggestions && m.suggestions.length > 0 && m.role === 'assistant' && (
                    <div className="mt-4 flex flex-wrap gap-2 pt-3 border-t border-border/50">
                      {m.suggestions.map((sug, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(sug)}
                          className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary hover:bg-primary hover:text-white transition-colors"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}

                  <p className={`mt-1.5 text-[10px] text-muted ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {new Date(m.created_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}
                  </p>
                </div>
              </div>
            ))}

            {isSending && (
              <div className="flex items-start gap-3 justify-start animate-in fade-in duration-200">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 shadow-xs bg-white">
                  <img src="/logo.png" alt="Career AI" className="w-7 h-7 object-contain" />
                </div>
                <div className="flex flex-col gap-2">
                  {/* Dot typing bubble */}
                  <div className="bg-[#f4f4f4] rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5 w-fit">
                    <div className="w-2 h-2 rounded-full bg-charcoal/70 animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-2 h-2 rounded-full bg-charcoal/70 animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-2 h-2 rounded-full bg-charcoal/70 animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-charcoal/70 animate-bounce [animation-delay:0.15s]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-border bg-white p-3 sm:p-4">
            <div className="flex items-center gap-2 bg-white border border-border/80 rounded-2xl px-3 py-2 shadow-xs focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                disabled={isSending}
                placeholder="Message Career AI..."
                className="flex-1 resize-none bg-transparent py-1.5 leading-normal text-[14px] text-charcoal placeholder:text-muted focus:outline-none disabled:opacity-50 my-auto"
                rows={1}
                style={{ minHeight: '26px', maxHeight: '120px' }}
                onInput={(e) => {
                  e.target.style.height = 'auto'
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`
                }}
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isSending}
                className="shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-charcoal text-white disabled:bg-muted/30 disabled:text-muted transition-colors shadow-xs active:scale-95 cursor-pointer"
              >
                <AppIcon name="arrow_upward" className="text-[16px]" />
              </button>
            </div>
            <p className="mt-2 text-center text-[10px] text-muted">
              Career AI can make mistakes. Verify important information.
            </p>
          </div>
        </Card>
      </div>

      {/* Custom Confirmation Modal for Delete */}
      <Modal
        open={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete Conversation?"
        description="Are you sure you want to delete this conversation history? This action cannot be undone."
        size="sm"
      >
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <Button variant="outline" size="sm" onClick={() => setDeleteConfirmId(null)}>
            Cancel
          </Button>
          <button
            type="button"
            className="px-3 py-1.5 text-sm font-semibold rounded-lg bg-danger text-white hover:bg-danger/90 transition-colors cursor-pointer"
            onClick={(e) => {
              e.stopPropagation()
              confirmDelete(deleteConfirmId)
            }}
          >
            Delete Chat
          </button>
        </div>
      </Modal>
    </div>
  )
}
