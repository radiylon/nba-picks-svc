import { Request, Response, NextFunction } from 'express';

interface NBAError extends Error {
  status?: number;
}

export const errorHandler = (
  err: NBAError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    error: {
      message,
      status
    }
  });
}; 