import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useStore } from './store'
import AppLayout from './components/Layout'
import Dashboard from './pages/Dashboard'
import WalletView from './pages/WalletView'
import ProtocolView from './pages/ProtocolView'
import InvestigationView from './pages/InvestigationView'
import NotFound from './pages/NotFound'
import { useEffect } from 'react'
import { initWebSocket } from './services/webSocket'

function App() {
  const { loadInvestigationHistory } = useStore()

  // Initialize application state
  useEffect(() => {
    loadInvestigationHistory()
    initWebSocket()
  }, [loadInvestigationHistory])

  return (
    <div className="app-container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="wallet/:address" element={<WalletView />} />
            <Route path="protocol/:protocolId" element={<ProtocolView />} />
            <Route path="investigations" element={<InvestigationView />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>

      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 5000,
          style: {
            background: '#1e1e2d',
            color: '#fff',
            border: '1px solid #2d2d3d'
          },
          success: {
            iconTheme: {
              primary: '#14f195', // Solana green
              secondary: '#1e1e2d'
            }
          },
          error: {
            iconTheme: {
              primary: '#ff6b6b',
              secondary: '#1e1e2d'
            }
          }
        }}
      />
    </div>
  )
}

export default App