import { Request, Response, NextFunction } from "express";
import { LangTypes } from "../@types/app.type";
import { extractDataFromToken } from "../functions/jwt";
import response from "../helpers/response";
import reportsModel from "../models/reports.model";

export class ReportService {
  async addReport(req: Request, res: Response, next: NextFunction) {
    const { lang } = req.params;
    const { reason, content, report_to } = req.body;

    try {
      const { user_id } = extractDataFromToken(req);
      await new reportsModel({
        reason,
        content,
        report_from: user_id,
        report_to,
      }).save();
      response.addedSuccess(lang as LangTypes, res);
    } catch (error) {
      response.somethingWentWrong(lang as LangTypes, res, error as Error);
    }
  }

  async getAllReports(req: Request, res: Response, next: NextFunction) {}
}
