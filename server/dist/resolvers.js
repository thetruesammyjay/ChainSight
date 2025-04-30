"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const solana_1 = require("./services/solana");
const protocolService_1 = require("./services/protocolService");
exports.resolvers = {
    Query: {
        wallet: async (_, { address }, context) => {
            return await solana_1.SolanaService.getWalletDetails(address, context);
        },
        topWallets: async (_, { limit = 10 }, { pool }) => {
            const { rows } = await pool.query(`SELECT address, balance FROM wallets 
         ORDER BY balance DESC LIMIT $1`, [limit]);
            return rows;
        },
        protocol: async (_, { id }, context) => {
            return await protocolService_1.ProtocolService.getProtocolDetails(id, context);
        },
        protocolMetrics: async (_, __, context) => {
            const metricsData = await protocolService_1.ProtocolService.getProtocolMetrics(context);
            const protocolIds = metricsData.map(item => item.id);
            const { rows } = await context.pool.query(`SELECT id, name, description FROM protocols WHERE id = ANY($1)`, [protocolIds]);
            return metricsData.map(item => {
                const protocolInfo = rows.find(row => row.id === item.id);
                return {
                    id: item.id,
                    name: protocolInfo?.name || 'Unknown Protocol',
                    description: protocolInfo?.description,
                    metrics: item.metrics
                };
            });
        },
        investigations: async (_, __, { pool }) => {
            const { rows } = await pool.query('SELECT * FROM investigations ORDER BY created_at DESC');
            return rows;
        },
        investigation: async (_, { id }, { pool }) => {
            const { rows } = await pool.query('SELECT * FROM investigations WHERE id = $1', [id]);
            return rows[0] || null;
        }
    },
    Mutation: {
        createInvestigation: async (_, { name }, { pool }) => {
            const { rows } = await pool.query(`INSERT INTO investigations (id, name, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, NOW(), NOW())
         RETURNING *`, [name]);
            return rows[0];
        },
        updateInvestigation: async (_, { id, name }, { pool }) => {
            const { rows } = await pool.query(`UPDATE investigations 
         SET name = COALESCE($2, name), updated_at = NOW()
         WHERE id = $1
         RETURNING *`, [id, name]);
            return rows[0];
        },
        deleteInvestigation: async (_, { id }, { pool }) => {
            await pool.query('DELETE FROM investigations WHERE id = $1', [id]);
            return true;
        },
        addWalletToInvestigation: async (_, { investigationId, address }, { pool }) => {
            await pool.query(`INSERT INTO wallets (address) VALUES ($1)
         ON CONFLICT (address) DO NOTHING`, [address]);
            await pool.query(`INSERT INTO investigation_wallets (investigation_id, wallet_address)
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING`, [investigationId, address]);
            const { rows } = await pool.query('SELECT * FROM investigations WHERE id = $1', [investigationId]);
            return rows[0];
        }
    },
    Wallet: {
        transactions: async (wallet, { limit = 25 }, context) => {
            const walletDetails = await solana_1.SolanaService.getWalletDetails(wallet.address, context);
            return walletDetails.transactions.slice(0, limit);
        },
        nfts: async (wallet, _, context) => {
            return await solana_1.SolanaService.getWalletNfts(wallet.address, context);
        }
    },
    Protocol: {
        recentTransactions: async (protocol, { limit = 25 }, context) => {
            return await protocolService_1.ProtocolService.getProtocolTransactions(protocol.id, context);
        }
    }
};
//# sourceMappingURL=resolvers.js.map