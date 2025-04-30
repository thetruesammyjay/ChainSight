import  axios  from 'axios'

const API_BASE_URL = import.meta.env.VITE_APP_API_URL

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Wallet API
export const fetchWalletDetails = async (address: string) => {
  const response = await api.get(`/wallet/${address}`)
  return response.data
}

export const fetchTopWallets = async () => {
  const response = await api.get('/wallets/top')
  return response.data
}

// Protocol API
export const fetchProtocolMetrics = async () => {
  const response = await api.get('/protocols/metrics')
  return response.data
}

export const fetchProtocolDetails = async (protocolId: string) => {
  const response = await api.get(`/protocols/${protocolId}`)
  return response.data
}

// Investigation API
export const saveInvestigation = async (investigation: any) => {
  const response = await api.post('/investigations', investigation)
  return response.data
}

export const fetchInvestigations = async () => {
  const response = await api.get('/investigations')
  return response.data
}

// Error handling interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.error('API Error:', error.response.data)
      throw new Error(error.response.data.message || 'API request failed')
    } else if (error.request) {
      console.error('API Error:', error.request)
      throw new Error('No response received from server')
    } else {
      console.error('API Error:', error.message)
      throw new Error('API request setup error')
    }
  }
)