import express from 'express';
import { createServer } from 'http';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { config, solanaConnection, redisClient, pool } from './config';
import cors from 'cors';
import solanaRouter from './api/solana';
import protocolRouter from './api/protocols';

interface ServerConfig {
  port: number;
  corsOrigins: string[];
}

const serverConfig: ServerConfig = {
  port: parseInt(process.env.PORT || '4000'),
  corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
};

async function startServer() {
  try {
    // ✅ Connect Redis only if not already open
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }

    // ✅ Verify DB connection
    await pool.query('SELECT 1');

    const app = express();

    // Middleware
    app.use(cors({ origin: serverConfig.corsOrigins }));
    app.use(express.json());

    // REST Routes
    app.use('/api/solana', solanaRouter);
    app.use('/api/protocols', protocolRouter);

    // GraphQL
    const apolloServer = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ req }) => ({ req }),
    });

    await apolloServer.start();
    apolloServer.applyMiddleware({
      app,
      path: '/graphql',
      cors: {
        origin: serverConfig.corsOrigins,
        credentials: true,
      },
    });

    // Start HTTP Server
    const server = createServer(app);
    server.listen(serverConfig.port, () => {
      console.log(`🚀 Server running at http://localhost:${serverConfig.port}`);
      console.log(`🔗 GraphQL ready at http://localhost:${serverConfig.port}/graphql`);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('Shutting down gracefully...');
      await redisClient.quit();
      await pool.end();
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
