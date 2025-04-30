"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvestigatorService = void 0;
class InvestigatorService {
    static async getInvestigations(context) {
        const { rows } = await context.pool.query(`SELECT 
        i.id,
        i.name,
        i.created_at as "createdAt",
        i.updated_at as "updatedAt",
        COALESCE(
          json_agg(
            json_build_object(
              'address', iw.wallet_address,
              'tags', iw.tags
            )
          ) FILTER (WHERE iw.wallet_address IS NOT NULL),
          '[]'
        ) as wallets
       FROM investigations i
       LEFT JOIN investigation_wallets iw ON i.id = iw.investigation_id
       GROUP BY i.id`);
        return rows;
    }
    static async getInvestigation(id, context) {
        const { rows } = await context.pool.query(`SELECT 
        i.id,
        i.name,
        i.created_at as "createdAt",
        i.updated_at as "updatedAt",
        COALESCE(
          json_agg(
            json_build_object(
              'address', iw.wallet_address,
              'tags', iw.tags
            )
          ) FILTER (WHERE iw.wallet_address IS NOT NULL),
          '[]'
        ) as wallets
       FROM investigations i
       LEFT JOIN investigation_wallets iw ON i.id = iw.investigation_id
       WHERE i.id = $1
       GROUP BY i.id`, [id]);
        return rows[0] || null;
    }
    static async addWalletTags(investigationId, walletAddress, tags, context) {
        const { rows } = await context.pool.query(`UPDATE investigation_wallets
       SET tags = $3
       WHERE investigation_id = $1 AND wallet_address = $2
       RETURNING wallet_address as "address", tags`, [investigationId, walletAddress, tags]);
        return rows[0];
    }
}
exports.InvestigatorService = InvestigatorService;
//# sourceMappingURL=investigatorService.js.map