import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ReactMarkdown from 'react-markdown'
import { selectIsAuthenticated, selectCurrentUser } from '../../features/auth/authSlice'
import { aiAPI } from '../../api/ai.api'
import { useAuth } from '../../hooks/useAuth'
import Logo from '../../components/ui/Logo'
import { toast } from 'react-hot-toast'
import AppIcon from '../../components/ui/AppIcon';
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'

const chips = [
  'Course Recommendations',
  'Mock Interview',
  'Skill Gap Analysis',
  'Resume Review',
]

export default function ChatFull() {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const user = useSelector(selectCurrentUser)
  const { logout } = useAuth()
  const navigate = useNavigate()

  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [isLoadingConversations, setIsLoadingConversations] = useState(true)
  const [activeConversationId, setActiveConversationId] = useState(
    localStorage.getItem('public_chat_conversation_id') || null
  )
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)

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

  useEffect(() => {
    fetchConversations()
  }, [])

  useEffect(() => {
    if (activeConversationId) {
      localStorage.setItem('public_chat_conversation_id', activeConversationId);
      fetchMessages(activeConversationId)
    } else {
      localStorage.removeItem('public_chat_conversation_id');
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
      if (data.length > 0 && !activeConversationId) {
        setActiveConversationId(data[0].id)
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

      if (!activeConversationId && response.conversation_id) {
        setActiveConversationId(response.conversation_id)
        fetchConversations()
      } else {
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

  const handleNewChat = () => {
    setActiveConversationId(null)
    setMessages([])
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

  return (
    <div className="flex h-screen w-full bg-[#FCFCFC] overflow-hidden text-charcoal font-sans">

      {/* Sidebar */}
      <div
        className={`bg-[#F9F9F9] border-r border-border/60 transition-all duration-300 flex flex-col ${sidebarOpen ? 'w-[280px]' : 'w-[0px] opacity-0 overflow-hidden border-none'}`}
      >
        <div className="p-4 flex items-center justify-between">
          <Logo
            imageClassName="h-6"
            textClassName="text-[15px] font-extrabold tracking-tight"
          />
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 flex items-center justify-center cursor-pointer text-muted hover:text-charcoal rounded-md hover:bg-border/50 transition-colors"
          >
            <AppIcon name="left_panel_close" className="text-[18px]" />
          </button>
        </div>

        <div className="px-3 pb-2 pt-3">
          <button
            onClick={handleNewChat}
            className="flex items-center gap-2 rounded-lg bg-primary text-white hover:bg-primary-dark shadow-subtle hover:shadow-soft transition-all text-sm font-semibold py-2.5 px-3 cursor-pointer w-full active:scale-[0.98]"
          >
            <AppIcon name="SquarePen" className="text-[15px]" />
            <span>New Chat</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {isLoadingConversations ? (
            <div className="flex justify-center py-6">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center text-xs text-muted mt-6">No conversation history</div>
          ) : (
            <div className="text-xs font-semibold text-muted/60 uppercase tracking-wider px-2 py-2 mb-1">
              Recent
            </div>
          )}
          {conversations.map((c) => {
            const displayTitle = c.title && c.title !== 'New Conversation'
              ? c.title
              : (c.first_ai_response || c.first_message_preview || c.last_message_preview || 'New Conversation')

            return (
              <div
                key={c.id}
                onClick={() => setActiveConversationId(c.id)}
                className={`group relative flex items-center gap-2 cursor-pointer rounded-lg px-3 py-2 transition-colors ${activeConversationId === c.id
                    ? 'bg-primary/10 text-primary font-medium'
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

        {/* User Profile in Sidebar Bottom */}
        <div className="p-3 border-t border-border/60">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-border/40 transition-colors"
              >
                {user?.avatar_url || user?.profile_image ? (
                  <img src={user.avatar_url || user.profile_image} alt="Profile" className="w-8 h-8 rounded-full object-cover border border-border" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-charcoal text-white flex items-center justify-center font-bold text-xs">
                    {(user?.full_name || user?.name || user?.email || '?').charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="text-left truncate flex-1">
                  <div className="text-sm font-semibold truncate">{user?.full_name || user?.name || 'User'}</div>
                  <div className="text-[10px] text-muted truncate capitalize">{user?.role || 'Student'}</div>
                </div>
                <AppIcon name="more_horiz" className="text-[16px] text-muted" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute bottom-full left-0 w-full mb-1 bg-white border border-border shadow-lg rounded-xl overflow-hidden py-1 z-50 animate-in fade-in slide-in-from-bottom-2">
                  <Link to="/student/dashboard" className="block px-4 py-2 text-sm hover:bg-background transition-colors">
                    Dashboard
                  </Link>
                  <button
                    onClick={async () => {
                      await logout();
                      navigate('/login');
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-danger hover:bg-danger/5 transition-colors"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="block w-full text-center py-2 text-sm font-medium text-charcoal hover:bg-border/40 rounded-lg transition-colors">
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col relative bg-white">

        {/* Topbar */}
        <div className="absolute top-0 left-0 w-full p-4 flex items-center justify-between z-10 pointer-events-none">
          <div className="pointer-events-auto">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-1.5 flex items-center justify-center cursor-pointer text-muted hover:text-charcoal rounded-md hover:bg-border/50 transition-colors bg-white/80 backdrop-blur-sm border border-border/50 shadow-sm"
              >
                <AppIcon name="left_panel_open" className="text-[18px]" />
              </button>
            )}
          </div>
          <div className="pointer-events-auto flex items-center gap-3">
            <Link to="/" className="text-sm font-medium text-charcoal/70 hover:text-charcoal transition-colors bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-border/50 shadow-sm flex items-center gap-1.5">
              Exit Chat <AppIcon name="arrow_outward" className="text-[16px]" />
            </Link>
          </div>
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-y-auto w-full pb-36 pt-16 scroll-smooth">
          {(!activeConversationId && messages.length === 0) ? (

            /* Empty State Hero */
            <div className="flex flex-col items-center justify-center h-full max-w-3xl mx-auto px-6 text-center animate-in fade-in zoom-in-95 duration-500">
              <h1 className="text-4xl md:text-5xl font-[400] text-[#1A1A1A] tracking-tight mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                What can I do for you?
              </h1>
              <p className="text-[#666666] text-sm md:text-base mb-10">
                Interact with Career AI and explore your career possibilities
              </p>

              {/* Main Input Box (Empty State) */}
              <div className="w-full max-w-2xl bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-border/60 hover:border-border transition-all flex flex-col">
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
                  placeholder="How can I help you today?"
                  className="w-full resize-none bg-transparent px-5 py-4 text-[15px] text-charcoal placeholder:text-muted/70 focus:outline-none disabled:opacity-50 min-h-[100px]"
                />

                <div className="px-3 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button className="w-8 h-8 rounded-full flex items-center justify-center text-muted hover:text-charcoal hover:bg-border/40 transition-colors">
                      <AppIcon name="add" className="text-[20px]" />
                    </button>
                    <button className="w-8 h-8 rounded-full flex items-center justify-center text-muted hover:text-charcoal hover:bg-border/40 transition-colors">
                      <AppIcon name="language" className="text-[18px]" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isSending}
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-charcoal text-white disabled:bg-muted/30 disabled:text-muted transition-colors shadow-sm"
                  >
                    <AppIcon name="arrow_upward" className="text-[16px]" />
                  </button>
                </div>
              </div>

              {/* Suggestion Chips */}
              <div className="flex flex-wrap justify-center gap-3 mt-8">
                {chips.map((c) => (
                  <button
                    key={c}
                    onClick={() => handleSend(c)}
                    className="px-4 py-2 rounded-xl border border-border/60 bg-white text-xs font-medium text-charcoal/80 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

          ) : (

            /* Active Chat Messages */
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-8 pb-10">
              {messages.map((m) => (
                <div key={m.id} className="flex gap-4 group">
                  {/* Avatar */}
                  <div className="shrink-0 mt-1">
                    {m.role === 'user' ? (
                      user?.avatar_url || user?.profile_image ? (
                        <img src={user.avatar_url || user.profile_image} alt="User" className="w-8 h-8 rounded-full object-cover shadow-sm border border-border/50" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-charcoal text-white flex items-center justify-center font-black text-xl shadow-sm">
                          {(user?.full_name || user?.name || user?.email || 'Y').charAt(0).toUpperCase()}
                        </div>
                      )
                    ) : (
                      <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm">
                        <img src="/logo.png" alt="Career AI" className="w-10 h-10 object-contain" />
                      </div>
                    )}
                  </div>

                  {/* Message Content */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-charcoal">
                        {m.role === 'user' ? (user?.full_name || user?.name || 'You') : 'Career AI'}
                      </span>
                      <span className="text-[10px] text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                        {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="prose prose-sm prose-slate max-w-none text-[15px] leading-relaxed">
                      {m.role === 'user' ? (
                        <p className="whitespace-pre-wrap m-0">{m.content}</p>
                      ) : (
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      )}
                    </div>

                    {m.suggestions && m.suggestions.length > 0 && m.role === 'assistant' && (
                      <div className="flex flex-wrap gap-2 pt-3">
                        {m.suggestions.map((sug, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSend(sug)}
                            className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary hover:text-white transition-colors"
                          >
                            {sug}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoadingMessages && (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              )}

              {isSending && (
                <div className="flex gap-4 animate-pulse">
                  <div className="shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-full bg-primary/40 flex items-center justify-center" />
                  </div>
                  <div className="space-y-3 flex-1 pt-2">
                    <div className="h-4 bg-muted/20 rounded w-1/3" />
                    <div className="h-4 bg-muted/20 rounded w-1/2" />
                  </div>
                </div>
              )}

              <div ref={bottomRef} className="h-4" />
            </div>

          )}
        </div>

        {/* Floating Input Area (Active State) */}
        {(activeConversationId || messages.length > 0) && (
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-white via-white to-transparent pt-10 pb-6 px-4">
            <div className="max-w-3xl mx-auto w-full bg-white rounded-2xl shadow-[0_0_15px_rgb(0,0,0,0.05)] border border-border/80 transition-all flex flex-col">
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
                className="w-full resize-none bg-transparent px-4 py-3.5 text-[14px] text-charcoal placeholder:text-muted focus:outline-none disabled:opacity-50"
                rows={1}
                style={{ minHeight: '52px', maxHeight: '200px' }}
                onInput={(e) => {
                  e.target.style.height = 'auto'
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`
                }}
              />

              <div className="px-3 pb-2.5 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button className="w-7 h-7 rounded-full flex items-center justify-center text-muted hover:text-charcoal hover:bg-border/40 transition-colors">
                    <AppIcon name="add" className="text-[18px]" />
                  </button>
                </div>

                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isSending}
                  className="w-7 h-7 rounded-full flex items-center justify-center bg-charcoal text-white disabled:bg-muted/30 disabled:text-muted transition-colors shadow-sm"
                >
                  <AppIcon name="arrow_upward" className="text-[14px]" />
                </button>
              </div>
            </div>
            <div className="text-center mt-2 text-[10px] text-muted">
              AI can make mistakes. Check important info.
            </div>
          </div>
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
