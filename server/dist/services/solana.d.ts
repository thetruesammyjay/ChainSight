import { Connection } from '@solana/web3.js';
import { GraphQLContext, Wallet, Transaction, NFT } from '../types';
export declare class SolanaService {
    private static connection;
    static initialize(connection: Connection): void;
    static getWalletDetails(address: string, context: GraphQLContext): Promise<Wallet>;
    static getTransactionDetails(signatures: string[], context: GraphQLContext): Promise<Transaction[]>;
    private static parseTransaction;
    static getWalletNfts(address: string, context: GraphQLContext): Promise<NFT[]>;
    private static isParsedInstruction;
}
