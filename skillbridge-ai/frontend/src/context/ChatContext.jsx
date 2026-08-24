import React, { createContext, useState, useContext, useEffect } from 'react';

const ChatContext = createContext();

const GUEST_ID_KEY = 'skillbridge_guest_id';

function getOrCreateGuestId() {
  let guestId = localStorage.getItem(GUEST_ID_KEY)
  if (!guestId) {
    guestId = 'guest_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8)
    localStorage.setItem(GUEST_ID_KEY, guestId)
  }
  return guestId
}

export function ChatProvider({ children }) {
  const isAuthenticated = typeof window !== 'undefined' && !!localStorage.getItem('token')
  const [isChatOpen, setIsChatOpen] = useState(
    sessionStorage.getItem('public_chat_is_open') === 'true'
  );
  const [activeConversationId, setActiveConversationId] = useState(
    localStorage.getItem('public_chat_conversation_id') || null
  );
  const [guestId] = useState(() => getOrCreateGuestId())

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
    <ChatContext.Provider value={{ isChatOpen, toggleChat, closeChat, openChat, activeConversationId, setActiveConversationId, guestId, isGuest: !isAuthenticated }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  return useContext(ChatContext);
}
