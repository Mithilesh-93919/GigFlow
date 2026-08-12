import 'dotenv/config';
import app from './app';
import { connectDB, disconnectDB } from './config/database';
import { env } from './config/env';
import { logger } from './utils/logger';

const startServer = async (): Promise<void> => {
  await connectDB();

  const server = app.listen(env.port, () => {
    logger.info(`⚡ GigFlow API running in ${env.nodeEnv} mode on port ${env.port}`);
  });

  // ─── Graceful Shutdown ──────────────────────────────────────────────────
  const shutdown = async (signal: string): Promise<void> => {
    logger.warn(`${signal} received — shutting down gracefully...`);
    server.close(async () => {
      await disconnectDB();
      logger.info('Server and database connections closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  // ─── Unhandled Rejection Guard ──────────────────────────────────────────
  process.on('unhandledRejection', (reason: unknown) => {
    logger.error('Unhandled Promise Rejection:', reason);
    server.close(async () => {
      await disconnectDB();
      process.exit(1);
    });
  });
};

startServer().catch((err: unknown) => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});
