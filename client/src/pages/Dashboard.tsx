import { useEffect, useState } from 'react';
import WalletGraph from '../components/WalletGraph';
import LiveFeed from '../components/LiveFeed';
import ProtocolMetrics from '../components/ProtocolMetrics';
import { fetchTopWallets } from '../services/api';
import { WalletGraphData, ChartData } from '../types';

export default function Dashboard() {
  const [walletData, setWalletData] = useState<WalletGraphData | null>(null);
  const [tvlData, setTvlData] = useState<ChartData>({
    labels: [],
    datasets: []
  });
  const [volumeData, setVolumeData] = useState<ChartData>({
    labels: [],
    datasets: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchTopWallets();
        setWalletData(data);
        
        // Format data for Chart.js
        const tvlRawData = [
          { date: '2025-01-01', value: 1200000000 },
          { date: '2025-02-01', value: 1450000000 },
          { date: '2025-03-01', value: 1600000000 },
          { date: '2025-04-01', value: 1750000000 },
        ];
        
        const volumeRawData = [
          { date: '2025-01-01', value: 50000000 },
          { date: '2025-02-01', value: 62000000 },
          { date: '2025-03-01', value: 58000000 },
          { date: '2025-04-01', value: 71000000 },
        ];

        // Convert to Chart.js format
        setTvlData({
          labels: tvlRawData.map(item => item.date),
          datasets: [{
            label: 'TVL',
            data: tvlRawData.map(item => item.value),
            backgroundColor: 'rgba(75, 192, 192, 0.2)'
          }]
        });
        
        setVolumeData({
          labels: volumeRawData.map(item => item.date),
          datasets: [{
            label: 'Volume',
            data: volumeRawData.map(item => item.value),
            backgroundColor: 'rgba(153, 102, 255, 0.2)'
          }]
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <div className="loading">Loading dashboard...</div>;
  
  if (!walletData) return <div className="error">Failed to load wallet data</div>;

  return (
    <div className="dashboard">
      <div className="main-content">
        <h1>Solana Network Overview</h1>
        
        <div className="section">
          <h2>Top Wallets Network</h2>
          <div className="graph-container">
            <WalletGraph 
              width={800} 
              height={500} 
              data={walletData} 
            />
          </div>
        </div>
        
        <div className="section">
          <h2>Protocol Metrics</h2>
          <ProtocolMetrics 
            tvlData={tvlData}
            volumeData={volumeData}
          />
        </div>
      </div>
      
      <div className="sidebar">
        <LiveFeed />
      </div>
    </div>
  );
}