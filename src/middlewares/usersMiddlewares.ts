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

export const middlewareHandler = (
  doctorCallback: any,
  patientCallback: any
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const { role } = req.params;
      const token_data = extractDataFromToken(req);

      if (role) {
        role === usersRoles.DOCTOR
          ? doctorCallback(req, res, next)
          : patientCallback(req, res, next);
      } else if (token_data) {
        token_data?.role === usersRoles.DOCTOR
          ? doctorCallback(req, res, next)
          : patientCallback(req, res, next);
      }
    } catch (error) {
      response.somethingWentWrong("ar", res, error as Error);
    }
  };
};
