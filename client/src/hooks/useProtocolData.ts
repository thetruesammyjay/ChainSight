import { useEffect, useState } from 'react'
import { fetchProtocolMetrics } from '../services/api'
import { ProtocolMetricsResponse } from '../types'

interface ChartData {
  labels: string[]
  datasets: Array<{
    data: number[]
    backgroundColor?: string | string[]
    label?: string
  }>
}

export default function useProtocolData() {
  const [tvlData, setTvlData] = useState<ChartData | null>(null)
  const [volumeData, setVolumeData] = useState<ChartData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchProtocolMetrics()
        
        setTvlData({
          labels: response.data.map((protocol: ProtocolMetricsResponse) => protocol.name),
          datasets: [{
            data: response.data.map((protocol: ProtocolMetricsResponse) => protocol.tvl),
            backgroundColor: [
              '#9945FF', '#14F195', '#00B8FF', '#FF6B6B', '#FFD166'
            ]
          }]
        })
        
        setVolumeData({
          labels: response.data.map((protocol: ProtocolMetricsResponse) => protocol.name),
          datasets: [{
            label: '24h Volume',
            data: response.data.map((protocol: ProtocolMetricsResponse) => protocol.volume24h),
            backgroundColor: '#00B8FF'
          }]
        })
      } catch (error) {
        console.error('Error loading protocol data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return { tvlData, volumeData, loading }
}