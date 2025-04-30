"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROTOCOL_PROGRAMS = exports.pool = exports.redisClient = exports.solanaConnection = exports.config = void 0;
const web3_js_1 = require("@solana/web3.js");
const redis_1 = __importDefault(require("redis"));
const pg_1 = __importDefault(require("pg"));
exports.config = {
    solana: {
        rpcEndpoint: process.env.SOLANA_RPC || (0, web3_js_1.clusterApiUrl)('mainnet-beta'),
        quicknodeKey: process.env.QUICKNODE_KEY,
    },
    server: {
        port: parseInt(process.env.PORT || '4000'),
        corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
    },
    database: {
        url: process.env.PG_URL || 'postgres://postgres:postgres@localhost:5432/chainsight',
    },
    redis: {
        url: process.env.REDIS_URL || 'redis://localhost:6379',
    },
};
exports.solanaConnection = new web3_js_1.Connection(exports.config.solana.quicknodeKey
    ? `${exports.config.solana.rpcEndpoint}?apiKey=${exports.config.solana.quicknodeKey}`
    : exports.config.solana.rpcEndpoint, { commitment: 'confirmed' });
exports.redisClient = redis_1.default.createClient({ url: exports.config.redis.url });
exports.redisClient.connect().catch(console.error);
exports.pool = new pg_1.default.Pool({
    connectionString: exports.config.database.url,
    max: 20,
    idleTimeoutMillis: 30000,
});
exports.PROTOCOL_PROGRAMS = {
    '9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin': 'Serum',
    'EUqojwWA2rd19FZrzeBncJsm38Jm1hEhE3zsmX3bRc2o': 'Raydium',
    'SSwpkEEcbUqx4vtoEByFjSkhKdCT862DNVb52nZg1UZ': 'Saber',
};
//# sourceMappingURL=config.js.map