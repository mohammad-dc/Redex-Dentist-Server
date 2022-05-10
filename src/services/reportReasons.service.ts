import { Request, Response, NextFunction } from "express";
import { LangTypes } from "../@types/app.type";
import response from "../helpers/response";
import reportsReasonsModel from "../models/reportsReasons.model";

export class ReportReasonsService {
  async addReason(req: Request, res: Response, next: NextFunction) {
    const { lang } = req.params;
    const { reason_ar, reason_en } = req.body;

    try {
      await new reportsReasonsModel({ reason_ar, reason_en }).save();
      response.addedSuccess(lang as LangTypes, res);
    } catch (error) {
      response.somethingWentWrong(lang as LangTypes, res, error as Error);
    }
  }

  async updateReason(req: Request, res: Response, next: NextFunction) {
    const { lang, _id } = req.params;
    const { reason_ar, reason_en } = req.body;

    try {
      const result = await reportsReasonsModel.findByIdAndUpdate(
        { _id },
        { reason_ar, reason_en }
      );
      result
        ? response.updatedSuccess(lang as LangTypes, res)
        : response.itemNotExist(lang as LangTypes, res);
    } catch (error) {
      response.somethingWentWrong(lang as LangTypes, res, error as Error);
    }
  }

  async getAllReasons(req: Request, res: Response, next: NextFunction) {
    const { lang } = req.params;
    try {
      const result = await reportsReasonsModel.aggregate([]).project({
        _id: "$_id",
        reason: lang === "ar" ? "$reason_ar" : "$reason_en",
      });

      response.getSuccess(res, result);
    } catch (error) {
      response.somethingWentWrong(lang as LangTypes, res, error as Error);
    }
  }
}
