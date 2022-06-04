import { Request, Response, NextFunction } from "express";
import { LangTypes } from "../@types/app.type";
import { usersRoles } from "../enums/auth.enum";
import { extractDataFromToken } from "../functions/jwt";
import response from "../helpers/response";

export const checkIfDoctor = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { lang } = req.params;
  const { role } = extractDataFromToken(req);

  role === usersRoles.DOCTOR
    ? next()
    : response.unauthorized(lang as LangTypes, res);
};
