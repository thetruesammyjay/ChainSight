import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import TransactionFlow from '../components/TransactionFlow';
import NftVisualizer from '../components/NftVisualizer';
import BookmarkManager from '../components/InvestigatorTools/BookmarkManager';
import { fetchWalletDetails } from '../services/api';

export default function WalletView() {
  const { address } = useParams();
  const [wallet, setWallet] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWallet = async () => {
      try {
        const data = await fetchWalletDetails(address!);
        setWallet(data);
      } catch (error) {
        console.error('Error loading wallet:', error);
      } finally {
        setLoading(false);
      }
    };

    if (address) {
      loadWallet();
    }
  }, [address]);

  if (loading) return <div className="loading">Loading wallet...</div>;
  if (!wallet) return <div className="error">Wallet not found</div>;

  return (
    <div className="wallet-view">
      <div className="header">
        <h1>Wallet: {address?.slice(0, 6)}...{address?.slice(-4)}</h1>
        <div className="balance">
          {wallet.balance.toFixed(2)} SOL
        </div>
      </div>

      <div className="content">
        <div className="main">
          <div className="section">
            <h2>Transaction Flow</h2>
            <div style={{ width: '900px', height: '500px' }}>
              <TransactionFlow
                initialAddress={address!}
                rpcUrl="https://api.mainnet-beta.solana.com"
              />
            </div>
          </div>

          <div className="section">
            <h2>NFT Collection</h2>
            <NftVisualizer walletAddress={address!} />
          </div>
        </div>

        <div className="sidebar">
          <BookmarkManager walletAddress={address!} />
        </div>
      </div>
    </div>
  );
}
