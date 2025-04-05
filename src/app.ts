import express, { ErrorRequestHandler } from 'express';
import NBARouter from './routes/NBARouter';
import { errorHandler } from './middleware/NBAMiddleware';

const app = express();

// Routes
app.use('/v1', NBARouter());

// Error handling middleware
app.use(errorHandler as unknown as ErrorRequestHandler);

export default app;
