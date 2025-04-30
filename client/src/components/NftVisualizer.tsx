import { useEffect, useState } from 'react';
import { SolanaService } from '../services/solana';
import { PublicKey } from '@solana/web3.js';
import { Nft } from '../types';

interface NftVisualizerProps {
  walletAddress: string;
}

export default function NftVisualizer({ walletAddress }: NftVisualizerProps) {
  const [nfts, setNfts] = useState<Nft[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNfts = async () => {
      setLoading(true);
      try {
        const pubkey = new PublicKey(walletAddress);
        const walletNfts = await SolanaService.getWalletNfts(pubkey);
        setNfts(walletNfts);
      } catch (error) {
        console.error('Error fetching NFTs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNfts();
  }, [walletAddress]);

  return (
    <div className="nft-container">
      <h2>NFT Collection</h2>
      {loading ? (
        <div className="loading">Loading NFTs...</div>
      ) : (
        <div className="nft-grid">
          {nfts.map((nft, i) => (
            <div key={i} className="nft-card">
              <img 
                src={nft.image} 
                alt={nft.name} 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-nft.png';
                }}
              />
              <div className="nft-info">
                <h3>{nft.name}</h3>
                <p>{nft.collection}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}