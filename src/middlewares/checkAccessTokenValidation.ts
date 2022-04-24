import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config.config";
import response from "../helpers/response";

export const checkAccessTokenValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (token) {
    jwt.verify(token, config.jwt.user.secret || "", (error, decoded) => {
      if (error) {
        response.unauthorized(res);
      } else {
        res.locals.jwt = decoded;
        next();
      }
    });
  } else {
    response.unauthorized(res);
  }
};
