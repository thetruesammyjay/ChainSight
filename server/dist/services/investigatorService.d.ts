import { GraphQLContext, Investigation, InvestigationWallet } from '../types';
export declare class InvestigatorService {
    static getInvestigations(context: GraphQLContext): Promise<Investigation[]>;
    static getInvestigation(id: string, context: GraphQLContext): Promise<Investigation | null>;
    static addWalletTags(investigationId: string, walletAddress: string, tags: string[], context: GraphQLContext): Promise<InvestigationWallet>;
}
