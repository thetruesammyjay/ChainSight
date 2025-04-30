export interface ProtocolMetrics {
    name: string;
    tvl: number;
    volume24h: number;
    transactions24h: number;
    uniqueUsers: number;
}
export interface ProtocolDetail {
    name: string;
    programId: string;
    description?: string;
    website?: string;
    metrics: {
        current: ProtocolMetrics;
        historical: {
            tvl: {
                timestamp: Date;
                value: number;
            }[];
            volume: {
                timestamp: Date;
                value: number;
            }[];
        };
    };
}
