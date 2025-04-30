"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionDetails = getTransactionDetails;
const config_1 = require("../config");
function isParsedInstruction(ix) {
    return 'parsed' in ix;
}
async function getTransactionDetails(signature) {
    const cacheKey = `tx:${signature}`;
    const cached = await config_1.redisClient.get(cacheKey);
    if (cached)
        return JSON.parse(cached);
    const tx = await config_1.solanaConnection.getParsedTransaction(signature);
    if (!tx)
        return null;
    const transfers = tx.transaction.message.instructions
        .filter(ix => ix.programId.toString() in config_1.PROTOCOL_PROGRAMS)
        .filter(isParsedInstruction)
        .map(ix => {
        const info = ix.parsed.info;
        return {
            protocol: config_1.PROTOCOL_PROGRAMS[ix.programId.toString()],
            programId: ix.programId.toString(),
            type: ix.parsed.type,
            from: (info.source || info.authority || ''),
            to: (info.destination || info.newAuthority || ''),
            amount: (info.amount || info.lamports || 0),
            token: (info.mint || 'SOL'),
        };
    });
    const result = {
        signature,
        timestamp: new Date((tx.blockTime || 0) * 1000),
        slot: tx.slot,
        success: tx.meta?.err === null,
        transfers,
        fee: tx.meta?.fee || 0,
    };
    await config_1.redisClient.set(cacheKey, JSON.stringify(result), { EX: 600 });
    return result;
}
//# sourceMappingURL=transaction.js.map