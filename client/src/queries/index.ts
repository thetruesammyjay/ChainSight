import { gql } from '@apollo/client'

export const GET_TOP_WALLETS = gql`
  query GetTopWallets($limit: Int!) {
    topWallets(limit: $limit) {
      address
      balance
      tags
      transactions {
        signature
        timestamp
      }
    }
  }
`

export const GET_WALLET_DETAILS = gql`
  query GetWalletDetails($address: String!) {
    wallet(address: $address) {
      address
      balance
      tokens {
        mint
        amount
      }
      transactions {
        signature
        timestamp
        transfers {
          from
          to
          amount
          token
        }
      }
    }
  }
`

export const GET_PROTOCOL_DETAILS = gql`
  query GetProtocolDetails($protocolId: String!) {
    protocol(id: $protocolId) {
      name
      programId
      metrics {
        current {
          tvl
          volume24h
          transactions24h
        }
        historical {
          volume {
            timestamp
            value
          }
        }
      }
      recentTransactions {
        signature
        timestamp
        type
        value
        wallet
      }
    }
  }
`

export const GET_INVESTIGATIONS = gql`
  query GetInvestigations {
    investigations {
      id
      name
      wallets {
        address
        tags
      }
      createdAt
    }
  }
`