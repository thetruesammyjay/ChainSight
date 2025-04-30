import { Connection, clusterApiUrl } from '@solana/web3.js';
import { createClient } from 'redis';
import pg from 'pg';

// Environment Configuration
export const config = {
  solana: {
    rpcEndpoint: process.env.SOLANA_RPC || clusterApiUrl('mainnet-beta'),
    quicknodeKey: process.env.QUICKNODE_KEY,
  },
  server: {
    port: parseInt(process.env.PORT || '4000'),
    corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
  },
  database: {
    url: process.env.PG_URL || 'postgres://postgres:postgres@localhost:5432/chainsight',
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
};

// Solana Connection
export const solanaConnection = new Connection(
  config.solana.quicknodeKey 
    ? `${config.solana.rpcEndpoint}?apiKey=${config.solana.quicknodeKey}`
    : config.solana.rpcEndpoint,
  { commitment: 'confirmed' }
);

// Redis Client
export const redisClient = createClient({ url: config.redis.url });
redisClient.connect().catch(console.error);

// PostgreSQL Pool
export const pool = new pg.Pool({
  connectionString: config.database.url,
  max: 20,
  idleTimeoutMillis: 30000,
});

// Protocol Constants
export const PROTOCOL_PROGRAMS = {
  '9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin': 'Serum',
  'EUqojwWA2rd19FZrzeBncJsm38Jm1hEhE3zsmX3bRc2o': 'Raydium',
  'SSwpkEEcbUqx4vtoEByFjSkhKdCT862DNVb52nZg1UZ': 'Saber',
  // Add more protocols
};