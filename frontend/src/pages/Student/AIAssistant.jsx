import { useOutletContext } from 'react-router-dom'
import ChatFull from '../Chat/ChatFull'

export default function AIAssistant() {
  const context = useOutletContext() || {}
  return <ChatFull isEmbedded={true} onOpenMobileMenu={context.onMenuClick} />
}
