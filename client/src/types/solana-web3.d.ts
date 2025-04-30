declare module '@solana/web3.js' {
  export class PublicKey {
    constructor(value: string | Uint8Array | number[] | Buffer);
    static findProgramAddressSync(
      seeds: (Buffer | Uint8Array)[],
      programId: PublicKey
    ): [PublicKey, number];
    equals(publicKey: PublicKey): boolean;
    toBase58(): string;
    toBuffer(): Buffer;
    toString(): string;
  }

  export class Connection {
    constructor(endpoint: string, commitment: string);
    getBalance(publicKey: PublicKey): Promise<number>;
    getParsedTokenAccountsByOwner(
      owner: PublicKey,
      filter: { programId: PublicKey } | { mint: PublicKey },
      options?: any
    ): Promise<{
      value: Array<{
        pubkey: PublicKey;
        account: {
          executable: boolean;
          owner: PublicKey;
          lamports: number;
          data: {
            parsed: {
              info: {
                mint: string;
                owner: string;
                tokenAmount: {
                  amount: string;
                  decimals: number;
                  uiAmount: number;
                  uiAmountString: string;
                };
                [key: string]: any;
              };
              type: string;
            };
            program: string;
            space: number;
          };
        };
      }>;
    }>;
    getConfirmedSignaturesForAddress2(
      address: PublicKey,
      options?: { limit?: number; before?: string; until?: string }
    ): Promise<Array<{ signature: string; slot: number; err: any; memo: string | null; blockTime?: number | null }>>;
    getParsedTransaction(
      signature: string,
      commitment?: string
    ): Promise<ParsedTransactionWithMeta | null>;
    getAccountInfo(
      publicKey: PublicKey,
      commitment?: string
    ): Promise<{
      executable: boolean;
      owner: PublicKey;
      lamports: number;
      data: Buffer;
      rentEpoch?: number;
    } | null>;
  }

  export interface ParsedTransactionWithMeta {
    transaction: {
      signatures: string[];
      message: {
        instructions: any[];
        accountKeys: any[];
        recentBlockhash: string;
      };
    };
    meta: {
      err: any;
      fee: number;
      preBalances: number[];
      postBalances: number[];
      logMessages?: string[];
    } | null;
    blockTime?: number | null;
  }

  export interface ParsedInstruction {
    programId: PublicKey;
    parsed: {
      type: string;
      info: {
        source?: string;
        destination?: string;
        authority?: string;
        newAuthority?: string;
        amount?: string;
        lamports?: number;
        mint?: string;
        [key: string]: any;
      };
    };
  }

  export class Keypair {
    constructor();
    static generate(): Keypair;
    static fromSecretKey(secretKey: Uint8Array): Keypair;
    publicKey: PublicKey;
    secretKey: Uint8Array;
  }

  export interface BlockhashWithExpiryBlockHeight {
    blockhash: string;
    lastValidBlockHeight: number;
  }

  export class Transaction {
    constructor();
    add(...instructions: any[]): Transaction;
    sign(...signers: Keypair[]): void;
    serialize(): Buffer;
  }

  export class SystemProgram {
    static programId: PublicKey;
    static transfer(params: {
      fromPubkey: PublicKey;
      toPubkey: PublicKey;
      lamports: number;
    }): any;
  }

  export type Commitment = 'processed' | 'confirmed' | 'finalized';

  export type TransactionSignature = string;
}