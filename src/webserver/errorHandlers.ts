import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'joi';
import * as logger from '../utils/logger';

export const handleValidationError = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ValidationError) {
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
