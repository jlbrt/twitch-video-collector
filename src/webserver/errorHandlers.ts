import type { Request, Response, NextFunction } from 'express';
import * as logger from '../utils/logger';
import { ZodError } from 'zod';

export const handleValidationError = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: err.message,
    });
  }

  return next(err);
};

export const handleUnhandledError = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.log('Error reached *handleUnhandledError* Error Handler', err);
  return res.sendStatus(500);
};
