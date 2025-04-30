"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtocolService = void 0;
class ProtocolService {
    static async getProtocolDetails(protocolId, context) {
        const { rows } = await context.pool.query(`SELECT 
        id,
        name,
        description,
        created_at as "createdAt"
       FROM protocols
       WHERE id = $1`, [protocolId]);
        if (!rows.length) {
            throw new Error(`Protocol ${protocolId} not found`);
        }
        const protocol = rows[0];
        const metrics = await this.getProtocolMetrics(context);
        const transactions = await this.getProtocolTransactions(protocolId, context);
        return {
            ...protocol,
            metrics: metrics.find(m => m.id === protocolId)?.metrics || {
                current: { tvl: 0, volume24h: 0, transactions24h: 0 },
                historical: { volume: [] }
            }
        };
    }
    static async getProtocolMetrics(context) {
        const { rows } = await context.pool.query(`SELECT 
        p.id,
        COALESCE(SUM(w.balance), 0) as tvl,
        COUNT(t.id) as transactions24h,
        COALESCE(SUM(t.amount), 0) as volume24h
       FROM protocols p
       LEFT JOIN protocol_wallets pw ON p.id = pw.protocol_id
       LEFT JOIN wallets w ON pw.wallet_address = w.address
       LEFT JOIN transactions t ON p.id = t.protocol_id 
         AND t.timestamp > NOW() - INTERVAL '24 hours'
       GROUP BY p.id`);
        const results = [];
        for (const row of rows) {
            results.push({
                id: row.id,
                metrics: {
                    current: {
                        tvl: row.tvl,
                        volume24h: row.volume24h,
                        transactions24h: row.transactions24h
                    },
                    historical: await this.getHistoricalVolume(row.id, context)
                }
            });
        }
        return results;
    }
    static async getHistoricalVolume(protocolId, { pool }) {
        const { rows } = await pool.query(`SELECT 
        date_trunc('day', timestamp) as timestamp,
        SUM(amount) as value
       FROM transactions
       WHERE protocol_id = $1
         AND timestamp > NOW() - INTERVAL '30 days'
       GROUP BY date_trunc('day', timestamp)
       ORDER BY timestamp`, [protocolId]);
        return { volume: rows };
    }
    static async getProtocolTransactions(protocolId, { pool }) {
        const { rows } = await pool.query(`SELECT 
        signature,
        timestamp,
        type,
        amount as value,
        sender as wallet
       FROM transactions
       WHERE protocol_id = $1
       ORDER BY timestamp DESC
       LIMIT 100`, [protocolId]);
        return rows;
    }
}
exports.ProtocolService = ProtocolService;
//# sourceMappingURL=protocolService.js.map