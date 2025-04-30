"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const apollo_server_express_1 = require("apollo-server-express");
const schema_1 = require("./schema");
const resolvers_1 = require("./resolvers");
const config_1 = require("./config");
const cors_1 = __importDefault(require("cors"));
const solana_1 = __importDefault(require("./api/solana"));
const protocols_1 = __importDefault(require("./api/protocols"));
const serverConfig = {
    port: parseInt(process.env.PORT || '4000'),
    corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000']
};
async function startServer() {
    try {
        await config_1.redisClient.connect();
        await config_1.pool.query('SELECT 1');
        const app = (0, express_1.default)();
        app.use((0, cors_1.default)({ origin: serverConfig.corsOrigins }));
        app.use(express_1.default.json());
        app.use('/api/solana', solana_1.default);
        app.use('/api/protocols', protocols_1.default);
        const apolloServer = new apollo_server_express_1.ApolloServer({
            typeDefs: schema_1.typeDefs,
            resolvers: resolvers_1.resolvers,
            context: ({ req }) => ({ req }),
        });
        await apolloServer.start();
        apolloServer.applyMiddleware({
            app,
            path: '/graphql',
            cors: {
                origin: serverConfig.corsOrigins,
                credentials: true
            }
        });
        const server = (0, http_1.createServer)(app);
        server.listen(serverConfig.port, () => {
            console.log(`Server running on http://localhost:${serverConfig.port}`);
            console.log(`GraphQL ready at http://localhost:${serverConfig.port}/graphql`);
        });
        process.on('SIGTERM', async () => {
            await config_1.redisClient.quit();
            await config_1.pool.end();
            server.close();
        });
    }
    catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
}
startServer();
//# sourceMappingURL=index.js.map