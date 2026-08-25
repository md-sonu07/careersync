import api from './axios'
import ENDPOINTS from './endpoints'

export const aiAPI = {
  // Get all conversations for current user
  getConversations: async () => {
    const response = await api.get(ENDPOINTS.AI.CONVERSATIONS)
    return response.data
  },

  // Get a specific conversation with all its messages
  getConversation: async (id) => {
    const response = await api.get(ENDPOINTS.AI.CONVERSATION_DETAIL(id))
    return response.data
  },

  // Create a new conversation (optional, chat endpoint does this automatically)
  createConversation: async (data = { title: 'New Conversation' }) => {
    const response = await api.post(ENDPOINTS.AI.CONVERSATIONS, data)
    return response.data
  },

  // Rename a conversation
  renameConversation: async (id, title) => {
    const response = await api.patch(ENDPOINTS.AI.CONVERSATION_DETAIL(id), { title })
    return response.data
  },

  // Delete a conversation
  deleteConversation: async (id) => {
    const response = await api.delete(ENDPOINTS.AI.CONVERSATION_DETAIL(id))
    return response.data
  },

  // Send a message
  sendMessage: async (message, conversationId = null, docContext = null, attachment = null) => {
    const payload = { message: message || '' }
    if (conversationId) {
      payload.conversation_id = conversationId
    }
    if (docContext) {
      payload.doc_context = docContext
    }
    if (attachment) {
      payload.attachment = attachment
    }
    const response = await api.post(ENDPOINTS.AI.CHAT, payload)
    return response.data
  },

  // Document Analysis APIs
  uploadDocument: async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post(ENDPOINTS.AI.DOCUMENT_UPLOAD, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  getDocument: async (id) => {
    const response = await api.get(ENDPOINTS.AI.DOCUMENT_DETAIL(id))
    return response.data
  },

  sendDocumentMessage: async (documentId, message) => {
    const response = await api.post(ENDPOINTS.AI.DOCUMENT_CHAT(documentId), { message })
    return response.data
  },
}
