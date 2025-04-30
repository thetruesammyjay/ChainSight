import { PublicKey } from '@solana/web3.js';
import { solanaConnection, redisClient, pool } from '../config';

export async function getWalletData(address: string) {
  const cacheKey = `wallet:${address}`;
  const cached = await redisClient.get(cacheKey);
  if (cached) return JSON.parse(cached);

  // Validate address
  if (!PublicKey.isOnCurve(address)) {
    throw new Error('Invalid Solana address');
  }

  const pubkey = new PublicKey(address);
  const [balance, tokenAccounts, transactions] = await Promise.all([
    solanaConnection.getBalance(pubkey),
    solanaConnection.getParsedTokenAccountsByOwner(pubkey, { 
      programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') 
    }),
    solanaConnection.getConfirmedSignaturesForAddress2(pubkey, { limit: 50 }),
  ]);

  // Store in PostgreSQL
  await pool.query(
    `INSERT INTO wallets (address, last_updated) 
     VALUES ($1, NOW()) 
     ON CONFLICT (address) DO UPDATE SET last_updated = NOW()`,
    [address]
  );

  const data = {
    address,
    balance: balance / 1e9,
    tokens: tokenAccounts.value.map(acc => ({
      mint: acc.account.data.parsed.info.mint,
      amount: acc.account.data.parsed.info.tokenAmount.uiAmount,
    })),
    transactions: await Promise.all(
      transactions.map(async tx => ({
        signature: tx.signature,
        blockTime: tx.blockTime,
        status: tx.confirmationStatus,
      }))
    ),
  };

  await redisClient.set(cacheKey, JSON.stringify(data), { EX: 300 });
  return data;
}