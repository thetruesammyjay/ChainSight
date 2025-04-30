import { useEffect, useState } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';

interface LiveTransaction {
  signature: string;
  from: string;
  to: string;
  amount: number;
  token: string;
  timestamp: number;
}

export default function LiveFeed() {
  const [transactions, setTransactions] = useState<LiveTransaction[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const ws = new ReconnectingWebSocket(import.meta.env.VITE_WS_URL);
    
    ws.onopen = () => setIsConnected(true);
    ws.onclose = () => setIsConnected(false);
    
    ws.onmessage = (event) => {
      const tx = JSON.parse(event.data);
      setTransactions(prev => [tx, ...prev.slice(0, 19)]);
    };

    return () => ws.close();
  }, []);

  return (
    <div className="live-feed">
      <div className="header">
        <h3>Live Transactions</h3>
        <div className={`status ${isConnected ? 'connected' : 'disconnected'}`}>
          {isConnected ? '● Live' : '○ Disconnected'}
        </div>
      </div>
      <div className="transactions">
        {transactions.map((tx, i) => (
          <div key={i} className="transaction">
            <div className="addresses">
              <span className="from">{tx.from.slice(0, 4)}...{tx.from.slice(-4)}</span>
              <span className="arrow">→</span>
              <span className="to">{tx.to.slice(0, 4)}...{tx.to.slice(-4)}</span>
            </div>
            <div className="details">
              <span className="amount">{tx.amount.toLocaleString()}</span>
              <span className="token">{tx.token}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}