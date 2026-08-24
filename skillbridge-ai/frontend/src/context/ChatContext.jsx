import React, { createContext, useState, useContext, useEffect } from 'react';

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [isChatOpen, setIsChatOpen] = useState(
    sessionStorage.getItem('public_chat_is_open') === 'true'
  );
  const [activeConversationId, setActiveConversationId] = useState(
    localStorage.getItem('public_chat_conversation_id') || null
  );

  const toggleChat = () => setIsChatOpen(prev => !prev);
  const closeChat = () => setIsChatOpen(false);
  const openChat = () => setIsChatOpen(true);

  // Keep localStorage synced for public users
  useEffect(() => {
    if (activeConversationId) {
      localStorage.setItem('public_chat_conversation_id', activeConversationId);
    } else {
      localStorage.removeItem('public_chat_conversation_id');
    }
  }, [activeConversationId]);

  // Keep chat open state synced in sessionStorage
  useEffect(() => {
    sessionStorage.setItem('public_chat_is_open', isChatOpen);
  }, [isChatOpen]);

  return (
    <ChatContext.Provider value={{ isChatOpen, toggleChat, closeChat, openChat, activeConversationId, setActiveConversationId }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  return useContext(ChatContext);
}
