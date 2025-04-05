interface ErrorMetadata {
  [key: string]: any;
}

/**
 * NBA Error handler. Transforms errors into a consistent and easy to read format.
 * Example: 
 * throw new NBAError('Failed to fetch teams', 'TEAMS_FETCH_ERROR', 404, { metadata });
 */
export class NBAError extends Error {
  errorCode: string;
  status: number;
  metadata?: ErrorMetadata;

  constructor(
    error: string | Error,
    errorCode: string = 'UNKNOWN',
    status: number,
    metadata: ErrorMetadata = {}
  ) {
    super(error instanceof Error ? error.message : error);
    this.name = 'NBAError';
    this.errorCode = errorCode;
    this.metadata = metadata;
    this.status = status || 500;

    // Ensure proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, NBAError.prototype);
  }
} 