import React, { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import Drawer from '../ui/Drawer'
import { aiAPI } from '../../api/ai.api'
import { useChatContext } from '../../context/ChatContext'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated } from '../../features/auth/authSlice'
import { toast } from 'react-hot-toast'
import AppIcon from '../ui/AppIcon';
import Modal from '../ui/Modal'

const chips = [
  'Explain a topic',
  'Teach me something',
  'Code review',
  'Career advice',
]

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

export default function GlobalChatPane() {
  const { closeChat, activeConversationId, setActiveConversationId } = useChatContext()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [isSending, setIsSending] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  const fileInputRef = useRef(null)
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const stored = sessionStorage.getItem('skillbridge_global_chat_sidebar')
    if (stored !== null) return stored === 'true'
    return true
  })

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

  useEffect(() => {
    sessionStorage.setItem('skillbridge_global_chat_sidebar', sidebarOpen)
  }, [sidebarOpen])

  const bottomRef = useRef(null)

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
      if (data.length > 0 && !activeConversationId) {
        setActiveConversationId(data[0].id)
      }
    } catch {
      toast({
        title: 'Failed to load conversations',
        description: 'Could not load conversation history. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const fetchMessages = async (conversationId) => {
    setIsLoadingHistory(true)
    try {
      const data = await aiAPI.getConversation(conversationId)
      setMessages(data.messages || [])
    } catch {
      toast({
        title: 'Failed to load messages',
        description: 'Could not load messages. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoadingHistory(false)
    }
  }

  const handleSend = async (textOverride = null) => {
    const textToSend = textOverride !== null ? textOverride : input
    if (!textToSend.trim() && !selectedFile) return

    const attachedFile = selectedFile
    const messageContent = textToSend.trim() || (attachedFile ? `Please analyze this file: ${attachedFile.name}` : '')

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent,
      created_at: new Date().toISOString(),
      attachment: attachedFile ? { name: attachedFile.name, size: attachedFile.size } : null,
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setSelectedFile(null)
    setIsSending(true)

    try {
      let docContextText = null
      if (attachedFile) {
        try {
          const docRes = await aiAPI.uploadDocument(attachedFile)
          if (docRes) {
            let docText = docRes.extracted_text || ''
            if (!docText && docRes.analysis_result?.summary) {
              docText = `Summary: ${docRes.analysis_result.summary}`
            }
            docContextText = docText.slice(0, 3000)
          }
        } catch (fileErr) {
          console.warn('Document extraction fallback in popup chat:', fileErr)
        }
      }

      const attachmentPayload = attachedFile ? { name: attachedFile.name, size: attachedFile.size } : null
      const response = await aiAPI.sendMessage(messageContent, activeConversationId, docContextText, attachmentPayload)

      const assistantMsg = {
        id: response.assistant_message_id || (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response,
        created_at: response.timestamp || new Date().toISOString(),
        suggestions: response.suggestions,
      }

      setMessages((prev) => [...prev, assistantMsg])

      if (!activeConversationId && response.conversation_id) {
        skipFetchRef.current = true
        setActiveConversationId(response.conversation_id)
        fetchConversations()
      } else {
        fetchConversations()
      }
    } catch {
      toast({
        title: 'Failed to send message',
        description: 'Failed to send message.',
        variant: 'destructive',
      })
    } finally {
      setIsSending(false)
    }
  }

  const handleNewChat = () => {
    setActiveConversationId(null)
    setMessages([])
    setSidebarOpen(false)
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
      <div className="p-3 border-b border-border">
        <Button onClick={handleNewChat} className="w-full justify-center cursor-pointer" icon="add">
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
                setSidebarOpen(false)
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
                {editingId !== c.id && (
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
                )}
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
    <div className="flex flex-col h-full w-full bg-white relative">
      {/* Drawer for history */}
      <Drawer
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        title="Conversation History"
        side="right"
        size="md"
      >
        <SidebarContent />
      </Drawer>

      {/* Chat Header */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-5 bg-sage/10 shrink-0">
        <div className="flex items-center gap-3 flex-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-lgshrink-0">
            <img src="/logo.png" alt="Career AI" className="w-10 h-10 object-contain" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-charcoal truncate">Career AI</p>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 shrink-0">v01</span>
            </div>
            <p className="text-xs text-muted truncate mt-0.5">Your learning assistant</p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 flex items-center justify-center cursor-pointer text-muted hover:text-primary hover:bg-primary/5 rounded-md transition-colors"
            title="History"
          >
            <AppIcon name="history" className="text-[20px]" />
          </button>
          <button
            onClick={handleNewChat}
            className="p-1.5 flex items-center justify-center cursor-pointer text-muted hover:text-primary hover:bg-primary/5 rounded-md transition-colors"
            title="New Chat"
          >
            <AppIcon name="add_circle" className="text-[20px]" />
          </button>
          <button
            onClick={() => window.open('/chat', '_blank')}
            className="p-1.5 flex items-center justify-center cursor-pointer text-muted hover:text-primary hover:bg-primary/5 rounded-md transition-colors"
            title="Open Full Screen"
          >
            <AppIcon name="open_in_new" className="text-[20px]" />
          </button>
          <button
            onClick={closeChat}
            className="p-1.5 flex items-center justify-center cursor-pointer text-muted hover:text-danger hover:bg-danger/5 rounded-md transition-colors"
            title="Close"
          >
            <AppIcon name="close" className="text-[20px]" />
          </button>
        </div>
      </div>

      {/* Chat Messages / Empty State */}
      <div className="flex-1 overflow-y-auto bg-background/20 p-4 space-y-5">
        {!activeConversationId && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-6 px-2 max-w-lg mx-auto animate-in fade-in zoom-in-95 duration-500">
            {/* Logo Icon Ring */}
            <div className="relative mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border border-primary/20 shadow-md flex items-center justify-center backdrop-blur-md">
                <img src="/logo.png" alt="Career AI" className="w-10 h-10 object-contain drop-shadow-sm" />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white" />
              </span>
            </div>

            <h3 className="text-lg font-bold text-charcoal tracking-tight">What can I do for you today?</h3>
            <p className="mt-1 text-xs text-muted max-w-xs mb-6 leading-relaxed">
              Ask about programming, interview prep, career paths, or skill building.
            </p>

            {/* 2x2 Feature Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full text-left">
              {[
                {
                  icon: 'lightbulb',
                  title: 'Explain a Concept',
                  desc: 'Break down complex topics into simple terms',
                  prompt: 'Explain JavaScript in simple terms',
                },
                {
                  icon: 'quiz',
                  title: 'Mock Interview & MCQs',
                  desc: 'Practice interview questions and quizzes',
                  prompt: 'Practice interview questions',
                },
                {
                  icon: 'briefcase',
                  title: 'Career Advice',
                  desc: 'Discover required skills & job options',
                  prompt: 'What skills do I need for my career?',
                },
                {
                  icon: 'code',
                  title: 'Code Review & Debug',
                  desc: 'Analyze code and fix logic errors',
                  prompt: 'Show me a complete code example',
                },
              ].map((card) => (
                <button
                  key={card.title}
                  onClick={() => handleSend(card.prompt)}
                  className="group p-3 rounded-xl border border-border/80 bg-white hover:bg-primary/5 hover:border-primary/40 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-start gap-2.5 text-left"
                >
                  <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                    <AppIcon name={card.icon} className="text-[16px]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-charcoal group-hover:text-primary transition-colors truncate">
                      {card.title}
                    </div>
                    <div className="text-[10px] text-muted line-clamp-2 mt-0.5 leading-tight">
                      {card.desc}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {isLoadingHistory && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        )}

        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed shadow-xs ${m.role === 'user'
                ? 'bg-[#f4f4f4] text-charcoal rounded-tr-sm font-medium'
                : 'bg-white border border-border/60 text-charcoal rounded-tl-sm prose prose-sm max-w-none p-3.5 shadow-xs'
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
                  {m.content && m.content.split('\n\n[ATTACHED DOCUMENT')[0].trim() ? (
                    <p className="whitespace-pre-wrap m-0">{m.content.split('\n\n[ATTACHED DOCUMENT')[0].trim()}</p>
                  ) : null}
                </>
              ) : (
                <MarkdownRenderer content={m.content} />
              )}

              {m.suggestions && m.suggestions.length > 0 && m.role === 'assistant' && (
                <div className="mt-3 flex flex-wrap gap-2 pt-2 border-t border-border/50">
                  {m.suggestions.map((sug, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(sug)}
                      className="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-[11px] font-medium text-primary hover:bg-primary hover:text-white transition-colors text-left"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              )}

              <p className={`mt-1 text-[10px] text-muted ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                {new Date(m.created_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}
              </p>
            </div>
          </div>
        ))}

        {isSending && (
          <div className="flex items-start gap-2.5 justify-start animate-in fade-in duration-200">
            <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-white shadow-xs">
              <img src="/logo.png" alt="Career AI" className="w-6 h-6 object-contain" />
            </div>
            <div className="flex flex-col gap-2">
              {/* Dot typing bubble */}
              <div className="bg-[#f4f4f4] rounded-2xl rounded-tl-sm px-3.5 py-2.5 flex items-center gap-1.5 w-fit">
                <div className="w-1.5 h-1.5 rounded-full bg-charcoal/70 animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1.5 h-1.5 rounded-full bg-charcoal/70 animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1.5 h-1.5 rounded-full bg-charcoal/70 animate-bounce" />
                <div className="w-1.5 h-1.5 rounded-full bg-charcoal/70 animate-bounce [animation-delay:0.15s]" />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-white p-3 shrink-0">

        {selectedFile && (
          <div className="mb-2 flex items-center justify-between bg-surface rounded-lg p-2 border border-border">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="p-1.5 bg-primary/10 text-primary rounded-md shrink-0">
                <AppIcon name="attach_file" className="text-[14px]" />
              </div>
              <span className="text-xs text-charcoal truncate">{selectedFile.name}</span>
            </div>
            <button
              onClick={() => setSelectedFile(null)}
              className="p-1 text-muted hover:text-danger rounded-md transition-colors shrink-0"
            >
              <AppIcon name="close" className="text-[16px]" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-2 bg-white border border-border/80 rounded-2xl px-3 py-2 shadow-xs focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setSelectedFile(e.target.files[0])
              }
            }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="shrink-0 h-8 w-8 flex items-center justify-center rounded-full text-muted hover:text-charcoal hover:bg-border/40 transition-colors cursor-pointer"
            title="Attach file"
          >
            <AppIcon name="attach_file" className="text-[18px]" />
          </button>
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
            placeholder="Ask anything..."
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
        {!isAuthenticated && (
          <p className="mt-1.5 text-center text-[10px] text-muted">
            You are using guest mode. Sign in to save your conversation history.
          </p>
        )}
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
