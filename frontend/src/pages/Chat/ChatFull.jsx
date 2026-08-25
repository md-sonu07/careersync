import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ReactMarkdown from 'react-markdown'
import { selectIsAuthenticated, selectCurrentUser } from '../../features/auth/authSlice'
import { aiAPI } from '../../api/ai.api'
import { useAuth } from '../../hooks/useAuth'
import Logo from '../../components/ui/Logo'
import { toast } from 'react-hot-toast'
import AppIcon from '../../components/ui/AppIcon'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import MCQQuizWidget, { parseMCQsFromText } from '../../components/ai/MCQQuizWidget'
import ResumeRecommendationsWidget, { detectTechStack } from '../../components/ai/ResumeRecommendationsWidget'

const chips = [
  'Course Recommendations',
  'Mock Interview',
  'Skill Gap Analysis',
  'Resume Review',
]

function MarkdownRenderer({ content, theme }) {
  const mcqs = parseMCQsFromText(content)

  if (mcqs && mcqs.length > 0) {
    return (
      <div className="space-y-3">
        <MCQQuizWidget questions={mcqs} theme={theme} />
      </div>
    )
  }

  const stack = detectTechStack(content)

  return (
    <div className="space-y-4">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className={`text-xl font-bold mt-5 mb-2.5 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-charcoal'}`}>
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className={`text-lg font-bold mt-4 mb-2 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-charcoal'}`}>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className={`text-base font-bold mt-3 mb-1.5 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-charcoal'}`}>
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className={`text-[15px] leading-7 my-2.5 ${theme === 'dark' ? 'text-[#ececec]' : 'text-[#0d0d0d]'}`}>
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className={`space-y-2 list-disc pl-5 text-[15px] my-3 ${theme === 'dark' ? 'text-[#ececec]' : 'text-[#0d0d0d]'}`}>
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className={`space-y-2 list-decimal pl-5 text-[15px] my-3 ${theme === 'dark' ? 'text-[#ececec]' : 'text-[#0d0d0d]'}`}>
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-7 pl-1">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className={`border-l-4 pl-4 py-1.5 my-3 italic ${theme === 'dark' ? 'border-primary text-gray-300 bg-[#2d2d2d]/50' : 'border-primary text-gray-700 bg-primary/5'} rounded-r-lg`}>
              {children}
            </blockquote>
          ),
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '')
            const lang = match ? match[1] : ''
            if (!inline) {
              return (
                <div className="my-4 rounded-xl overflow-hidden border border-gray-700 bg-[#1e1e1e] shadow-md text-left">
                  <div className="flex items-center justify-between px-4 py-1.5 bg-[#2d2d2d] border-b border-gray-700 text-xs text-gray-300 font-mono">
                    <span className="font-semibold capitalize">{lang || 'code'}</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(String(children).replace(/\n$/, ''))
                        toast.success('Code copied to clipboard!')
                      }}
                      className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs text-gray-400"
                    >
                      <AppIcon name="Copy" className="text-[13px]" />
                      <span>Copy code</span>
                    </button>
                  </div>
                  <pre className="p-4 text-xs font-mono text-emerald-400 overflow-x-auto m-0 leading-relaxed">
                    <code>{children}</code>
                  </pre>
                </div>
              )
            }
            return (
              <code
                className={`px-1.5 py-0.5 rounded text-xs font-mono font-semibold ${theme === 'dark' ? 'bg-[#383838] text-emerald-400' : 'bg-gray-200 text-primary'
                  }`}
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
      {stack && <ResumeRecommendationsWidget stack={stack} content={content} theme={theme} />}
    </div>
  )
}

export default function ChatFull({ isEmbedded = false, onOpenMobileMenu = null }) {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const user = useSelector(selectCurrentUser)
  const { logout } = useAuth()
  const navigate = useNavigate()

  // Theme State
  const [theme, setTheme] = useState(() => localStorage.getItem('chat_theme') || 'dark')

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(nextTheme)
    localStorage.setItem('chat_theme', nextTheme)
  }

  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [isLoadingConversations, setIsLoadingConversations] = useState(true)

  // Track active conversation ID persistent across refresh
  const initialSavedId = localStorage.getItem('public_chat_conversation_id')
  const [activeConversationId, setActiveConversationId] = useState(
    initialSavedId === 'new' ? null : initialSavedId
  )

  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(!isEmbedded)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const fileInputRef = useRef(null)
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

  useEffect(() => {
    fetchConversations()
  }, [])

  useEffect(() => {
    if (activeConversationId && activeConversationId !== 'new') {
      localStorage.setItem('public_chat_conversation_id', activeConversationId)
      if (skipFetchRef.current) {
        skipFetchRef.current = false
        return
      }
      fetchMessages(activeConversationId)
    } else {
      localStorage.setItem('public_chat_conversation_id', 'new')
      setMessages([])
    }
  }, [activeConversationId])

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isSending])

  const fetchConversations = async () => {
    setIsLoadingConversations(true)
    try {
      const data = await aiAPI.getConversations()
      setConversations(data)
      const savedId = localStorage.getItem('public_chat_conversation_id')

      if (savedId === 'new' || !savedId) {
        setActiveConversationId(null)
      } else if (savedId && data.some((c) => String(c.id) === String(savedId))) {
        setActiveConversationId(savedId)
      }
    } catch {
      toast({
        title: 'Failed to load conversations',
        description: 'Could not load conversation history. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoadingConversations(false)
    }
  }

  const fetchMessages = async (conversationId) => {
    setIsLoadingMessages(true)
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
      setIsLoadingMessages(false)
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
          console.warn('Document extraction fallback in chat:', fileErr)
        }
      }

      const targetId = activeConversationId === 'new' ? null : activeConversationId
      const attachmentPayload = attachedFile ? { name: attachedFile.name, size: attachedFile.size } : null
      const response = await aiAPI.sendMessage(messageContent, targetId, docContextText, attachmentPayload)

      const assistantMsg = {
        id: response.assistant_message_id || (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response,
        created_at: response.timestamp || new Date().toISOString(),
        suggestions: response.suggestions,
      }

      setMessages((prev) => [...prev, assistantMsg])

      if (response.conversation_id) {
        localStorage.setItem('public_chat_conversation_id', response.conversation_id)
        skipFetchRef.current = true
        setActiveConversationId(response.conversation_id)
        fetchConversations()
      }
    } catch {
      toast({
        title: 'Failed to send message',
        description: 'Could not send message. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSending(false)
    }
  }

  useEffect(() => {
    const handleCustomSend = (e) => {
      if (e.detail?.text) {
        handleSend(e.detail.text)
      }
    }
    window.addEventListener('careersync:chat:send', handleCustomSend)
    return () => window.removeEventListener('careersync:chat:send', handleCustomSend)
  }, [activeConversationId, input, selectedFile])

  const handleNewChat = () => {
    localStorage.setItem('public_chat_conversation_id', 'new')
    setActiveConversationId(null)
    setMessages([])
  }

  const handleSelectConversation = (id) => {
    localStorage.setItem('public_chat_conversation_id', id)
    setActiveConversationId(id)
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
        handleNewChat()
      }
      toast.success('Conversation deleted')
      setDeleteConfirmId(null)
    }
  }

  return (
    <div
      className={`flex ${isEmbedded ? 'h-full' : 'h-screen'} w-full font-sans overflow-hidden transition-colors ${theme === 'dark' ? 'bg-[#212121] text-[#ececec]' : 'bg-[#FCFCFC] text-charcoal'
        }`}
    >
      {/* Sidebar */}
      <div
        className={`border-r transition-all duration-300 flex flex-col ${theme === 'dark' ? 'bg-[#171717] border-[#2f2f2f]' : 'bg-[#F9F9F9] border-border/60'
          } ${sidebarOpen ? 'w-[280px]' : 'w-[0px] opacity-0 overflow-hidden border-none'}`}
      >
        <div className="p-4 flex items-center justify-between">
          <Logo
            imageClassName="h-6"
            textClassName={`text-[15px] font-extrabold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-charcoal'
              }`}
          />
          <button
            onClick={() => setSidebarOpen(false)}
            className={`p-1.5 flex items-center justify-center cursor-pointer rounded-md transition-colors ${theme === 'dark'
                ? 'text-gray-400 hover:text-white hover:bg-[#2f2f2f]'
                : 'text-muted hover:text-charcoal hover:bg-border/50'
              }`}
          >
            <AppIcon name="left_panel_close" className="text-[18px]" />
          </button>
        </div>

        <div className="px-3 pb-2 pt-3">
          <button
            onClick={handleNewChat}
            className={`flex items-center gap-2 rounded-lg font-semibold py-2.5 px-3 cursor-pointer w-full text-sm transition-all shadow-sm active:scale-[0.98] ${theme === 'dark'
                ? 'bg-[#2f2f2f] text-white hover:bg-[#383838] border border-[#3a3a3a]'
                : 'bg-primary text-white hover:bg-primary-dark shadow-subtle'
              }`}
          >
            <AppIcon name="SquarePen" className="text-[15px]" />
            <span>New Chat</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {isLoadingConversations ? (
            <div className="flex justify-center py-6">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary" />
            </div>
          ) : conversations.length === 0 ? (
            <div
              className={`text-center text-xs mt-6 ${theme === 'dark' ? 'text-gray-500' : 'text-muted'
                }`}
            >
              No conversation history
            </div>
          ) : (
            <div
              className={`text-xs font-semibold uppercase tracking-wider px-2 py-2 mb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-muted/60'
                }`}
            >
              Recent
            </div>
          )}

          {conversations.map((c) => {
            const displayTitle =
              c.title && c.title !== 'New Conversation'
                ? c.title
                : c.first_ai_response ||
                c.first_message_preview ||
                c.last_message_preview ||
                'New Conversation'

            const isActive = String(activeConversationId) === String(c.id)

            return (
              <div
                key={c.id}
                onClick={() => handleSelectConversation(c.id)}
                className={`group relative flex items-center gap-2 cursor-pointer rounded-lg px-3 py-2 transition-colors ${isActive
                    ? theme === 'dark'
                      ? 'bg-[#2f2f2f] text-white font-medium'
                      : 'bg-primary/10 text-primary font-medium'
                    : theme === 'dark'
                      ? 'hover:bg-[#252525] text-gray-300'
                      : 'hover:bg-border/30 text-charcoal/80'
                  }`}
              >
                <AppIcon name="chat_bubble" className="text-[16px] shrink-0 opacity-70" />

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
                      className={`text-xs font-normal border rounded px-1.5 py-0.5 flex-1 focus:outline-none min-w-0 ${theme === 'dark'
                          ? 'bg-[#171717] border-gray-600 text-white'
                          : 'bg-white border-primary/50 text-charcoal'
                        }`}
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
                  <span className="text-sm truncate flex-1">{displayTitle}</span>
                )}

                {/* Hover Action Buttons */}
                <div className="hidden shrink-0 items-center gap-1 group-hover:flex">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setEditingId(c.id)
                      setEditTitle(displayTitle)
                    }}
                    className="p-1 text-muted hover:text-primary rounded hover:bg-primary/10 transition-colors cursor-pointer"
                    title="Rename conversation"
                  >
                    <AppIcon name="edit" className="text-[14px]" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, c.id)}
                    className="p-1 text-muted hover:text-danger rounded hover:bg-danger/10 transition-colors cursor-pointer"
                    title="Delete conversation"
                  >
                    <AppIcon name="delete" className="text-[14px]" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Sidebar Bottom User Profile */}
        <div
          className={`p-3 border-t ${theme === 'dark' ? 'border-[#2f2f2f]' : 'border-border/60'
            }`}
        >
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className={`w-full flex items-center gap-2.5 p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-[#252525]' : 'hover:bg-border/40'
                  }`}
              >
                {user?.avatar_url || user?.profile_image ? (
                  <img
                    src={user.avatar_url || user.profile_image}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover border border-border"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-charcoal text-white flex items-center justify-center font-bold text-xs">
                    {(user?.full_name || user?.name || user?.email || '?').charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="text-left truncate flex-1">
                  <div className="text-sm font-semibold truncate">
                    {user?.full_name || user?.name || 'User'}
                  </div>
                  <div
                    className={`text-[10px] truncate capitalize ${theme === 'dark' ? 'text-gray-400' : 'text-muted'
                      }`}
                  >
                    {user?.role || 'Student'}
                  </div>
                </div>
                <AppIcon name="more_horiz" className="text-[16px] text-muted" />
              </button>

              {profileDropdownOpen && (
                <div
                  className={`absolute bottom-full left-0 w-full mb-1 border shadow-lg rounded-xl overflow-hidden py-1 z-50 animate-in fade-in slide-in-from-bottom-2 ${theme === 'dark'
                      ? 'bg-[#2f2f2f] border-[#383838] text-white'
                      : 'bg-white border-border'
                    }`}
                >
                  <Link
                    to="/student/dashboard"
                    className={`block px-4 py-2 text-sm transition-colors ${theme === 'dark' ? 'hover:bg-[#383838]' : 'hover:bg-background'
                      }`}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={async () => {
                      await logout()
                      navigate('/login')
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-danger hover:bg-danger/5 transition-colors"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className={`block w-full text-center py-2 text-sm font-medium rounded-lg transition-colors ${theme === 'dark'
                  ? 'text-gray-300 hover:bg-[#2f2f2f]'
                  : 'text-charcoal hover:bg-border/40'
                }`}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Main Area */}
      <div
        className={`flex-1 flex flex-col relative transition-colors ${theme === 'dark' ? 'bg-[#212121]' : 'bg-white'
          }`}
      >
        {/* Top Header Bar */}
        <div className="absolute top-0 left-0 w-full p-4 flex items-center justify-between z-10 pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-2">
            {onOpenMobileMenu && (
              <button
                onClick={onOpenMobileMenu}
                className={`p-1.5 lg:hidden flex items-center justify-center cursor-pointer rounded-md backdrop-blur-sm border shadow-sm transition-colors ${theme === 'dark'
                    ? 'bg-[#2f2f2f]/80 text-gray-300 border-[#383838] hover:text-white'
                    : 'bg-white/80 text-muted border-border/50 hover:text-charcoal'
                  }`}
                title="Open Navigation"
              >
                <AppIcon name="menu" className="text-[18px]" />
              </button>
            )}
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className={`p-1.5 flex items-center justify-center cursor-pointer rounded-md backdrop-blur-sm border shadow-sm transition-colors ${theme === 'dark'
                    ? 'bg-[#2f2f2f]/80 text-gray-300 border-[#383838] hover:text-white'
                    : 'bg-white/80 text-muted border-border/50 hover:text-charcoal'
                  }`}
              >
                <AppIcon name="left_panel_open" className="text-[18px]" />
              </button>
            )}
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md backdrop-blur-sm border shadow-sm cursor-default ${theme === 'dark'
                  ? 'bg-[#2f2f2f]/90 border-[#3a3a3a] text-white'
                  : 'bg-white/90 border-border/60 text-charcoal'
                }`}
            >
              <img src="/logo.png" alt="Career AI" className="w-5 h-5 object-contain" />
              <span className="text-sm font-bold">Career AI</span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${theme === 'dark'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-primary/10 text-primary border border-primary/20'
                  }`}
              >
                v01
              </span>
            </div>
          </div>

          <div className="pointer-events-auto flex items-center gap-3">
            {/* Dark / Light Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className={`p-2 rounded-lg cursor-pointer transition-colors flex items-center justify-center border shadow-sm ${theme === 'dark'
                  ? 'bg-[#2f2f2f] text-amber-400 border-[#3a3a3a] hover:bg-[#383838]'
                  : 'bg-white text-charcoal border-border/60 hover:bg-gray-100'
                }`}
            >
              {theme === 'dark' ? (
                <AppIcon name="Sun" className="text-[18px]" />
              ) : (
                <AppIcon name="Moon" className="text-[18px]" />
              )}
            </button>

            {!isEmbedded && (
              <Link
                to="/"
                className={`text-sm font-medium backdrop-blur-sm px-3 py-1.5 rounded-lg border shadow-sm flex items-center gap-1.5 transition-colors ${theme === 'dark'
                    ? 'bg-[#2f2f2f] text-gray-300 border-[#3a3a3a] hover:text-white'
                    : 'bg-white/80 text-charcoal/70 border-border/50 hover:text-charcoal'
                  }`}
              >
                Exit Chat <AppIcon name="arrow_outward" className="text-[16px]" />
              </Link>
            )}
          </div>
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-y-auto w-full pb-36 pt-16 scroll-smooth">
          {!activeConversationId || activeConversationId === 'new' || messages.length === 0 ? (
            /* Empty State Hero */
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-220px)] max-w-3xl mx-auto px-6 text-center animate-in fade-in zoom-in-95 duration-500">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border border-primary/20 shadow-md flex items-center justify-center mb-6 backdrop-blur-md">
                <img src="/logo.png" alt="Career AI" className="w-10 h-10 object-contain drop-shadow-sm" />
              </div>
              <h1
                className={`text-4xl md:text-5xl font-[400] tracking-tight mb-4 ${theme === 'dark' ? 'text-white' : 'text-[#1A1A1A]'
                  }`}
                style={{ fontFamily: 'Georgia, serif' }}
              >
                What can I do for you?
              </h1>
              <p
                className={`text-sm md:text-base mb-8 max-w-md ${theme === 'dark' ? 'text-gray-400' : 'text-[#666666]'
                  }`}
              >
                Interact with Career AI to learn concepts, prepare for interviews, or explore your career path.
              </p>

              {/* Suggestion Chips */}
              <div className="flex flex-wrap justify-center gap-3">
                {chips.map((c) => (
                  <button
                    key={c}
                    onClick={() => handleSend(c)}
                    className={`px-4 py-2 rounded-xl border text-xs font-medium shadow-xs transition-all cursor-pointer ${theme === 'dark'
                        ? 'border-[#3a3a3a] bg-[#2f2f2f] text-gray-200 hover:bg-[#383838] hover:border-primary/50'
                        : 'border-border/60 bg-white text-charcoal/80 hover:border-primary/30 hover:text-primary hover:bg-primary/5'
                      }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Active Chat Messages */
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} group`}
                >
                  {m.role === 'user' ? (
                    <div className="flex items-end gap-3 max-w-[85%] sm:max-w-[75%]">
                      <div
                        className={`rounded-2xl rounded-br-sm px-4 py-3 text-[14px] leading-relaxed font-medium shadow-xs ${theme === 'dark'
                            ? 'bg-[#2f2f2f] text-white'
                            : 'bg-[#f4f4f4] text-charcoal'
                          }`}
                      >
                        {m.attachment && (
                          <div
                            title={typeof m.attachment === 'string' ? m.attachment : (m.attachment.name || 'Attached File')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold mb-2 w-fit border shadow-2xs ${theme === 'dark'
                                ? 'bg-white/10 text-white border-white/20'
                                : 'bg-charcoal/10 text-charcoal border-charcoal/20'
                              }`}
                          >
                            <AppIcon name="description" className="text-[16px] shrink-0" />
                            <span className="truncate max-w-[240px] leading-tight">
                              {typeof m.attachment === 'string' ? m.attachment : (m.attachment.name || 'Attached File')}
                            </span>
                          </div>
                        )}
                        {m.content && m.content.split('\n\n[ATTACHED DOCUMENT')[0].trim() ? (
                          <p className="whitespace-pre-wrap m-0">{m.content.split('\n\n[ATTACHED DOCUMENT')[0].trim()}</p>
                        ) : null}
                      </div>
                      <div className="shrink-0 mb-0.5">
                        {user?.avatar_url || user?.profile_image ? (
                          <img
                            src={user.avatar_url || user.profile_image}
                            alt="User"
                            className="w-9 h-9 rounded-full object-cover shadow-xs"
                          />
                        ) : (
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-xs ${theme === 'dark'
                                ? 'bg-white text-black'
                                : 'bg-charcoal text-white'
                              }`}
                          >
                            {(user?.full_name || user?.name || user?.email || 'U')
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3 mt-10 max-w-[85%] sm:max-w-[80%]">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-xs ${theme === 'dark'
                            ? 'bg-[#2f2f2f]'
                            : 'bg-white'
                          }`}
                      >
                        <img src="/logo.png" alt="Career AI" className="w-9 h-9 object-contain" />
                      </div>
                      <div className="flex-1 space-y-1 ">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-semibold text-sm -mb-4 ${theme === 'dark' ? 'text-white' : 'text-charcoal'
                              }`}
                          >
                            Career AI
                          </span>
                          <span
                            className={`text-[10px] -mb-4 opacity-0 group-hover:opacity-100 transition-opacity ${theme === 'dark' ? 'text-gray-400' : 'text-muted'
                              }`}
                          >
                            {new Date(m.created_at).toLocaleTimeString([], {
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true,
                            })}
                          </span>
                        </div>

                        {/* ChatGPT-style Borderless Markdown Display */}
                        <div className="pt-0.5">
                          <MarkdownRenderer content={m.content} theme={theme} />
                        </div>

                        {m.suggestions && m.suggestions.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-3">
                            {m.suggestions.map((sug, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleSend(sug)}
                                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${theme === 'dark'
                                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-black'
                                    : 'border-primary/20 bg-primary/5 text-primary hover:bg-primary hover:text-white'
                                  }`}
                              >
                                {sug}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isLoadingMessages && (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              )}

              {isSending && (
                <div className="flex items-start gap-3 max-w-[85%] sm:max-w-[80%] animate-in fade-in duration-200">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-xs ${theme === 'dark'
                        ? 'bg-[#2f2f2f]'
                        : 'bg-white'
                      }`}
                  >
                    <img src="/logo.png" alt="Career AI" className="w-7 h-7 object-contain" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-semibold text-xs ${theme === 'dark' ? 'text-white' : 'text-charcoal'
                          }`}
                      >
                        Career AI
                      </span>
                    </div>

                    <div
                      className={`rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5 w-fit ${theme === 'dark'
                          ? 'bg-[#2f2f2f]'
                          : 'bg-[#f4f4f4]'
                        }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full animate-bounce [animation-delay:-0.3s] ${theme === 'dark' ? 'bg-white' : 'bg-charcoal/70'
                          }`}
                      />
                      <div
                        className={`w-2 h-2 rounded-full animate-bounce [animation-delay:-0.15s] ${theme === 'dark' ? 'bg-white' : 'bg-charcoal/70'
                          }`}
                      />
                      <div
                        className={`w-2 h-2 rounded-full animate-bounce ${theme === 'dark' ? 'bg-white' : 'bg-charcoal/70'
                          }`}
                      />
                      <div
                        className={`w-2 h-2 rounded-full animate-bounce [animation-delay:0.15s] ${theme === 'dark' ? 'bg-white' : 'bg-charcoal/70'
                          }`}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div ref={bottomRef} className="h-4" />
            </div>
          )}
        </div>

        {/* Permanent Floating Input Area at Bottom */}
        <div
          className={`absolute bottom-0 left-0 w-full pt-10 pb-6 px-4 ${theme === 'dark'
              ? 'bg-gradient-to-t from-[#212121] via-[#212121] to-transparent'
              : 'bg-gradient-to-t from-white via-white to-transparent'
            }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".pdf,.docx,.doc,.txt,.png,.jpg,.jpeg"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setSelectedFile(e.target.files[0])
              }
            }}
          />

          <div
            className={`max-w-3xl mx-auto w-full rounded-2xl shadow-lg border transition-all flex flex-col ${theme === 'dark'
                ? 'bg-[#2f2f2f] border-[#383838] focus-within:border-gray-500'
                : 'bg-white border-border/80 focus-within:border-primary/50'
              }`}
          >
            {/* Selected File Preview Chip */}
            {selectedFile && (
              <div className="px-4 pt-3 flex items-center gap-2">
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border ${theme === 'dark'
                      ? 'bg-primary/20 text-primary-light border-primary/30'
                      : 'bg-primary/10 text-primary border-primary/20'
                    }`}
                >
                  <AppIcon name="description" className="text-[16px]" />
                  <span className="truncate max-w-[200px]">{selectedFile.name}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="ml-1 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <AppIcon name="close" className="text-[14px]" />
                  </button>
                </div>
              </div>
            )}

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
              className={`w-full resize-none bg-transparent px-4 py-3.5 text-[14px] focus:outline-none disabled:opacity-50 ${theme === 'dark'
                  ? 'text-white placeholder:text-gray-400'
                  : 'text-charcoal placeholder:text-muted'
                }`}
              rows={1}
              style={{ minHeight: '52px', maxHeight: '200px' }}
              onInput={(e) => {
                e.target.style.height = 'auto'
                e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`
              }}
            />

            <div className="px-3 pb-2.5 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer ${theme === 'dark'
                      ? 'text-gray-400 hover:text-white hover:bg-[#383838]'
                      : 'text-muted hover:text-charcoal hover:bg-border/40'
                    }`}
                  title="Attach file"
                >
                  <AppIcon name="add" className="text-[18px]" />
                </button>
              </div>

              <button
                onClick={() => handleSend()}
                disabled={(!input.trim() && !selectedFile) || isSending}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors shadow-sm cursor-pointer ${theme === 'dark'
                    ? 'bg-white text-black disabled:bg-gray-600 disabled:text-gray-400'
                    : 'bg-charcoal text-white disabled:bg-muted/30 disabled:text-muted'
                  }`}
              >
                <AppIcon name="arrow_upward" className="text-[14px]" />
              </button>
            </div>
          </div>
          <div
            className={`mt-2 text-center text-[11px] ${theme === 'dark' ? 'text-gray-500' : 'text-muted'
              }`}
          >
            Career AI can make mistakes. Verify important info.
          </div>
        </div>
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
