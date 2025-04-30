"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const solana_1 = require("../services/solana");
const router = express_1.default.Router();
router.get('/wallet/:address', async (req, res) => {
    try {
        const { address } = req.params;
        const context = req.app.locals.context;
        const wallet = await solana_1.SolanaService.getWalletDetails(address, context);
        res.json(wallet);
    }
    catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
    }
});
router.get('/wallets/top', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const context = req.app.locals.context;
        const wallets = await context.pool.query(`SELECT address, balance FROM wallets 
       ORDER BY balance DESC LIMIT $1`, [limit]);
        res.json(wallets.rows);
    }
    catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
    }
});
exports.default = router;
//# sourceMappingURL=solana.js.map