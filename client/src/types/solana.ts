import { ParsedInstruction } from '@solana/web3.js'

export interface ParsedSolanaInstruction extends ParsedInstruction {
  parsed: {
    info: {
      source?: string
      destination?: string
      amount?: string
      mint?: string
    }
    type: string
  }
}