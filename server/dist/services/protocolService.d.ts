import { GraphQLContext, Protocol, ProtocolMetrics } from '../types';
export interface ProtocolTransaction {
    signature: string;
    timestamp: string;
    type: string;
    value: number;
    wallet: string;
}
export declare class ProtocolService {
    static getProtocolDetails(protocolId: string, context: GraphQLContext): Promise<Protocol>;
    static getProtocolMetrics(context: GraphQLContext): Promise<Array<{
        id: string;
        metrics: ProtocolMetrics;
    }>>;
    private static getHistoricalVolume;
    static getProtocolTransactions(protocolId: string, { pool }: GraphQLContext): Promise<ProtocolTransaction[]>;
}
