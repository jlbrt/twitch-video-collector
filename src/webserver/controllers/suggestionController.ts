import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import * as videoDAO from '../../dao/videoDAO';
import * as logger from '../../utils/logger';

export const handleGetSuggestions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validateReqQuery = (
      data: any
    ): Promise<{ fromTimestamp: number }> => {
      const reqQuerySchema = Joi.object({
        fromTimestamp: Joi.number().integer().min(0).default(0),
      }).required();

      return reqQuerySchema.validateAsync(data);
    };

    const reqQuery = await validateReqQuery(req.query);
    const fromTimestamp = new Date(reqQuery.fromTimestamp);

    const videosWithSuggestions = await videoDAO.getVideosWithSuggestions(
      fromTimestamp
    );

    return res.json({
      data: videosWithSuggestions,
    });
  } catch (err) {
    return next(err);
  }
};
