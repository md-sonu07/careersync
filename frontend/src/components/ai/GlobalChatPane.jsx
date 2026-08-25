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

const chips = [
  'Explain a topic',
  'Teach me something',
  'Create a study plan',
  'Help me prepare for an assessment',
]

export default function GlobalChatPane() {
  const { closeChat, activeConversationId, setActiveConversationId } = useChatContext()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [isSending, setIsSending] = useState(false)
  const fileInputRef = useRef(null)
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const stored = sessionStorage.getItem('skillbridge_global_chat_sidebar')
    if (stored !== null) return stored === 'true'
    return true
  })

  useEffect(() => {
    sessionStorage.setItem('skillbridge_global_chat_sidebar', sidebarOpen)
  }, [sidebarOpen])

  const bottomRef = useRef(null)

  // Initial load
  useEffect(() => {
    fetchConversations()
  }, [])

  // When active conversation changes, fetch its messages
  useEffect(() => {
    if (activeConversationId) {
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
    if (!textToSend.trim()) return

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      created_at: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setSelectedFile(null)
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

  const handleDelete = async (e, id) => {
    e.stopPropagation()
    if (!window.confirm('Delete this conversation?')) return
    try {
      await aiAPI.deleteConversation(id)
      setConversations((prev) => prev.filter((c) => c.id !== id))
      if (activeConversationId === id) {
        setActiveConversationId(null)
        setMessages([])
      }
    } catch {
      toast({
        title: 'Failed to delete',
        description: 'Could not delete conversation. Please try again.',
        variant: 'destructive',
      })
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
        {conversations.map((c) => (
          <div
            key={c.id}
            onClick={() => {
              setActiveConversationId(c.id)
              setSidebarOpen(false)
            }}
            className={`group relative flex cursor-pointer flex-col rounded-lg p-3 transition-colors ${
              activeConversationId === c.id
                ? 'bg-primary/10 border border-primary/20'
                : 'hover:bg-background border border-transparent'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-sm font-medium text-charcoal truncate">{c.title}</span>
              <button
                onClick={(e) => handleDelete(e, c.id)}
                className="hidden shrink-0 text-muted hover:text-red-500 group-hover:flex items-center justify-center cursor-pointer"
              >
                <AppIcon name="delete" className="text-[16px]" />
              </button>
            </div>
            <span className="text-xs text-muted truncate mt-1">
              {c.last_message_preview || 'New Conversation'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="flex flex-col h-full w-full bg-white relative">
      {/* Drawer for history */}
      <Drawer
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        title="Conversation History"
        placement="left"
      >
        <SidebarContent />
      </Drawer>

      {/* Chat Header */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-5 bg-sage/10 shrink-0">
        <div className="flex items-center gap-3 flex-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-lgshrink-0">
            <img src="/logo.png" alt="Career AI" className="w-10 h-10 object-contain" />
          </div>
          <div className="overflow-hidden">
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-charcoal truncate">Career AI</p>
              <Badge variant="success" className="shrink-0 text-[10px] py-0 px-1.5 h-4">ONLINE</Badge>
            </div>
            <p className="text-xs text-muted truncate">Your learning assistant</p>
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
          <div className="flex flex-col items-center justify-center text-center py-8">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <AppIcon name="waving_hand" className="text-3xl" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-charcoal">Career AI 👋</h3>
            <p className="mb-6 text-sm text-muted px-4">
              I can help you understand concepts, learn new skills, prepare for assessments, and plan your career.
            </p>
            <div className="flex flex-wrap justify-center gap-2 px-2">
              {chips.map((c) => (
                <button
                  key={c}
                  onClick={() => handleSend(c)}
                  className="rounded-md cursor-pointer border border-border bg-white px-3 py-1.5 text-xs font-medium text-charcoal shadow-sm transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                >
                  {c}
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
              className={`max-w-[90%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed shadow-sm ${
                m.role === 'user' 
                  ? 'bg-primary text-white rounded-br-sm' 
                  : 'bg-white border border-border text-charcoal rounded-bl-sm prose prose-sm max-w-none'
              }`}
            >
              {m.role === 'user' ? (
                <p className="whitespace-pre-wrap m-0">{m.content}</p>
              ) : (
                <ReactMarkdown>{m.content}</ReactMarkdown>
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
              
              <p className={`mt-1.5 text-[10px] ${m.role === 'user' ? 'text-white/70' : 'text-muted'}`}>
                {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        
        {isSending && (
          <div className="flex justify-start">
            <div className="bg-white border border-border rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-primary/80 animate-bounce" style={{ animationDelay: '300ms' }} />
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

        <div className="flex items-end gap-2 bg-background border border-border rounded-xl p-1 transition-all">
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
            className="shrink-0 h-9 w-9 mb-0.5 ml-0.5 flex items-center justify-center rounded-lg text-muted hover:text-primary hover:bg-primary/5 transition-colors"
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
            className="flex-1 resize-none bg-transparent py-2 text-[13px] text-charcoal placeholder:text-muted focus:outline-none disabled:opacity-50"
            rows={1}
            style={{ minHeight: '36px', maxHeight: '100px' }}
            onInput={(e) => {
              e.target.style.height = 'auto'
              e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`
            }}
          />
          <button 
            onClick={() => handleSend()} 
            disabled={(!input.trim() && !selectedFile) || isSending} 
            className="shrink-0 h-9 w-9 mb-0.5 mr-0.5 flex items-center justify-center rounded-lg bg-primary text-white disabled:opacity-50 disabled:bg-muted transition-colors"
          >
            <AppIcon name="send" className="text-[18px]" />
          </button>
        </div>
        {!isAuthenticated && (
          <p className="mt-1.5 text-center text-[10px] text-muted">
            You are using guest mode. Sign in to save your conversation history.
          </p>
        )}
      </div>
    </div>
  )
}
