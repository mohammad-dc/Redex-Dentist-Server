import { Request, Response, NextFunction } from "express";
import { LangTypes } from "../@types/app.type";
import response from "../helpers/response";
import reportsReasonsModel from "../models/reportsReasons.model";

export class ReportReasonsService {
  //users
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

  //admin
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

  async getAllReasonsDetails(req: Request, res: Response, next: NextFunction) {
    const { skip } = req.query;

    try {
      const results = await reportsReasonsModel
        .aggregate([])
        .lookup({
          as: "reports",
          from: "reports",
          localField: "_id",
          foreignField: "reason",
        })
        .project({
          _id: 1,
          reason_ar: 1,
          reason_en: 1,
          reports_count: { $size: "$reports" },
        })
        .skip(skip ? parseInt(skip as string) : 0)
        .limit(20);
      response.getSuccess(res, results);
    } catch (error) {
      response.somethingWentWrong("ar", res, error as Error);
    }
  }
}
