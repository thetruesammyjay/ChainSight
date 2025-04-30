export interface Tag {
  id: string
  name: string
  createdAt: string
}

export interface Investigation {
  id: string
  name: string
  wallets: {
    address: string
    tags?: Tag[]
  }[]
  createdAt: string
  updatedAt: string
}

export interface ProtocolDetail {
  name: string
  description: string
  metrics: {
    current: {
      tvl: number
      volume24h: number
      transactions24h: number
    }
    historical: {
      volume: Array<{ timestamp: string; value: number }>
    }
  }
  recentTransactions: ProtocolTransaction[]
}

export interface ProtocolTransaction {
  signature: string
  timestamp: string
  type: string
  value: number
  wallet: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
  timestamp: string
}

export interface ProtocolMetricsResponse {
  name: string
  tvl: number
  volume24h: number
  transactions24h: number
  uniqueUsers?: number
}

export interface Wallet {
  address: string
  balance: number
  tokens: Token[]
  transactions: Transaction[]
  nfts: Nft[]
}

export interface Token {
  mint: string
  amount: number
  decimals: number
  symbol?: string
  name?: string
}

export interface Transaction {
  signature: string
  timestamp: string
  fee: number
  status: 'success' | 'failed'
  transfers: Transfer[]
}

export interface Transfer {
  programId: string
  protocol?: string
  from: string
  to: string
  amount: number
  token: string
}

export interface ChartData {
  labels: string[]
  datasets: Array<{
    data: number[]
    backgroundColor?: string | string[]
    label?: string
  }>
}

export interface Nft {
  mintAddress: string
  name: string
  image: string
  collection: string
}

export interface WalletGraphData {
  wallets: {
    address: string;
    balance: number;
    tags?: string[];
  }[];
  connections: {
    from: string;
    to: string;
    value: number;
  }[];
}