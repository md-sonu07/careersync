import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import router from './routes'
import { ChatProvider } from './context/ChatContext'

function App() {
  return (
    <ChatProvider>
      <Toaster 
        position="top-right" 
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1F2937',
            color: '#FFFFFF',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          },
          success: {
            duration: 3500,
            iconTheme: {
              primary: '#10B981',
              secondary: '#FFFFFF',
            },
          },
          error: {
            duration: 4500,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#FFFFFF',
            },
          },
        }}
      />
      <RouterProvider router={router} />
    </ChatProvider>
  )
}

export default App
