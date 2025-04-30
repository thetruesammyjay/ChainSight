"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaService = void 0;
const web3_js_1 = require("@solana/web3.js");
const PROTOCOL_PROGRAMS = {
    '9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin': 'Serum',
    'EUqojwWA2rd19FZrzeBncJsm38Jm1hEhE3zsmX3bRc2o': 'Raydium',
    'SSwpkEEcbUqx4vtoEByFjSkhKdCT862DNVb52nZg1UZ': 'Saber',
    '4MangoMjqJ2firMokCjjGgoK8d4MXcrgL7XJaL3w6fVg': 'Mango Markets',
    'A7vUDErNPCTt9qrB6SSM4F6GkxzUe9d8p3Y1bJh4ECq': 'Orca'
};
class SolanaService {
    static initialize(connection) {
        this.connection = connection;
    }
    static async getWalletDetails(address, context) {
        const cacheKey = `wallet:${address}`;
        const cached = await context.redis.get(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }
        let pubkey;
        try {
            pubkey = new web3_js_1.PublicKey(address);
        }
        catch (error) {
            throw new Error(`Invalid Solana address: ${address}`);
        }
        const [balance, tokenAccounts, signatures] = await Promise.all([
            this.connection.getBalance(pubkey),
            this.connection.getParsedTokenAccountsByOwner(pubkey, {
                programId: new web3_js_1.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
            }),
            this.connection.getConfirmedSignaturesForAddress2(pubkey, { limit: 50 })
        ]);
        const transactions = await this.getTransactionDetails(signatures.map(s => s.signature), context);
        const tokens = tokenAccounts.value.map(acc => ({
            mint: acc.account.data.parsed.info.mint,
            amount: acc.account.data.parsed.info.tokenAmount.uiAmount,
            decimals: acc.account.data.parsed.info.tokenAmount.decimals,
            symbol: acc.account.data.parsed.info.tokenAmount.symbol || undefined,
            name: acc.account.data.parsed.info.tokenAmount.name || undefined
        }));
        const nfts = await this.getWalletNfts(address, context);
        const walletData = {
            address,
            balance: balance / 1e9,
            tokens,
            transactions,
            nfts
        };
        await context.redis.set(cacheKey, JSON.stringify(walletData), 'EX', 300);
        return walletData;
    }
    static async getTransactionDetails(signatures, context) {
        const cachedTxs = await Promise.all(signatures.map(sig => context.redis.get(`tx:${sig}`)));
        const missingSigs = signatures.filter((_, i) => !cachedTxs[i]);
        const freshTxs = await Promise.all(missingSigs.map(sig => this.connection.getParsedTransaction(sig)));
        const transactions = await Promise.all(signatures.map(async (sig, i) => {
            if (cachedTxs[i]) {
                return JSON.parse(cachedTxs[i]);
            }
            const tx = freshTxs.find(t => t?.transaction.signatures.includes(sig));
            if (!tx)
                return null;
            const parsedTx = this.parseTransaction(tx);
            await context.redis.set(`tx:${sig}`, JSON.stringify(parsedTx), 'EX', 600);
            return parsedTx;
        }));
        return transactions.filter(Boolean);
    }
    static parseTransaction(tx) {
        const transfers = tx.transaction.message.instructions
            .filter(this.isParsedInstruction)
            .filter(ix => ix.programId.toString() in PROTOCOL_PROGRAMS)
            .map(ix => ({
            programId: ix.programId.toString(),
            protocol: PROTOCOL_PROGRAMS[ix.programId.toString()],
            from: ix.parsed.info.source || ix.parsed.info.authority,
            to: ix.parsed.info.destination || ix.parsed.info.newAuthority,
            amount: Number(ix.parsed.info.amount || ix.parsed.info.lamports),
            token: ix.parsed.info.mint || 'SOL'
        }));
        return {
            signature: tx.transaction.signatures[0],
            timestamp: new Date((tx.blockTime || 0) * 1000).toISOString(),
            fee: tx.meta?.fee || 0,
            status: tx.meta?.err ? 'failed' : 'success',
            transfers
        };
    }
    static async getWalletNfts(address, context) {
        const cacheKey = `nfts:${address}`;
        const cached = await context.redis.get(cacheKey);
        if (cached)
            return JSON.parse(cached);
        const mockNfts = [
            {
                mintAddress: `${address}-nft1`,
                name: 'ChainSight Demo NFT',
                image: 'https://placehold.co/400x400?text=Solana+NFT',
                collection: 'ChainSight Collection'
            }
        ];
        await context.redis.set(cacheKey, JSON.stringify(mockNfts), 'EX', 3600);
        return mockNfts;
    }
    static isParsedInstruction(ix) {
        return ix?.parsed?.info !== undefined;
    }
}
exports.SolanaService = SolanaService;
//# sourceMappingURL=solana.js.map