import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { LangTypes } from "../@types/app.type";
import config from "../config/config.config";
import response from "../helpers/response";

export const checkAccessTokenValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { lang } = req.params;
  const token = req.headers.authorization?.split(" ")[1];

  if (token) {
    jwt.verify(token, config.jwt.user.secret || "", (error, decoded) => {
      if (error) {
        response.unauthorized(lang as LangTypes, res);
      } else {
        res.locals.jwt = decoded;
        next();
      }
    });
  } else {
    response.unauthorized(lang as LangTypes, res);
  }
};
