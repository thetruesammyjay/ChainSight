import { Pie, Bar } from 'react-chartjs-2'
import { ChartData } from '../types'

interface ProtocolMetricsProps {
  tvlData: ChartData
  volumeData: ChartData
}

export default function ProtocolMetrics({ tvlData, volumeData }: ProtocolMetricsProps) {
  return (
    <div className="protocol-metrics">
      <div className="chart">
        <h3>Total Value Locked</h3>
        {tvlData && <Pie data={tvlData} />}
      </div>
      <div className="chart">
        <h3>24h Volume</h3>
        {volumeData && <Bar data={volumeData} />}
      </div>
    </div>
  )
}