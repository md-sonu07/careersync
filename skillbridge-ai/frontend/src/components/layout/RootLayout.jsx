import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { useChatContext } from '../../context/ChatContext';
import GlobalChatPane from '../ai/GlobalChatPane';

export default function RootLayout() {
  const { isChatOpen } = useChatContext();
  const [chatWidth, setChatWidth] = useState(600);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef(null);

  const startResizing = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback((e) => {
    if (isResizing && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidth = containerRect.right - e.clientX;
      if (newWidth >= 300 && newWidth <= (containerRect.width * 0.7)) {
        setChatWidth(newWidth);
      }
    }
  }, [isResizing]);

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);

  return (
    <div 
      ref={containerRef} 
      className={`flex h-screen w-full overflow-hidden bg-background ${isResizing ? 'cursor-col-resize select-none' : ''}`}
    >
      <div 
        className="flex-1 overflow-auto transition-all @container relative"
        style={{ 
          width: isChatOpen ? `calc(100% - ${chatWidth}px)` : '100%',
          flexShrink: 0
        }}
      >
        <Outlet />
      </div>

      {isChatOpen && (
        <div 
          className="w-1.5 cursor-col-resize bg-border hover:bg-primary/50 active:bg-primary z-50 transition-colors flex items-center justify-center shrink-0"
          onMouseDown={startResizing}
        >
           <div className="w-0.5 h-8 bg-charcoal/20 rounded-full" />
        </div>
      )}

      {isChatOpen && (
        <div 
          className="h-full bg-white border-l border-border shadow-xl shrink-0 z-40"
          style={{ width: `${chatWidth}px` }}
        >
          <GlobalChatPane />
        </div>
      )}
    </div>
  );
}
