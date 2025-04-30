import { Connection, Commitment } from '@solana/web3.js'
import Redis from 'ioredis'

interface Config {
  solana: {
    rpcUrl: string
    commitment: Commitment
  }
  redis: {
    host: string
    port: number
    password?: string
  }
}

export const config: Config = {
  solana: {
    rpcUrl: import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
    commitment: 'confirmed'
  },
  redis: {
    host: import.meta.env.VITE_REDIS_HOST || 'localhost',
    port: parseInt(import.meta.env.VITE_REDIS_PORT || '6379'),
    password: import.meta.env.VITE_REDIS_PASSWORD
  }
}

// Initialize connections
export const solanaConnection = new Connection(
  config.solana.rpcUrl, 
  config.solana.commitment // Pass the commitment string directly
)

export const redisClient = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password
})