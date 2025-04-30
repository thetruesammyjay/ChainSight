import { toast } from 'react-hot-toast'
import { useStore } from '../store'

export function initWebSocket() {
  const ws = new WebSocket(import.meta.env.VITE_WS_URL)

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data)
    useStore.getState().updateLiveData(data)
    toast.success(`New transaction: ${data.signature.slice(0, 8)}...`)
  }

  ws.onclose = () => {
    setTimeout(initWebSocket, 5000) // Reconnect
  }

  return ws
}