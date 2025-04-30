import { GraphQLContext, Wallet, Protocol, Investigation, Transaction, NFT } from './types';
interface ProtocolTransaction {
    signature: string;
    timestamp: string;
    type: string;
    value: number;
    wallet: string;
}
export declare const resolvers: {
    Query: {
        wallet: (_: unknown, { address }: {
            address: string;
        }, context: GraphQLContext) => Promise<Wallet>;
        topWallets: (_: unknown, { limit }: {
            limit?: number;
        }, { pool }: GraphQLContext) => Promise<Wallet[]>;
        protocol: (_: unknown, { id }: {
            id: string;
        }, context: GraphQLContext) => Promise<Protocol>;
        protocolMetrics: (_: unknown, __: unknown, context: GraphQLContext) => Promise<Protocol[]>;
        investigations: (_: unknown, __: unknown, { pool }: GraphQLContext) => Promise<Investigation[]>;
        investigation: (_: unknown, { id }: {
            id: string;
        }, { pool }: GraphQLContext) => Promise<Investigation | null>;
    };
    Mutation: {
        createInvestigation: (_: unknown, { name }: {
            name: string;
        }, { pool }: GraphQLContext) => Promise<Investigation>;
        updateInvestigation: (_: unknown, { id, name }: {
            id: string;
            name?: string;
        }, { pool }: GraphQLContext) => Promise<Investigation>;
        deleteInvestigation: (_: unknown, { id }: {
            id: string;
        }, { pool }: GraphQLContext) => Promise<boolean>;
        addWalletToInvestigation: (_: unknown, { investigationId, address }: {
            investigationId: string;
            address: string;
        }, { pool }: GraphQLContext) => Promise<Investigation>;
    };
    Wallet: {
        transactions: (wallet: Wallet, { limit }: {
            limit?: number;
        }, context: GraphQLContext) => Promise<Transaction[]>;
        nfts: (wallet: Wallet, _: unknown, context: GraphQLContext) => Promise<NFT[]>;
    };
    Protocol: {
        recentTransactions: (protocol: Protocol, { limit }: {
            limit?: number;
        }, context: GraphQLContext) => Promise<ProtocolTransaction[]>;
    };
};
export {};
