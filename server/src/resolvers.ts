import { GraphQLResolveInfo } from 'graphql'
import { SolanaService } from './services/solana'
import { ProtocolService } from './services/protocolService'
import { InvestigatorService } from './services/investigatorService'
import { 
  GraphQLContext, 
  Wallet, 
  Protocol, 
  Investigation,
  Transaction,
  NFT
} from './types'

interface ProtocolTransaction {
  signature: string;
  timestamp: string;
  type: string;
  value: number;
  wallet: string;
}

export const resolvers = {
  Query: {
    // Wallet Resolvers
    wallet: async (
      _: unknown,
      { address }: { address: string },
      context: GraphQLContext
    ): Promise<Wallet> => {
      return await SolanaService.getWalletDetails(address, context)
    },

    topWallets: async (
      _: unknown,
      { limit = 10 }: { limit?: number },
      { pool }: GraphQLContext
    ): Promise<Wallet[]> => {
      const { rows } = await pool.query<Wallet>(
        `SELECT address, balance FROM wallets 
         ORDER BY balance DESC LIMIT $1`,
        [limit]
      )
      return rows
    },

    // Protocol Resolvers
    protocol: async (
      _: unknown,
      { id }: { id: string },
      context: GraphQLContext
    ): Promise<Protocol> => {
      return await ProtocolService.getProtocolDetails(id, context)
    },

    protocolMetrics: async (
      _: unknown,
      __: unknown,
      context: GraphQLContext
    ): Promise<Protocol[]> => {
      // First get the metrics data
      const metricsData = await ProtocolService.getProtocolMetrics(context);
      
      // Then fetch the protocol names and descriptions
      const protocolIds = metricsData.map(item => item.id);
      const { rows } = await context.pool.query<{id: string, name: string, description?: string}>(
        `SELECT id, name, description FROM protocols WHERE id = ANY($1)`,
        [protocolIds]
      );
      
      // Combine the data
      return metricsData.map(item => {
        const protocolInfo = rows.find(row => row.id === item.id);
        return {
          id: item.id,
          name: protocolInfo?.name || 'Unknown Protocol',
          description: protocolInfo?.description,
          metrics: item.metrics
        } as Protocol;
      });
    },

    // Investigation Resolvers
    investigations: async (
      _: unknown,
      __: unknown,
      { pool }: GraphQLContext
    ): Promise<Investigation[]> => {
      const { rows } = await pool.query<Investigation>(
        'SELECT * FROM investigations ORDER BY created_at DESC'
      )
      return rows
    },

    investigation: async (
      _: unknown,
      { id }: { id: string },
      { pool }: GraphQLContext
    ): Promise<Investigation | null> => {
      const { rows } = await pool.query<Investigation>(
        'SELECT * FROM investigations WHERE id = $1',
        [id]
      )
      return rows[0] || null
    }
  },

  Mutation: {
    createInvestigation: async (
      _: unknown,
      { name }: { name: string },
      { pool }: GraphQLContext
    ): Promise<Investigation> => {
      const { rows } = await pool.query<Investigation>(
        `INSERT INTO investigations (id, name, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, NOW(), NOW())
         RETURNING *`,
        [name]
      )
      return rows[0]
    },

    updateInvestigation: async (
      _: unknown,
      { id, name }: { id: string; name?: string },
      { pool }: GraphQLContext
    ): Promise<Investigation> => {
      const { rows } = await pool.query<Investigation>(
        `UPDATE investigations 
         SET name = COALESCE($2, name), updated_at = NOW()
         WHERE id = $1
         RETURNING *`,
        [id, name]
      )
      return rows[0]
    },

    deleteInvestigation: async (
      _: unknown,
      { id }: { id: string },
      { pool }: GraphQLContext
    ): Promise<boolean> => {
      await pool.query('DELETE FROM investigations WHERE id = $1', [id])
      return true
    },

    addWalletToInvestigation: async (
      _: unknown,
      { investigationId, address }: { investigationId: string; address: string },
      { pool }: GraphQLContext
    ): Promise<Investigation> => {
      // First ensure wallet exists
      await pool.query(
        `INSERT INTO wallets (address) VALUES ($1)
         ON CONFLICT (address) DO NOTHING`,
        [address]
      )

      // Add to investigation
      await pool.query(
        `INSERT INTO investigation_wallets (investigation_id, wallet_address)
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [investigationId, address]
      )

      // Return updated investigation
      const { rows } = await pool.query<Investigation>(
        'SELECT * FROM investigations WHERE id = $1',
        [investigationId]
      )
      return rows[0]
    }
  },

  // Field Resolvers
  Wallet: {
    transactions: async (
      wallet: Wallet,
      { limit = 25 }: { limit?: number },
      context: GraphQLContext
    ): Promise<Transaction[]> => {
      const walletDetails = await SolanaService.getWalletDetails(wallet.address, context);
      return walletDetails.transactions.slice(0, limit);
    },
    nfts: async (
      wallet: Wallet,
      _: unknown,
      context: GraphQLContext
    ): Promise<NFT[]> => {
      return await SolanaService.getWalletNfts(wallet.address, context)
    }
  },

  Protocol: {
    recentTransactions: async (
      protocol: Protocol,
      { limit = 25 }: { limit?: number },
      context: GraphQLContext
    ): Promise<ProtocolTransaction[]> => {
      // Use the ProtocolService to get transactions
      return await ProtocolService.getProtocolTransactions(protocol.id, context);
    }
  }
}