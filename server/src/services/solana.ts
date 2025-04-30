import { Connection, PublicKey, ParsedTransactionWithMeta, ParsedInstruction } from '@solana/web3.js'
import { GraphQLContext, Wallet, Token, Transaction, Transfer, NFT } from '../types'

// Known protocol program IDs
const PROTOCOL_PROGRAMS: Record<string, string> = {
  '9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin': 'Serum',
  'EUqojwWA2rd19FZrzeBncJsm38Jm1hEhE3zsmX3bRc2o': 'Raydium',
  'SSwpkEEcbUqx4vtoEByFjSkhKdCT862DNVb52nZg1UZ': 'Saber',
  '4MangoMjqJ2firMokCjjGgoK8d4MXcrgL7XJaL3w6fVg': 'Mango Markets',
  'A7vUDErNPCTt9qrB6SSM4F6GkxzUe9d8p3Y1bJh4ECq': 'Orca'
}

export class SolanaService {
  private static connection: Connection

  static initialize(connection: Connection) {
    this.connection = connection
  }

  static async getWalletDetails(
    address: string,
    context: GraphQLContext
  ): Promise<Wallet> {
    const cacheKey = `wallet:${address}`
    
    // Try cache first
    const cached = await context.redis.get(cacheKey)
    if (cached) {
      return JSON.parse(cached)
    }

    // Validate address
    let pubkey: PublicKey
    try {
      pubkey = new PublicKey(address)
    } catch (error) {
      throw new Error(`Invalid Solana address: ${address}`)
    }

    // Parallel fetching
    const [balance, tokenAccounts, signatures] = await Promise.all([
      this.connection.getBalance(pubkey),
      this.connection.getParsedTokenAccountsByOwner(pubkey, {
        programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
      }),
      this.connection.getConfirmedSignaturesForAddress2(pubkey, { limit: 50 })
    ])

    // Process data
    const transactions = await this.getTransactionDetails(
      signatures.map(s => s.signature),
      context
    )

    const tokens: Token[] = tokenAccounts.value.map(acc => ({
      mint: acc.account.data.parsed.info.mint,
      amount: acc.account.data.parsed.info.tokenAmount.uiAmount,
      decimals: acc.account.data.parsed.info.tokenAmount.decimals,
      symbol: acc.account.data.parsed.info.tokenAmount.symbol || undefined,
      name: acc.account.data.parsed.info.tokenAmount.name || undefined
    }))

    const nfts = await this.getWalletNfts(address, context)

    const walletData: Wallet = {
      address,
      balance: balance / 1e9, // Convert lamports to SOL
      tokens,
      transactions,
      nfts
    }

    // Cache for 5 minutes
    await context.redis.set(cacheKey, JSON.stringify(walletData), 'EX', 300)
    return walletData
  }

  static async getTransactionDetails(
    signatures: string[],
    context: GraphQLContext
  ): Promise<Transaction[]> {
    // Check cache first
    const cachedTxs = await Promise.all(
      signatures.map(sig => context.redis.get(`tx:${sig}`))
    )

    // Find missing transactions
    const missingSigs = signatures.filter((_, i) => !cachedTxs[i])
    const freshTxs = await Promise.all(
      missingSigs.map(sig => this.connection.getParsedTransaction(sig))
    )

    // Process transactions
    const transactions: Transaction[] = await Promise.all(
      signatures.map(async (sig, i) => {
        if (cachedTxs[i]) {
          return JSON.parse(cachedTxs[i]!)
        }

        const tx = freshTxs.find(t => t?.transaction.signatures.includes(sig))
        if (!tx) return null

        const parsedTx = this.parseTransaction(tx)
        await context.redis.set(`tx:${sig}`, JSON.stringify(parsedTx), 'EX', 600)
        return parsedTx
      })
    )

    return transactions.filter(Boolean) as Transaction[]
  }

  private static parseTransaction(tx: ParsedTransactionWithMeta): Transaction {
    const transfers: Transfer[] = tx.transaction.message.instructions
      .filter(this.isParsedInstruction)
      .filter(ix => ix.programId.toString() in PROTOCOL_PROGRAMS)
      .map(ix => ({
        programId: ix.programId.toString(),
        protocol: PROTOCOL_PROGRAMS[ix.programId.toString()],
        from: ix.parsed.info.source || ix.parsed.info.authority,
        to: ix.parsed.info.destination || ix.parsed.info.newAuthority,
        amount: Number(ix.parsed.info.amount || ix.parsed.info.lamports),
        token: ix.parsed.info.mint || 'SOL'
      }))

    return {
      signature: tx.transaction.signatures[0],
      timestamp: new Date((tx.blockTime || 0) * 1000).toISOString(),
      fee: tx.meta?.fee || 0,
      status: tx.meta?.err ? 'failed' : 'success',
      transfers
    }
  }

  static async getWalletNfts(
    address: string,
    context: GraphQLContext
  ): Promise<NFT[]> {
    const cacheKey = `nfts:${address}`
    const cached = await context.redis.get(cacheKey)
    if (cached) return JSON.parse(cached)

    // In production, replace with real NFT indexing logic
    const mockNfts: NFT[] = [
      {
        mintAddress: `${address}-nft1`,
        name: 'ChainSight Demo NFT',
        image: 'https://placehold.co/400x400?text=Solana+NFT',
        collection: 'ChainSight Collection'
      }
    ]

    await context.redis.set(cacheKey, JSON.stringify(mockNfts), 'EX', 3600)
    return mockNfts
  }

  private static isParsedInstruction(ix: any): ix is ParsedInstruction & { parsed: any } {
    return ix?.parsed?.info !== undefined
  }
}