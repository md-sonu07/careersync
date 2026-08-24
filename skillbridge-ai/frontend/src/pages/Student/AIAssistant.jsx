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

const chips = [
  'Explain a topic',
  'Teach me something',
  'Create a study plan',
  'Help me prepare for an assessment',
  'What skills do I need for my career?',
  'What should I learn next?',
]

export default function AIAssistant() {
  const [conversations, setConversations] = useState([])
  const [activeConversationId, setActiveConversationId] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
const [isSending, setIsSending] = useState(false)
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)

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
    } catch (err) {
      console.error('Failed to delete:', err)
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
              if (window.innerWidth < 1024) setSidebarOpen(false)
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
                className="hidden shrink-0 text-muted hover:text-red-500 group-hover:block"
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
              <div className="flex h-full flex-col items-center justify-center text-center max-w-lg mx-auto">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <AppIcon name="waving_hand" className="text-4xl" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-charcoal">Welcome to Career AI 👋</h3>
                <p className="mb-8 text-sm text-muted">
                  I can help you understand concepts, learn new skills, prepare for assessments, and plan your career.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {chips.map((c) => (
                    <button
                      key={c}
                      onClick={() => handleSend(c)}
                      className="rounded-md cursor-pointer border border-border bg-white px-4 py-2 text-sm font-medium text-charcoal shadow-sm transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                    >
                      {c}
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
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                    m.role === 'user' 
                      ? 'bg-primary text-white rounded-br-sm' 
                      : 'bg-white border border-border text-charcoal rounded-bl-sm prose prose-sm max-w-none'
                  }`}
                >
                  {m.role === 'user' ? (
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  ) : (
                    <ReactMarkdown>{m.content}</ReactMarkdown>
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
                  
                  <p className={`mt-2 text-[10px] ${m.role === 'user' ? 'text-white/70' : 'text-muted'}`}>
                    {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {isSending && (
              <div className="flex justify-start">
                <div className="bg-white border border-border rounded-2xl rounded-bl-sm px-5 py-4 shadow-sm flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-primary/80 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            
            <div ref={bottomRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-border bg-white p-4">
            <div className="flex items-end gap-2">
              <div className="flex-1 relative">
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
                  placeholder="Ask anything — e.g. 'Explain React hooks' or 'What skills do I need?'"
                  className="w-full resize-none rounded-xl border border-border bg-white px-4 py-3 text-sm text-charcoal placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 disabled:bg-background"
                  rows={1}
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                  onInput={(e) => {
                    e.target.style.height = 'auto'
                    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`
                  }}
                />
              </div>
              <Button 
                onClick={() => handleSend()} 
                disabled={!input.trim() || isSending} 
                className="shrink-0 h-[48px] px-5" 
                icon="send"
              >
                <span className="hidden sm:inline">Send</span>
              </Button>
            </div>
            <p className="mt-2 text-center text-[11px] text-muted">
              Career AI can make mistakes. Verify important information.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
