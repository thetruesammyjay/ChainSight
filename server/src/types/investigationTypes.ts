export interface Investigation {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  wallets: string[];
  tags: Record<string, string>;
  transactionFilters: {
    fromDate?: Date;
    toDate?: Date;
    minAmount?: number;
    protocols?: string[];
  };
  notes?: string;
}