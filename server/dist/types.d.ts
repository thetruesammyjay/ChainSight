import { Pool } from 'pg';
import { Redis } from 'ioredis';
import { Connection, ParsedTransactionWithMeta, PublicKey } from '@solana/web3.js';
export interface DatabasePool extends Pool {
}
export interface RedisClient extends Redis {
}
export interface SolanaTransaction extends ParsedTransactionWithMeta {
}
export interface SolanaPublicKey extends PublicKey {
}
export interface Wallet {
    address: string;
    balance: number;
    tokens: Token[];
    transactions: Transaction[];
    nfts: NFT[];
}
export interface Token {
    mint: string;
    amount: number;
    decimals: number;
    symbol?: string;
    name?: string;
}
export interface NFT {
    mintAddress: string;
    name: string;
    image: string;
    collection: string;
    description?: string;
    attributes?: Array<{
        trait_type: string;
        value: string;
    }>;
}
export interface Transaction {
    signature: string;
    timestamp: string;
    fee: number;
    status: 'success' | 'failed';
    transfers: Transfer[];
}
export interface Transfer {
    programId: string;
    protocol?: string;
    from: string;
    to: string;
    amount: number;
    token: string;
}
export interface Protocol {
    id: string;
    name: string;
    description?: string;
    metrics: ProtocolMetrics;
}
export interface ProtocolMetrics {
    current: ProtocolCurrentMetrics;
    historical: ProtocolHistoricalMetrics;
}
export interface ProtocolCurrentMetrics {
    tvl: number;
    volume24h: number;
    transactions24h: number;
}
export interface ProtocolHistoricalMetrics {
    volume: HistoricalVolume[];
}
export interface HistoricalVolume {
    timestamp: string;
    value: number;
}
export interface Investigation {
    id: string;
    name: string;
    wallets: InvestigationWallet[];
    createdAt: string;
    updatedAt: string;
}
export interface InvestigationWallet {
    address: string;
    tags: Tag[];
}
export interface Tag {
    id: string;
    name: string;
    createdAt: string;
}
export interface GraphQLContext {
    pool: DatabasePool;
    redis: RedisClient;
    solanaConnection: Connection;
    req: Express.Request;
    res: Express.Response;
}
export interface APIResponse<T> {
    success: boolean;
    data?: T;
    error?: {
        message: string;
        code: number;
        details?: any;
    };
    timestamp: string;
}
export interface SolanaConfig {
    rpcUrl: string;
    commitment: 'processed' | 'confirmed' | 'finalized';
}
export interface ParsedInstructionInfo {
    source?: string;
    destination?: string;
    authority?: string;
    newAuthority?: string;
    amount?: string;
    lamports?: string;
    mint?: string;
}
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
