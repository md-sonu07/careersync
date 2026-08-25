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
  sendMessage: async (message, conversationId = null) => {
    const payload = { message }
    if (conversationId) {
      payload.conversation_id = conversationId
    }
    const response = await api.post(ENDPOINTS.AI.CHAT, payload)
    return response.data
  },
}
