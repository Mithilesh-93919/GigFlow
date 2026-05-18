import app from '../server/src/app';
import { connectDB } from '../server/src/config/database';

// Global variable to keep track of DB connection across serverless invocations
let isDBConnected = false;

export default async function handler(req: any, res: any) {
  if (!isDBConnected) {
    await connectDB();
    isDBConnected = true;
  }
  return app(req, res);
}
