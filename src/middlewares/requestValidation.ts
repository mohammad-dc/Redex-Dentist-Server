import { Request, Response, NextFunction } from "express";
import response from "../helpers/response";

export const checkRequestValidation = (schema: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedBody = await schema.validate(req.body);
      req.body = validatedBody;
      next();
    } catch (error) {
      response.validationError(res, error as Error);
    }
  };
};
