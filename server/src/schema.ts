import { gql } from 'apollo-server-express'

export const typeDefs = gql`
  type Query {
    # Wallet Queries
    wallet(address: String!): Wallet
    topWallets(limit: Int = 10): [Wallet!]!

    # Protocol Queries
    protocol(id: String!): Protocol
    protocolMetrics: [ProtocolMetric!]!

    # Investigation Queries
    investigations: [Investigation!]!
    investigation(id: String!): Investigation
  }

  type Mutation {
    # Investigation Mutations
    createInvestigation(name: String!): Investigation!
    updateInvestigation(id: String!, name: String): Investigation!
    deleteInvestigation(id: String!): Boolean!
    addWalletToInvestigation(investigationId: String!, address: String!): Investigation!
  }

  # Core Types
  type Wallet {
    address: String!
    balance: Float!
    tokens: [Token!]!
    transactions(limit: Int = 25): [Transaction!]!
    nfts: [NFT!]!
  }

  type Token {
    mint: String!
    amount: Float!
    decimals: Int!
    symbol: String
    name: String
  }

  type Transaction {
    signature: String!
    timestamp: String!
    fee: Float!
    status: String!
    transfers: [Transfer!]!
  }

  type Transfer {
    programId: String!
    protocol: String
    from: String!
    to: String!
    amount: Float!
    token: String!
  }

  type NFT {
    mintAddress: String!
    name: String!
    image: String!
    collection: String!
  }

  type Protocol {
    id: String!
    name: String!
    description: String
    metrics: ProtocolMetrics!
    recentTransactions(limit: Int = 25): [ProtocolTransaction!]!
  }

  type ProtocolMetric {
    name: String!
    tvl: Float!
    volume24h: Float!
    transactions24h: Int!
    uniqueUsers: Int
  }

  type ProtocolMetrics {
    current: ProtocolCurrentMetrics!
    historical: ProtocolHistoricalMetrics!
  }

  type ProtocolCurrentMetrics {
    tvl: Float!
    volume24h: Float!
    transactions24h: Int!
  }

  type ProtocolHistoricalMetrics {
    volume: [HistoricalVolume!]!
  }

  type HistoricalVolume {
    timestamp: String!
    value: Float!
  }

  type ProtocolTransaction {
    signature: String!
    timestamp: String!
    type: String!
    value: Float!
    wallet: String!
  }

  type Investigation {
    id: String!
    name: String!
    wallets: [InvestigationWallet!]!
    createdAt: String!
    updatedAt: String!
  }

  type InvestigationWallet {
    address: String!
    tags: [Tag!]!
  }

  type Tag {
    id: String!
    name: String!
    createdAt: String!
  }
`