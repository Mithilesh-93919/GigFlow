import { Router } from 'express';
import { healthRouter } from './health.routes';
import { authRouter } from './auth.routes';
import { leadRouter } from './lead.routes';

/**
 * API router — single mount point for all versioned routes.
 * Mount in app.ts: app.use('/api/v1', apiRouter);
 */
export const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/leads', leadRouter);

// Add future feature routers here:
// import { userRouter } from './user.routes';
// apiRouter.use('/users', userRouter);
