import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { corsOptions } from './config/cors';
import { requestLogger } from './middlewares/requestLogger';
import { notFoundHandler } from './middlewares/notFound';
import { errorHandler } from './middlewares/errorHandler';
import { apiRouter } from './routes/index.routes';

const app: Application = express();

// ─── Security & CORS ────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors(corsOptions));

// ─── Body Parsers ───────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Request Logger ─────────────────────────────────────────────────────────
app.use(requestLogger);

// ─── API Routes ─────────────────────────────────────────────────────────────
app.use('/api/v1', apiRouter);

// ─── 404 Handler ────────────────────────────────────────────────────────────
app.use(notFoundHandler);

// ─── Global Error Handler (must be last) ────────────────────────────────────
app.use(errorHandler);

export default app;
