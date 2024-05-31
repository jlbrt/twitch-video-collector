import type { Request, Response, NextFunction } from 'express';
import * as videoDAO from '../../DAO/videoDAO';
import { z } from 'zod';

export const handleGetSuggestions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reqQuerySchema = z.object({
      fromTimestamp: z.coerce.number().int().nonnegative().default(0),
    });

    const reqQuery = reqQuerySchema.parse(req.query);
    const fromTimestamp = new Date(reqQuery.fromTimestamp);

    const videosWithSuggestions =
      await videoDAO.getVideosWithSuggestions(fromTimestamp);

    return res.json({
      data: videosWithSuggestions,
    });
  } catch (err) {
    return next(err);
  }
};
