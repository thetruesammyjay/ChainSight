"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWalletData = getWalletData;
const web3_js_1 = require("@solana/web3.js");
const config_1 = require("../config");
async function getWalletData(address) {
    const cacheKey = `wallet:${address}`;
    const cached = await config_1.redisClient.get(cacheKey);
    if (cached)
        return JSON.parse(cached);
    if (!web3_js_1.PublicKey.isOnCurve(address)) {
        throw new Error('Invalid Solana address');
    }
    const pubkey = new web3_js_1.PublicKey(address);
    const [balance, tokenAccounts, transactions] = await Promise.all([
        config_1.solanaConnection.getBalance(pubkey),
        config_1.solanaConnection.getParsedTokenAccountsByOwner(pubkey, {
            programId: new web3_js_1.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
        }),
        config_1.solanaConnection.getConfirmedSignaturesForAddress2(pubkey, { limit: 50 }),
    ]);
    await config_1.pool.query(`INSERT INTO wallets (address, last_updated) 
     VALUES ($1, NOW()) 
     ON CONFLICT (address) DO UPDATE SET last_updated = NOW()`, [address]);
    const data = {
        address,
        balance: balance / 1e9,
        tokens: tokenAccounts.value.map(acc => ({
            mint: acc.account.data.parsed.info.mint,
            amount: acc.account.data.parsed.info.tokenAmount.uiAmount,
        })),
        transactions: await Promise.all(transactions.map(async (tx) => ({
            signature: tx.signature,
            blockTime: tx.blockTime,
            status: tx.confirmationStatus,
        }))),
    };
    await config_1.redisClient.set(cacheKey, JSON.stringify(data), { EX: 300 });
    return data;
}
//# sourceMappingURL=wallet.js.map