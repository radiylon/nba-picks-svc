import { Request, Response, NextFunction } from 'express';
import { NBAError } from '../helpers/Error';

/**
 * Error handling middleware for NBA API.
 * Handles NBAErrors and regular errors.
 * @param err The error to handle.
 * @param req The request object.
 * @param res The response object.
 * @param next The next function.
 */
export const errorHandler = (
  err: Error | NBAError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Handle NBAErrors
  if (err instanceof NBAError) {
    return res.status(err.status).json({
      error: {
        message: err.message,
        errorCode: err.errorCode,
        status: err.status,
        metadata: err.metadata
      }
    });
  }

  // Handle regular errors
  return res.status(500).json({
    error: {
      message: err.message || 'Internal Server Error',
      errorCode: 'UNKNOWN',
      status: 500,
      meta: {}
    }
  });
}; 