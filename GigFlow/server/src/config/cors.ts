import { CorsOptions } from 'cors';

export const corsOptions: CorsOptions = {
  origin: (_origin, callback) => {
    // Allow all origins for this deployment since it's a unified app
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
};
