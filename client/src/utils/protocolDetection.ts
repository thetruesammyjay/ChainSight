import { PublicKey } from '@solana/web3.js'

// Known Solana program IDs
const PROTOCOL_PROGRAM_IDS: Record<string, string> = {
  '9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin': 'Serum',
  'EUqojwWA2rd19FZrzeBncJsm38Jm1hEhE3zsmX3bRc2o': 'Raydium',
  'SSwpkEEcbUqx4vtoEByFjSkhKdCT862DNVb52nZg1UZ': 'Saber',
  '4MangoMjqJ2firMokCjjGgoK8d4MXcrgL7XJaL3w6fVg': 'Mango Markets',
  'A7vUDErNPCTt9qrB6SSM4F6GkxzUe9d8p3Y1bJh4ECq': 'Orca',
  '9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP': 'Step Finance',
}

// Protocol metadata cache
const protocolMetadataCache = new Map<string, any>()

export function detectProtocol(programId: string): string | null {
  // Check known protocols first
  if (PROTOCOL_PROGRAM_IDS[programId]) {
    return PROTOCOL_PROGRAM_IDS[programId]
  }

  // Check cache
  if (protocolMetadataCache.has(programId)) {
    return protocolMetadataCache.get(programId).name || null
  }

  return null
}

export async function fetchProtocolMetadata(programId: string): Promise<{ name: string | null }> {
  try {
    // In a real implementation, this would fetch from on-chain data or API
    const publicKey = new PublicKey(programId)
    const name = `Unknown Protocol (${publicKey.toBase58().slice(0, 4)}...)`
    
    // Cache the result
    protocolMetadataCache.set(programId, { name })
    
    return { name }
  } catch (error) {
    console.error('Failed to fetch protocol metadata:', error)
    return { name: null }
  }
}

export function getProtocolInteractions(
  transactions: any[],
  protocolId: string
): any[] {
  return transactions.filter(tx => 
    tx.instructions.some((ix: any) => ix.programId === protocolId)
)}

export function analyzeProtocolActivity(
  protocolId: string,
  transactions: any[]
): {
  volume: number
  transactionsCount: number
  uniqueUsers: number
} {
  const interactions = getProtocolInteractions(transactions, protocolId)
  const users = new Set<string>()

  let totalVolume = 0

  interactions.forEach(tx => {
    tx.instructions.forEach((ix: any) => {
      if (ix.programId === protocolId) {
        if (ix.parsed?.info?.amount) {
          totalVolume += Number(ix.parsed.info.amount)
        }
        if (ix.parsed?.info?.source) {
          users.add(ix.parsed.info.source)
        }
      }
    })
  })

  return {
    volume: totalVolume,
    transactionsCount: interactions.length,
    uniqueUsers: users.size,
  }
}