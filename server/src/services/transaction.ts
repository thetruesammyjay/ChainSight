import { solanaConnection, redisClient, PROTOCOL_PROGRAMS } from '../config';
import { ParsedInstruction, PartiallyDecodedInstruction } from '@solana/web3.js';


function isParsedInstruction(ix: ParsedInstruction | PartiallyDecodedInstruction): ix is ParsedInstruction {
  return 'parsed' in ix;
}

export async function getTransactionDetails(signature: string) {
  const cacheKey = `tx:${signature}`;
  const cached = await redisClient.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const tx = await solanaConnection.getParsedTransaction(signature);
  if (!tx) return null;

  const transfers = tx.transaction.message.instructions
    .filter(ix => ix.programId.toString() in PROTOCOL_PROGRAMS)
    .filter(isParsedInstruction)
    .map(ix => {
      const info = ix.parsed.info;
      return {
        protocol: PROTOCOL_PROGRAMS[ix.programId.toString()],
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

  await redisClient.set(cacheKey, JSON.stringify(result), { EX: 600 });
  return result;
}